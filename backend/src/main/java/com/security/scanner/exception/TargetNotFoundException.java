package com.security.scanner.exception;

public class TargetNotFoundException extends RuntimeException {
    private final String host;

    public TargetNotFoundException(String host) {
        super("The target website '" + host + "' does not exist or is offline. DNS resolution failed.");
        this.host = host;
    }

    public TargetNotFoundException(String host, String message) {
        super(message);
        this.host = host;
    }

    public String getHost() {
        return host;
    }
}
