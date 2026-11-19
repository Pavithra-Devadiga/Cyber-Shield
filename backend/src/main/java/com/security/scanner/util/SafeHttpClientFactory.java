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
            String body
    ) {}

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
     * and captures the final response headers, body, and status code.
     */
    public TargetResolution resolveTarget(URI targetUri) {
        HttpClient client = createPermissiveSslClient();
        URI currentUri = targetUri;
        List<String> redirectChain = new ArrayList<>();
        boolean redirected = false;
        boolean httpToHttps = false;

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

                HttpResponse<String> response = noRedirectClient.send(request, HttpResponse.BodyHandlers.ofString());
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
            log.warn("Redirect resolution ended or failed for {}: {}", targetUri, e.getMessage());
        }

        return new TargetResolution(
                targetUri,
                currentUri,
                redirected,
                redirectChain,
                httpToHttps,
                finalStatusCode,
                finalHeaders,
                finalBody
        );
    }
}
