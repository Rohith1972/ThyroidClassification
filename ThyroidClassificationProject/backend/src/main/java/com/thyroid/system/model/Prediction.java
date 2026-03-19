package com.thyroid.system.model;

import lombok.Data;
import java.util.Map;

@Data
public class Prediction {
    private String result;
    private Double confidence;
    private String modelVersion;
    private Map<String, Double> shapValues;
    private String serviceName;
    private Map<String, Double> probabilities;
    private String tiRadsScore;

    /**
     * Alias for confidence - the frontend reads "certainty" from the prediction object.
     * Returns the confidence value as a percentage (0-100 scale) for display.
     */
    public Double getCertainty() {
        if (confidence == null) return null;
        // If confidence is already > 1 (already a percentage), return as-is
        // Otherwise multiply by 100 to convert from 0-1 scale
        return confidence > 1.0 ? confidence : confidence * 100.0;
    }
}
