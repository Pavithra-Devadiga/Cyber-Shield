package com.security.scanner.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpHeaders;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.security.SecureRandom;
import java.security.cert.X509Certificate;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Component
public class SafeHttpClientFactory {

    private static final Logger log = LoggerFactory.getLogger(SafeHttpClientFactory.class);

    @Value("${scanner.connection.timeout-seconds:7}")
    private int connectTimeoutSeconds;

    public static final String DEFAULT_USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 CyberSecurityAuditor/2.0";

    public record TargetResolution(
            URI initialUri,
            URI finalUri,
            boolean redirected,
            List<String> redirectChain,
            boolean httpToHttpsRedirected,
            int statusCode,
            HttpHeaders headers,
            String body,
            boolean crossDomainRedirect,
            String externalRedirectHost,
            boolean isParkedDomain
    ) {
        public boolean isReachable() {
            return statusCode > 0 && statusCode != 404 && statusCode != 405 && statusCode != 410 && statusCode < 500 && !crossDomainRedirect && !isParkedDomain;
        }
    }

    /**
     * Builds a standard secure Java HttpClient with timeouts and automatic redirect policy.
     */
    public HttpClient createStandardClient() {
        return HttpClient.newBuilder()
                .version(HttpClient.Version.HTTP_2)
                .followRedirects(HttpClient.Redirect.ALWAYS)
                .connectTimeout(Duration.ofSeconds(connectTimeoutSeconds))
                .build();
    }

    /**
     * Builds an HttpClient that allows inspecting targets with self-signed or expired certs
     * specifically for SSL/TLS assessment without crashing on SSL handshake.
     */
    public HttpClient createPermissiveSslClient() {
        try {
            TrustManager[] trustAll = new TrustManager[]{
                new X509TrustManager() {
                    public X509Certificate[] getAcceptedIssuers() { return new X509Certificate[0]; }
                    public void checkClientTrusted(X509Certificate[] certs, String authType) {}
                    public void checkServerTrusted(X509Certificate[] certs, String authType) {}
                }
            };
            SSLContext sc = SSLContext.getInstance("TLS");
            sc.init(null, trustAll, new SecureRandom());

            return HttpClient.newBuilder()
                    .version(HttpClient.Version.HTTP_2)
                    .sslContext(sc)
                    .followRedirects(HttpClient.Redirect.ALWAYS)
                    .connectTimeout(Duration.ofSeconds(connectTimeoutSeconds))
                    .build();
        } catch (Exception e) {
            log.warn("Could not create permissive SSL context, falling back to standard client: {}", e.getMessage());
            return createStandardClient();
        }
    }

    /**
     * Resolves the canonical target by explicitly following redirects step-by-step (up to 10 hops).
     * Discovers HTTP to HTTPS upgrades, canonical domain normalization (e.g. google.com -> www.google.com),
     * prevents cross-domain redirect hijacking (e.g. pavithra.com -> google.com),
     * and captures the final response headers, body, and status code.
     */
    public TargetResolution resolveTarget(URI targetUri) {
        URI currentUri = targetUri;
        List<String> redirectChain = new ArrayList<>();
        boolean redirected = false;
        boolean httpToHttps = false;
        boolean crossDomainRedirect = false;
        String externalRedirectHost = null;

        HttpHeaders finalHeaders = null;
        int finalStatusCode = 0;
        String finalBody = "";

        try {
            for (int hop = 0; hop < 10; hop++) {
                HttpRequest request = HttpRequest.newBuilder()
                        .uri(currentUri)
                        .timeout(Duration.ofSeconds(connectTimeoutSeconds))
                        .header("User-Agent", DEFAULT_USER_AGENT)
                        .GET()
                        .build();

                // Send request without automatic follow to inspect intermediate redirect headers
                HttpClient noRedirectClient = HttpClient.newBuilder()
                        .followRedirects(HttpClient.Redirect.NEVER)
                        .connectTimeout(Duration.ofSeconds(connectTimeoutSeconds))
                        .sslContext(createPermissiveSslClient().sslContext())
                        .build();

                HttpResponse<String> response;
                try {
                    response = noRedirectClient.send(request, HttpResponse.BodyHandlers.ofString());
                } catch (Exception ex) {
                    // If HTTPS failed on initial attempt, check HTTP fallback on the same host
                    if (hop == 0 && "https".equalsIgnoreCase(currentUri.getScheme())) {
                        URI fallbackHttp = URI.create("http://" + currentUri.getRawAuthority() + currentUri.getRawPath());
                        log.debug("HTTPS probe failed for {}, trying HTTP fallback: {}", currentUri, ex.getMessage());
                        HttpRequest httpFallbackReq = HttpRequest.newBuilder()
                                .uri(fallbackHttp)
                                .timeout(Duration.ofSeconds(connectTimeoutSeconds))
                                .header("User-Agent", DEFAULT_USER_AGENT)
                                .GET()
                                .build();
                        response = noRedirectClient.send(httpFallbackReq, HttpResponse.BodyHandlers.ofString());
                        currentUri = fallbackHttp;
                    } else {
                        throw ex;
                    }
                }

                int status = response.statusCode();
                finalHeaders = response.headers();
                finalStatusCode = status;
                finalBody = response.body() != null ? response.body() : "";

                // Check for HTTP 3xx redirect status
                if ((status == 301 || status == 302 || status == 303 || status == 307 || status == 308)
                        && response.headers().firstValue("location").isPresent()) {
                    redirected = true;
                    String location = response.headers().firstValue("location").get();
                    URI nextUri = currentUri.resolve(location);

                    redirectChain.add(currentUri + " -> " + nextUri + " (" + status + ")");

                    // Check if redirect stays on the same site/domain
                    if (!isSameOrSubdomain(targetUri.getHost(), nextUri.getHost())) {
                        log.warn("Blocked cross-domain redirect from target {} to external domain {}", currentUri, nextUri);
                        crossDomainRedirect = true;
                        externalRedirectHost = nextUri.getHost();
                        // DO NOT follow redirects to external 3rd-party domains!
                        break;
                    }

                    if (currentUri.getScheme().equalsIgnoreCase("http") && nextUri.getScheme().equalsIgnoreCase("https")) {
                        httpToHttps = true;
                    }

                    log.debug("Hop #{}: {} redirects ({}) to {}", hop + 1, currentUri, status, nextUri);
                    currentUri = nextUri;
                } else {
                    // Reached final destination
                    break;
                }
            }
        } catch (Exception e) {
            log.warn("Target resolution failed for {}: {}", targetUri, e.getMessage());
        }

        boolean isParked = isParkedOrPlaceholder(finalBody, targetUri.getHost());
        if (isParked) {
            log.warn("Target {} detected as inactive parked domain or placeholder", targetUri);
        }

        return new TargetResolution(
                targetUri,
                currentUri,
                redirected,
                redirectChain,
                httpToHttps,
                finalStatusCode,
                finalHeaders,
                finalBody,
                crossDomainRedirect,
                externalRedirectHost,
                isParked
        );
    }

    /**
     * Detects parked domains, dead landers (e.g. window.location.href="/lander"),
     * and parking service placeholders that do not host a real web application.
     */
    public static boolean isParkedOrPlaceholder(String body, String host) {
        if (body == null || body.trim().isEmpty()) return false;
        String lower = body.toLowerCase().trim();

        // 1. Instant parking lander redirects (like pavi.com: window.location.href="/lander")
        if (lower.contains("location.href=\"/lander\"") || lower.contains("location.href = \"/lander\"")
                || lower.contains("location.href='/lander'") || lower.contains("location.href = '/lander'")
                || lower.contains("location.replace(\"/lander\")") || lower.contains("location.replace('/lander')")
                || lower.contains("/lander") && lower.contains("window.location")) {
            return true;
        }

        // 2. Extremely tiny stub body (< 220 chars) containing redirect scripts to lander/parking
        if (lower.length() < 220 && (lower.contains("window.location") || lower.contains("document.location") || lower.contains("window.onload"))) {
            if (lower.contains("lander") || lower.contains("parking") || lower.contains("redirect") || lower.contains("domain")) {
                return true;
            }
        }

        // 3. Known domain parking signatures
        if (lower.contains("sedoparking.com") || lower.contains("parkingcrew.net") || lower.contains("bodis.com")
                || lower.contains("domain is for sale") || lower.contains("buy this domain")
                || lower.contains("this domain may be for sale") || lower.contains("parked free, courtesy of")
                || lower.contains("domain has been registered") || lower.contains("domain name is parked")
                || lower.contains("hugedomains.com") || lower.contains("dan.com/buy-domain")) {
            return true;
        }

        return false;
    }

    /**
     * Checks if two hosts belong to the same base domain or subdomain hierarchy.
     */
    public static boolean isSameOrSubdomain(String host1, String host2) {
        if (host1 == null || host2 == null) return false;
        String h1 = host1.toLowerCase().trim();
        String h2 = host2.toLowerCase().trim();
        if (h1.equals(h2)) return true;

        String base1 = h1.startsWith("www.") ? h1.substring(4) : h1;
        String base2 = h2.startsWith("www.") ? h2.substring(4) : h2;
        if (base1.equals(base2)) return true;

        if (h2.endsWith("." + base1)) return true;
        if (h1.endsWith("." + base2)) return true;

        return false;
    }
}
