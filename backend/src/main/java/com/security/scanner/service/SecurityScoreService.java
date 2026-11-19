package com.security.scanner.service;

import com.security.scanner.entity.Vulnerability;
import com.security.scanner.entity.enums.Severity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SecurityScoreService {

    public record ScoreResult(int score, String grade) {}

    /**
     * Calculates the security posture score (0-100) and corresponding letter grade.
     * Follows industry standard CVSS-weighted scoring rules.
     */
    public ScoreResult calculateScore(List<Vulnerability> vulnerabilities) {
        if (vulnerabilities == null || vulnerabilities.isEmpty()) {
            return new ScoreResult(100, "A+");
        }

        int score = 100;
        int criticalCount = 0;
        int highCount = 0;
        int mediumCount = 0;
        int lowCount = 0;

        for (Vulnerability v : vulnerabilities) {
            if (v.getSeverity() == Severity.CRITICAL) {
                criticalCount++;
                score -= 30; // Severe active exploitation vectors (SQLi, exposed credentials)
            } else if (v.getSeverity() == Severity.HIGH) {
                highCount++;
                score -= 15; // Direct exploitation risk (Plain HTTP, expired SSL, verified XSS)
            } else if (v.getSeverity() == Severity.MEDIUM) {
                mediumCount++;
                score -= 5;  // Defense-in-depth gaps (e.g. missing clickjacking frame-ancestors)
            } else if (v.getSeverity() == Severity.LOW) {
                lowCount++;
                score -= 2;  // Hardening advisories
            }
            // Severity.INFO has 0 point deduction
        }

        // Clamp score between 0 and 100
        score = Math.max(0, Math.min(100, score));

        String grade = determineGrade(score, criticalCount, highCount);
        return new ScoreResult(score, grade);
    }

    private String determineGrade(int score, int criticalCount, int highCount) {
        if (criticalCount > 0) {
            return score < 50 ? "F" : "D";
        }
        if (highCount >= 2 && score < 70) {
            return "D";
        }
        if (score >= 95) return "A+";
        if (score >= 85) return "A";
        if (score >= 75) return "B";
        if (score >= 60) return "C";
        if (score >= 45) return "D";
        return "F";
    }
}
