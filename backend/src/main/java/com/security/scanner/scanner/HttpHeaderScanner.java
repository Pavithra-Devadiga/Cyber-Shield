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
import java.net.http.HttpHeaders;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

@Component
public class HttpHeaderScanner implements ScannerModule {

    private static final Logger log = LoggerFactory.getLogger(HttpHeaderScanner.class);
    private final SafeHttpClientFactory clientFactory;

    // Recognized global browser HSTS Preload list (Chromium, Firefox, Safari)
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

        try {
            // 1. Follow redirects step-by-step to arrive at the FINAL HTTPS response
            SafeHttpClientFactory.TargetResolution resolution = clientFactory.resolveTarget(targetUri);
            URI finalUri = resolution.finalUri();
            HttpHeaders headers = resolution.headers();
            int statusCode = resolution.statusCode();
            String body = resolution.body() != null ? resolution.body() : "";
            String lowerBody = body.toLowerCase();

            result.addMetadata("initialUri", targetUri.toString());
            result.addMetadata("finalUri", finalUri.toString());
            result.addMetadata("statusCode", statusCode);

            if (resolution.redirected()) {
                result.addMetadata("redirectChain", String.join(" -> ", resolution.redirectChain()));
                result.addMetadata("httpToHttpsEnforced", resolution.httpToHttpsRedirected());
            }

            if (headers == null) {
                result.setSuccess(false);
                result.setErrorMessage("Could not retrieve HTTP headers from target or final redirect.");
                return result;
            }

            Map<String, List<String>> headerMap = headers.map();
            result.addMetadata("headersAnalyzedCount", headerMap.size());

            String host = finalUri.getHost() != null ? finalUri.getHost() : targetUri.getHost();
            boolean isHttps = finalUri.getScheme().equalsIgnoreCase("https") || resolution.httpToHttpsRedirected();

            // -------------------------------------------------------------------------
            // 1. Strict-Transport-Security (HSTS) - Specifically evaluated on HTTPS responses
            // -------------------------------------------------------------------------
            Optional<String> hsts = headers.firstValue("strict-transport-security");
            if (isHttps) {
                if (hsts.isPresent() && !hsts.get().trim().isEmpty()) {
                    String hstsVal = hsts.get().toLowerCase();
                    result.addMetadata("hstsHeaderPresent", true);

                    // Check for minimum 6-month max-age (15552000 seconds)
                    if (hstsVal.contains("max-age=0")) {
                        result.addVulnerability(new Vulnerability(
                                scan,
                                "HSTS Header Disabled (max-age=0)",
                                "The Strict-Transport-Security header has max-age set to 0, which disables HSTS protections in browsers.",
                                Severity.LOW,
                                VulnerabilityCategory.SECURITY_HEADERS,
                                "CWE-319",
                                "Set max-age to at least 15552000 (6 months) or 31536000 (1 year).",
                                "Strict-Transport-Security: " + hsts.get(),
                                finalUri.toString()
                        ));
                    } else if (!hstsVal.contains("includesubdomains")) {
                        result.addVulnerability(new Vulnerability(
                                scan,
                                "HSTS Active (includeSubDomains optional)",
                                "The Strict-Transport-Security header is active on the host. Adding 'includeSubDomains' is recommended to extend protection to all subdomains.",
                                Severity.INFO,
                                VulnerabilityCategory.SECURITY_HEADERS,
                                "CWE-319",
                                "Append '; includeSubDomains' to the Strict-Transport-Security header value.",
                                "Strict-Transport-Security: " + hsts.get(),
                                finalUri.toString()
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
                            finalUri.toString()
                    ));
                } else {
                    result.addVulnerability(new Vulnerability(
                            scan,
                            "Missing HTTP Strict Transport Security (HSTS) Header",
                            "The web application does not supply an HSTS header. While the session uses HTTPS, an HSTS header protects return visitors from future protocol downgrade attempts.",
                            Severity.LOW,
                            VulnerabilityCategory.SECURITY_HEADERS,
                            "CWE-319",
                            "Add 'Strict-Transport-Security: max-age=31536000; includeSubDomains; preload' to all HTTPS responses.",
                            "Strict-Transport-Security header was not detected on final HTTPS response.",
                            finalUri.toString()
                    ));
                }
            }

            // -------------------------------------------------------------------------
            // 2. Content-Security-Policy (CSP) - Distinguish Enforcing vs Report-Only
            // -------------------------------------------------------------------------
            Optional<String> csp = headers.firstValue("content-security-policy");
            Optional<String> cspReportOnly = headers.firstValue("content-security-policy-report-only");
            boolean hasMetaCsp = lowerBody.contains("http-equiv=\"content-security-policy\"") || lowerBody.contains("http-equiv='content-security-policy'");

            if (csp.isPresent() && !csp.get().trim().isEmpty()) {
                String cspValue = csp.get().toLowerCase();
                boolean hasNonceOrStrict = cspValue.contains("nonce-") || cspValue.contains("strict-dynamic") || cspValue.contains("sha256-");

                // In CSP Level 3, if nonce/strict-dynamic is present, browsers ignore unsafe-inline as safe fallback
                if ((cspValue.contains("unsafe-inline") || cspValue.contains("unsafe-eval")) && !hasNonceOrStrict) {
                    result.addVulnerability(new Vulnerability(
                            scan,
                            "Insecure Directives in Content-Security-Policy",
                            "The CSP header allows 'unsafe-inline' or 'unsafe-eval' without cryptographic nonces or hashes, weakening protections against Cross-Site Scripting (XSS).",
                            Severity.LOW,
                            VulnerabilityCategory.SECURITY_HEADERS,
                            "CWE-693",
                            "Refactor inline scripts and use cryptographic nonces or hashes instead of 'unsafe-inline'. Avoid 'unsafe-eval'.",
                            "Content-Security-Policy: " + csp.get(),
                            finalUri.toString()
                    ));
                }
            } else if (cspReportOnly.isPresent() && !cspReportOnly.get().trim().isEmpty()) {
                // Google and enterprise sites actively deploy CSP in report-only mode
                result.addMetadata("cspReportOnlyActive", true);
                result.addVulnerability(new Vulnerability(
                        scan,
                        "Content-Security-Policy Configured in Report-Only Mode",
                        "The application uses 'Content-Security-Policy-Report-Only' to monitor policy violations without active blocking. Migrating tested directives to an enforcing header is recommended for full defense-in-depth.",
                        Severity.INFO,
                        VulnerabilityCategory.SECURITY_HEADERS,
                        "CWE-693",
                        "Promote tested report-only directives to an active enforcing Content-Security-Policy header.",
                        "Content-Security-Policy-Report-Only: " + cspReportOnly.get(),
                        finalUri.toString()
                ));
            } else if (hasMetaCsp) {
                result.addMetadata("cspMetaTagPresent", true);
            } else {
                result.addVulnerability(new Vulnerability(
                        scan,
                        "Missing Content-Security-Policy (CSP) Header",
                        "The application does not declare a Content-Security-Policy header. Configuring CSP provides defense-in-depth against client-side injection and unauthorized script execution.",
                        Severity.LOW,
                        VulnerabilityCategory.SECURITY_HEADERS,
                        "CWE-693",
                        "Configure a Content-Security-Policy header restricting script-src, style-src, default-src, and object-src directives.",
                        "Content-Security-Policy header was absent in response.",
                        finalUri.toString()
                ));
            }

            // -------------------------------------------------------------------------
            // 3. X-Frame-Options & Clickjacking Protection
            // -------------------------------------------------------------------------
            Optional<String> xfo = headers.firstValue("x-frame-options");
            boolean hasFrameAncestors = (csp.isPresent() && csp.get().toLowerCase().contains("frame-ancestors"))
                    || (cspReportOnly.isPresent() && cspReportOnly.get().toLowerCase().contains("frame-ancestors"));

            if (xfo.isPresent() && !xfo.get().trim().isEmpty()) {
                result.addMetadata("clickjackingProtected", true);
            } else if (hasFrameAncestors) {
                result.addMetadata("clickjackingProtectedViaCsp", true);
            } else {
                result.addVulnerability(new Vulnerability(
                        scan,
                        "Missing Clickjacking Protection (X-Frame-Options)",
                        "The web application does not set X-Frame-Options or CSP frame-ancestors, which may allow external sites to render this interface inside an iframe and perform clickjacking.",
                        Severity.MEDIUM,
                        VulnerabilityCategory.SECURITY_HEADERS,
                        "CWE-1021",
                        "Set 'X-Frame-Options: SAMEORIGIN' or declare 'frame-ancestors 'self'' in CSP.",
                        "Neither X-Frame-Options nor frame-ancestors directive was detected.",
                        finalUri.toString()
                ));
            }

            // -------------------------------------------------------------------------
            // 4. X-Content-Type-Options (MIME-Sniffing Defense)
            // -------------------------------------------------------------------------
            Optional<String> xcto = headers.firstValue("x-content-type-options");
            if (xcto.isPresent() && xcto.get().equalsIgnoreCase("nosniff")) {
                result.addMetadata("xctoConfigured", true);
            } else {
                Optional<String> contentType = headers.firstValue("content-type");
                boolean hasExplicitCharset = contentType.isPresent() && contentType.get().toLowerCase().contains("charset");

                if (hasExplicitCharset) {
                    result.addVulnerability(new Vulnerability(
                            scan,
                            "Missing 'X-Content-Type-Options: nosniff' (Mitigated by Explicit Charset)",
                            "The response specifies an explicit Content-Type with charset (" + contentType.get() + "), mitigating browser MIME sniffing. Setting 'nosniff' is recommended as a hardening best practice.",
                            Severity.INFO,
                            VulnerabilityCategory.SECURITY_HEADERS,
                            "CWE-79",
                            "Add 'X-Content-Type-Options: nosniff' to all HTTP responses.",
                            "Content-Type: " + contentType.get(),
                            finalUri.toString()
                    ));
                } else {
                    result.addVulnerability(new Vulnerability(
                            scan,
                            "Missing X-Content-Type-Options: nosniff Header",
                            "Browsers may attempt MIME sniffing on ambiguous content types. Setting 'nosniff' prevents MIME-confusion script execution.",
                            Severity.LOW,
                            VulnerabilityCategory.SECURITY_HEADERS,
                            "CWE-79",
                            "Set 'X-Content-Type-Options: nosniff' on all web server responses.",
                            "X-Content-Type-Options header: " + xcto.orElse("None"),
                            finalUri.toString()
                    ));
                }
            }

            // -------------------------------------------------------------------------
            // 5. Referrer-Policy (Checks Header AND Document Meta Tag)
            // -------------------------------------------------------------------------
            Optional<String> referrer = headers.firstValue("referrer-policy");
            boolean hasMetaReferrer = lowerBody.contains("name=\"referrer\"") || lowerBody.contains("name='referrer'")
                    || lowerBody.contains("http-equiv=\"referrer-policy\"") || lowerBody.contains("http-equiv='referrer-policy'");

            if (referrer.isPresent() && !referrer.get().trim().isEmpty()) {
                result.addMetadata("referrerPolicyConfigured", true);
            } else if (hasMetaReferrer) {
                result.addMetadata("referrerPolicyMetaConfigured", true);
            } else {
                result.addVulnerability(new Vulnerability(
                        scan,
                        "Missing Referrer-Policy Header",
                        "Without a Referrer-Policy declaration, outbound links may transmit full query URLs in the HTTP Referer header.",
                        Severity.INFO,
                        VulnerabilityCategory.SECURITY_HEADERS,
                        "CWE-200",
                        "Set 'Referrer-Policy: strict-origin-when-cross-origin' in HTTP response headers or via document <meta>.",
                        "Referrer-Policy was not declared in headers or document metadata.",
                        finalUri.toString()
                ));
            }

            // -------------------------------------------------------------------------
            // 6. Permissions-Policy / Feature-Policy
            // -------------------------------------------------------------------------
            Optional<String> permissions = headers.firstValue("permissions-policy");
            Optional<String> featurePolicy = headers.firstValue("feature-policy");

            if (permissions.isPresent() && !permissions.get().trim().isEmpty()) {
                result.addMetadata("permissionsPolicyConfigured", true);
            } else if (featurePolicy.isPresent() && !featurePolicy.get().trim().isEmpty()) {
                result.addMetadata("featurePolicyConfigured", true);
            } else {
                result.addVulnerability(new Vulnerability(
                        scan,
                        "Missing Permissions-Policy Header",
                        "The application does not declare browser feature permissions (e.g. camera, microphone, geolocation) for embedded iframe contexts.",
                        Severity.INFO,
                        VulnerabilityCategory.SECURITY_HEADERS,
                        "CWE-693",
                        "Define a Permissions-Policy header, e.g. 'Permissions-Policy: camera=(), microphone=(), geolocation=()'.",
                        "Permissions-Policy header was absent.",
                        finalUri.toString()
                ));
            }

            // -------------------------------------------------------------------------
            // 7. Server Header Version Disclosure (Only flag if numeric versions leak)
            // -------------------------------------------------------------------------
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
                        finalUri.toString()
                ));
            }

            // -------------------------------------------------------------------------
            // 8. X-Powered-By Technology Disclosure
            // -------------------------------------------------------------------------
            Optional<String> poweredBy = headers.firstValue("x-powered-by");
            if (poweredBy.isPresent() && !poweredBy.get().trim().isEmpty()) {
                result.addVulnerability(new Vulnerability(
                        scan,
                        "Technology Stack Information Disclosure in 'X-Powered-By'",
                        "The application discloses backend framework details via the X-Powered-By header.",
                        Severity.LOW,
                        VulnerabilityCategory.SECURITY_HEADERS,
                        "CWE-200",
                        "Disable or remove the X-Powered-By header in application configuration.",
                        "X-Powered-By: " + poweredBy.get(),
                        finalUri.toString()
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
