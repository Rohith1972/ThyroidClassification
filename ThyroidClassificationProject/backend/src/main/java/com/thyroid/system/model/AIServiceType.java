package com.thyroid.system.model;

public enum AIServiceType {
    AI_SERVICE_1("RandomForest Model", "http://localhost:8000", "ai-service-1"),
    AI_SERVICE_2("HistGB Thyroid Service", "http://localhost:8001", "ai-service-2"),
    AI_SERVICE_3("Deep Learning CNN", "http://localhost:8002", "ai-service-3"),
    AI_SERVICE_4("HistGradientBoosting", "http://localhost:8003", "ai-service-4");

    private final String displayName;
    private final String url;
    private final String serviceName;

    AIServiceType(String displayName, String url, String serviceName) {
        this.displayName = displayName;
        this.url = url;
        this.serviceName = serviceName;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getUrl() {
        return url;
    }

    public String getServiceName() {
        return serviceName;
    }
}
