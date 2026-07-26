package com.thyroid.system.model;

import lombok.Data;
import java.util.Map;

@Data
public class Prediction {
    private String result;
    private Double confidence;
    private String modelVersion;
    private Map<String, Double> shapValues;
}
