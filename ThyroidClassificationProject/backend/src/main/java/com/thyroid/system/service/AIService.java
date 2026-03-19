package com.thyroid.system.service;

import com.thyroid.system.model.Patient;
import com.thyroid.system.model.Prediction;
import com.thyroid.system.model.AIServiceType;

public interface AIService {
    Prediction getPrediction(Patient patient);
    Prediction getPrediction(Patient patient, AIServiceType aiServiceType);
}
