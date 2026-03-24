package com.thyroid.system.service.impl;

import com.thyroid.system.model.AIServiceType;
import com.thyroid.system.model.LabValues;
import com.thyroid.system.model.Patient;
import com.thyroid.system.model.Prediction;
import com.thyroid.system.service.AIService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import org.springframework.http.MediaType;
import org.springframework.http.client.MultipartBodyBuilder;
import org.springframework.web.reactive.function.BodyInserters;

import java.util.HashMap;
import java.util.Base64;
@Service
public class AIServiceImpl implements AIService {

    private static final Logger logger = LoggerFactory.getLogger(AIServiceImpl.class);

    @Value("${ai.service.url:http://localhost:8000}")
    private String aiServiceUrl;

    @Value("${ai.service.url.2:http://localhost:8001}")
    private String aiServiceUrl2;

    @Value("${ai.service.url.3:http://localhost:8002}")
    private String aiServiceUrl3;

    @Value("${ai.service.url.4:http://localhost:8003}")
    private String aiServiceUrl4;

    private final WebClient webClient;

    public AIServiceImpl(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    @Override
    public Prediction getPrediction(Patient patient) {
        // Default to AI_SERVICE_1 if not specified
        return getPrediction(patient, AIServiceType.AI_SERVICE_1);
    }

    @Override
    public Prediction getPrediction(Patient patient, AIServiceType aiServiceType) {
        if (patient == null || patient.getLabValues() == null) {
            return null;
        }

        String serviceUrl = getServiceUrl(aiServiceType);
        
        try {
            LabValues lv = patient.getLabValues();
            
            // Map to keys expected by the Python microservice
            HashMap<String, Object> request = new HashMap<>();
            request.put("age", (double) patient.getAge());
            request.put("sex", "Male".equalsIgnoreCase(patient.getGender()) ? 1 : 0);
            
            request.put("on_thyroxine", lv.isOnThyroxine() ? 1 : 0);
            request.put("query_on_thyroxine", lv.isQueryOnThyroxine() ? 1 : 0);
            request.put("on_antithyroid_medication", lv.isOnAntithyroidMedication() ? 1 : 0);
            request.put("sick", lv.isSick() ? 1 : 0);
            request.put("pregnant", lv.isPregnant() ? 1 : 0);
            request.put("thyroid_surgery", lv.isThyroidSurgery() ? 1 : 0);
            request.put("I131_treatment", lv.isI131Treatment() ? 1 : 0);
            request.put("query_hypothyroid", lv.isQueryHypothyroid() ? 1 : 0);
            request.put("query_hyperthyroid", lv.isQueryHyperthyroid() ? 1 : 0);
            request.put("lithium", lv.isLithium() ? 1 : 0);
            request.put("goitre", lv.isGoitre() ? 1 : 0);
            request.put("tumor", lv.isTumor() ? 1 : 0);
            request.put("hypopituitary", lv.isHypopituitary() ? 1 : 0);
            request.put("psych", lv.isPsych() ? 1 : 0);
            
            request.put("TSH_measured", lv.isTshMeasured() ? 1 : 0);
            request.put("TSH", lv.getTsh() != null ? lv.getTsh() : 0.0);
            
            request.put("T3_measured", lv.isT3Measured() ? 1 : 0);
            
            request.put("TT4_measured", lv.isTt4Measured() ? 1 : 0);
            request.put("TT4", lv.getTt4() != null ? lv.getTt4() : 0.0);
            
            request.put("T4U_measured", lv.isT4uMeasured() ? 1 : 0);
            request.put("T4U", lv.getT4u() != null ? lv.getT4u() : 0.0);
            
            request.put("FTI_measured", lv.isFtiMeasured() ? 1 : 0);
            request.put("FTI", lv.getFti() != null ? lv.getFti() : 0.0);

            // No extra features added for AI_SERVICE_2 since it's HistGradientBoosting now

            Prediction prediction = webClient.post()
                    .uri(serviceUrl + "/predict")
                    .body(Mono.just(request), HashMap.class)
                    .retrieve()
                    .bodyToMono(Prediction.class)
                    .block();
            
            // Set the service name
            if (prediction != null) {
                prediction.setServiceName(aiServiceType.getServiceName());
            }
            
            return prediction;
        } catch (Exception e) {
            logger.error("Error calling AI service {}: {}", aiServiceType.getServiceName(), e.getMessage());
            Prediction fallback = new Prediction();
            fallback.setResult("Error");
            fallback.setConfidence(0.0);
            fallback.setModelVersion("N/A");
            fallback.setShapValues(new HashMap<>());
            fallback.setServiceName(aiServiceType.getServiceName());
            return fallback;
        }
    }

    private String getServiceUrl(AIServiceType aiServiceType) {
        switch (aiServiceType) {
            case AI_SERVICE_1:
                return aiServiceUrl;
            case AI_SERVICE_2:
                return aiServiceUrl2;
            case AI_SERVICE_3:
                return aiServiceUrl3;
            case AI_SERVICE_4:
                return aiServiceUrl4;
            default:
                return aiServiceUrl;
        }
    }
}
