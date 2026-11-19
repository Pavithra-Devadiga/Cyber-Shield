package com.security.scanner.scanner;

import com.security.scanner.entity.Scan;
import com.security.scanner.entity.Vulnerability;
import com.security.scanner.entity.enums.Severity;
import com.security.scanner.entity.enums.VulnerabilityCategory;
import com.security.scanner.util.SafeHttpClientFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpHeaders;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

@Component
public class HttpHeaderScanner implements ScannerModule {

    private static final Logger log = LoggerFactory.getLogger(HttpHeaderScanner.class);
    private final SafeHttpClientFactory clientFactory;

    // Major top domains registered in global browser HSTS Preload list (Chromium, Firefox, Safari)
    private static final Set<String> HSTS_PRELOADED_ROOTS = Set.of(
            "google.com", "google.co.in", "google.co.uk", "google.ca", "google.de", "google.fr", "google.com.au",
            "gmail.com", "youtube.com", "apple.com", "icloud.com", "github.com", "github.io", "microsoft.com",
            "cloudflare.com", "amazon.com", "aws.amazon.com", "facebook.com", "instagram.com", "whatsapp.com",
            "twitter.com", "x.com", "netflix.com", "wikipedia.org", "mozilla.org", "paypal.com"
    );

    public HttpHeaderScanner(SafeHttpClientFactory clientFactory) {
        this.clientFactory = clientFactory;
    }

    @Override
    public String getModuleId() {
        return "HEADERS";
    }

    @Override
    public String getDisplayName() {
        return "HTTP Security Headers Scanner";
    }

    private boolean isHstsPreloaded(String host) {
        if (host == null) return false;
        String h = host.toLowerCase();
        if (h.endsWith(".app") || h.endsWith(".dev") || h.endsWith(".page")) return true;
        for (String root : HSTS_PRELOADED_ROOTS) {
            if (h.equals(root) || h.endsWith("." + root)) {
                return true;
            }
        }
        return false;
    }

    @Override
    public ScannerResult scan(URI targetUri, Scan scan) {
        ScannerResult result = new ScannerResult(getModuleId());
        HttpClient client = clientFactory.createPermissiveSslClient();

        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(targetUri)
                    .timeout(Duration.ofSeconds(10))
                    .header("User-Agent", SafeHttpClientFactory.DEFAULT_USER_AGENT)
                    .GET()
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            HttpHeaders headers = response.headers();
            Map<String, List<String>> headerMap = headers.map();
            String body = response.body() != null ? response.body() : "";
            String lowerBody = body.toLowerCase();

            result.addMetadata("statusCode", response.statusCode());
            result.addMetadata("headersAnalyzedCount", headerMap.size());

            String host = targetUri.getHost();

            // 1. Strict-Transport-Security (HSTS)
            Optional<String> hsts = headers.firstValue("strict-transport-security");
            if (targetUri.getScheme().equalsIgnoreCase("https")) {
                if (hsts.isPresent()) {
                    String hstsVal = hsts.get().toLowerCase();
                    if (!hstsVal.contains("includesubdomains")) {
                        result.addVulnerability(new Vulnerability(
                                scan,
                                "HSTS Header Active (includeSubDomains optional)",
                                "The HSTS header is configured on the root domain. Including 'includeSubDomains' is recommended for comprehensive child subdomain protection.",
                                Severity.INFO,
                                VulnerabilityCategory.SECURITY_HEADERS,
                                "CWE-319",
                                "Include 'includeSubDomains' in the Strict-Transport-Security header value.",
                                "Strict-Transport-Security: " + hsts.get(),
                                targetUri.toString()
                        ));
                    }
                } else if (isHstsPreloaded(host)) {
                    result.addMetadata("hstsPreloaded", true);
                    result.addVulnerability(new Vulnerability(
                            scan,
                            "HSTS Enforced via Global Browser Preload List",
                            "The domain '" + host + "' is hardcoded in the Chromium, Firefox, and Safari browser HSTS Preload list, ensuring permanent HTTPS enforcement without requiring an on-the-wire header.",
                            Severity.INFO,
                            VulnerabilityCategory.SECURITY_HEADERS,
                            "CWE-319",
                            "Domain is natively preloaded in browser engines.",
                            "Host verified in browser preload registry: " + host,
                            targetUri.toString()
                    ));
                } else {
                    result.addVulnerability(new Vulnerability(
                            scan,
                            "Missing HTTP Strict Transport Security (HSTS) Header",
                            "The web application does not send an HSTS header, which is recommended to enforce HTTPS communication across modern browsers.",
                            Severity.LOW,
                            VulnerabilityCategory.SECURITY_HEADERS,
                            "CWE-319",
                            "Add 'Strict-Transport-Security: max-age=31536000; includeSubDomains; preload' to all HTTPS responses.",
                            "Strict-Transport-Security header was not present in the HTTP response.",
                            targetUri.toString()
                    ));
                }
            }

            // 2. Content-Security-Policy (CSP)
            Optional<String> csp = headers.firstValue("content-security-policy");
            Optional<String> cspReportOnly = headers.firstValue("content-security-policy-report-only");
            boolean hasMetaCsp = lowerBody.contains("http-equiv=\"content-security-policy\"") || lowerBody.contains("http-equiv='content-security-policy'");

            if (csp.isPresent()) {
                String cspValue = csp.get().toLowerCase();
                boolean hasNonceOrStrict = cspValue.contains("nonce-") || cspValue.contains("strict-dynamic") || cspValue.contains("sha256-");
                // If nonce or strict-dynamic is present, browsers ignore unsafe-inline as safe fallback
                if ((cspValue.contains("unsafe-inline") || cspValue.contains("unsafe-eval")) && !hasNonceOrStrict) {
                    result.addVulnerability(new Vulnerability(
                            scan,
                            "Insecure Directives in Content-Security-Policy (unsafe-inline / unsafe-eval)",
                            "The CSP header allows 'unsafe-inline' or 'unsafe-eval' without cryptographic nonces or hashes, weakening protections against Cross-Site Scripting (XSS).",
                            Severity.LOW,
                            VulnerabilityCategory.SECURITY_HEADERS,
                            "CWE-693",
                            "Use cryptographic nonces or hashes instead of 'unsafe-inline'. Avoid 'unsafe-eval'.",
                            "Content-Security-Policy: " + csp.get(),
                            targetUri.toString()
                    ));
                }
            } else if (cspReportOnly.isPresent()) {
                result.addMetadata("cspReportOnlyActive", true);
                result.addVulnerability(new Vulnerability(
                        scan,
                        "Content-Security-Policy Active in Report-Only Mode",
                        "The application uses 'Content-Security-Policy-Report-Only' to validate and audit script execution policies without blocking client workflows.",
                        Severity.INFO,
                        VulnerabilityCategory.SECURITY_HEADERS,
                        "CWE-693",
                        "Promote tested report-only directives to an active enforcing Content-Security-Policy header.",
                        "Content-Security-Policy-Report-Only: " + cspReportOnly.get(),
                        targetUri.toString()
                ));
            } else if (hasMetaCsp) {
                result.addMetadata("cspMetaTagPresent", true);
            } else {
                result.addVulnerability(new Vulnerability(
                        scan,
                        "Missing Content-Security-Policy (CSP) Header",
                        "The application does not declare a Content-Security-Policy header. Configuring CSP provides valuable defense-in-depth against client-side injection attacks.",
                        Severity.LOW,
                        VulnerabilityCategory.SECURITY_HEADERS,
                        "CWE-693",
                        "Configure a Content-Security-Policy header restricting script-src, style-src, and object-src directives.",
                        "Content-Security-Policy header was absent in response.",
                        targetUri.toString()
                ));
            }

            // 3. X-Frame-Options (Clickjacking)
            Optional<String> xfo = headers.firstValue("x-frame-options");
            boolean hasFrameAncestors = (csp.isPresent() && csp.get().toLowerCase().contains("frame-ancestors"))
                    || (cspReportOnly.isPresent() && cspReportOnly.get().toLowerCase().contains("frame-ancestors"));

            if (xfo.isEmpty() && !hasFrameAncestors) {
                result.addVulnerability(new Vulnerability(
                        scan,
                        "Missing Clickjacking Protection (X-Frame-Options)",
                        "The web application does not set X-Frame-Options or CSP frame-ancestors, which may allow third-party sites to frame this interface.",
                        Severity.MEDIUM,
                        VulnerabilityCategory.SECURITY_HEADERS,
                        "CWE-1021",
                        "Set 'X-Frame-Options: SAMEORIGIN' or configure 'frame-ancestors 'self'' in CSP.",
                        "Neither X-Frame-Options nor frame-ancestors directive was detected.",
                        targetUri.toString()
                ));
            }

            // 4. X-Content-Type-Options (MIME Sniffing)
            Optional<String> xcto = headers.firstValue("x-content-type-options");
            if (xcto.isEmpty() || !xcto.get().equalsIgnoreCase("nosniff")) {
                Optional<String> contentType = headers.firstValue("content-type");
                boolean hasExplicitCharset = contentType.isPresent() && contentType.get().toLowerCase().contains("charset");

                if (hasExplicitCharset) {
                    result.addVulnerability(new Vulnerability(
                            scan,
                            "Missing 'X-Content-Type-Options: nosniff' (Mitigated by Explicit Charset)",
                            "The response specifies an explicit Content-Type with charset, mitigating MIME sniffing. Adding 'X-Content-Type-Options: nosniff' is recommended as a best practice.",
                            Severity.INFO,
                            VulnerabilityCategory.SECURITY_HEADERS,
                            "CWE-79",
                            "Add 'X-Content-Type-Options: nosniff' to all server responses.",
                            "Content-Type: " + contentType.orElse("None"),
                            targetUri.toString()
                    ));
                } else {
                    result.addVulnerability(new Vulnerability(
                            scan,
                            "Missing X-Content-Type-Options: nosniff Header",
                            "Browsers may attempt MIME sniffing on ambiguous content types. Setting 'nosniff' prevents MIME-confusion attacks.",
                            Severity.LOW,
                            VulnerabilityCategory.SECURITY_HEADERS,
                            "CWE-79",
                            "Set 'X-Content-Type-Options: nosniff' on all web server responses.",
                            "X-Content-Type-Options header: " + xcto.orElse("None"),
                            targetUri.toString()
                    ));
                }
            }

            // 5. Referrer-Policy (Checks Header AND HTML Meta Tag)
            Optional<String> referrer = headers.firstValue("referrer-policy");
            boolean hasMetaReferrer = lowerBody.contains("name=\"referrer\"") || lowerBody.contains("name='referrer'")
                    || lowerBody.contains("http-equiv=\"referrer-policy\"") || lowerBody.contains("http-equiv='referrer-policy'");

            if (referrer.isEmpty() && !hasMetaReferrer) {
                result.addVulnerability(new Vulnerability(
                        scan,
                        "Missing Referrer-Policy Header",
                        "Without a Referrer-Policy declaration, outbound links may transmit full query URLs in the HTTP Referer header.",
                        Severity.INFO,
                        VulnerabilityCategory.SECURITY_HEADERS,
                        "CWE-200",
                        "Set 'Referrer-Policy: strict-origin-when-cross-origin' in HTTP headers or via HTML <meta>.",
                        "Referrer-Policy was not set in headers or document metadata.",
                        targetUri.toString()
                ));
            }

            // 6. Permissions-Policy
            Optional<String> permissions = headers.firstValue("permissions-policy");
            if (permissions.isEmpty()) {
                result.addVulnerability(new Vulnerability(
                        scan,
                        "Missing Permissions-Policy Header",
                        "The application does not declare browser feature permissions (e.g. camera, microphone, geolocation) for embedded contexts.",
                        Severity.INFO,
                        VulnerabilityCategory.SECURITY_HEADERS,
                        "CWE-693",
                        "Define a Permissions-Policy header, e.g. 'Permissions-Policy: camera=(), microphone=(), geolocation=()'.",
                        "Permissions-Policy header was absent.",
                        targetUri.toString()
                ));
            }

            // 7. Server Header Version Disclosure
            Optional<String> server = headers.firstValue("server");
            if (server.isPresent() && server.get().matches(".*[0-9].*")) {
                result.addVulnerability(new Vulnerability(
                        scan,
                        "Web Server Version Disclosure in 'Server' Header",
                        "The web server exposes numerical software version details, assisting adversaries in fingerprinting known CVEs.",
                        Severity.LOW,
                        VulnerabilityCategory.SECURITY_HEADERS,
                        "CWE-200",
                        "Configure the web server to suppress or obfuscate version details.",
                        "Server: " + server.get(),
                        targetUri.toString()
                ));
            }

            // 8. X-Powered-By Disclosure
            Optional<String> poweredBy = headers.firstValue("x-powered-by");
            if (poweredBy.isPresent()) {
                result.addVulnerability(new Vulnerability(
                        scan,
                        "Technology Stack Information Disclosure in 'X-Powered-By'",
                        "The application discloses backend framework details via the X-Powered-By header.",
                        Severity.LOW,
                        VulnerabilityCategory.SECURITY_HEADERS,
                        "CWE-200",
                        "Disable or remove the X-Powered-By header in application configuration.",
                        "X-Powered-By: " + poweredBy.get(),
                        targetUri.toString()
                ));
            }

        } catch (Exception e) {
            log.error("Error executing HttpHeaderScanner on {}: {}", targetUri, e.getMessage());
            result.setSuccess(false);
            result.setErrorMessage("HTTP Header check failed: " + e.getMessage());
        }

        return result;
    }
}
