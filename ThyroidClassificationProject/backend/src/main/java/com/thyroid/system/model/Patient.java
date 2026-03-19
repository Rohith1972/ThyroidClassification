package com.thyroid.system.model;

import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import java.time.LocalDateTime;

@Data
@Document(collection = "patients")
public class Patient {
    @Id
    private String id;
    
    private String name;
    private Integer age;
    private String gender;
    
    private LabValues labValues;
    private Prediction prediction;
    private AIServiceType aiServiceType;
    
    private String createdBy; // User ID of the doctor
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
    
    @Field("deleted")
    private boolean deleted = false;
}

