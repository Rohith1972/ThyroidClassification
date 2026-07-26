package com.thyroid.system.dto;

import com.thyroid.system.model.LabValues;
import com.thyroid.system.model.Prediction;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class PatientDTO {
    private String id;
    private String name;
    private Integer age;
    private String gender;
    private LabValues labValues;
    private Prediction prediction;
    private String selectedService;
    private String createdBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
