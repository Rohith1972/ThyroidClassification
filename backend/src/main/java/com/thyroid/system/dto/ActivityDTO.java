package com.thyroid.system.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActivityDTO {
    private String type; // e.g., "PATIENT_REGISTERED", "CLASSIFICATION_COMPLETED"
    private String message;
    private String actor; // The doctor or system that performed the action
    private LocalDateTime timestamp;
}
