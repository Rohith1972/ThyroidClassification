package com.thyroid.system.service;

import com.thyroid.system.model.Patient;
import com.thyroid.system.model.Prediction;

public interface AIService {
    Prediction getPrediction(Patient patient);
}
