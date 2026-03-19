package com.thyroid.system.model;

import lombok.Data;

@Data
public class LabValues {
    // Numerical Lab Results
    private Double tsh;
    private Double tt4;
    private Double t4u;
    private Double fti;
    
    // Clinical Flags (Boolean in Java, but will be 0/1 for AI)
    private boolean onThyroxine;
    private boolean queryOnThyroxine;
    private boolean onAntithyroidMedication;
    private boolean sick;
    private boolean pregnant;
    private boolean thyroidSurgery;
    private boolean i131Treatment;
    private boolean queryHypothyroid;
    private boolean queryHyperthyroid;
    private boolean lithium;
    private boolean goitre;
    private boolean tumor;
    private boolean hypopituitary;
    private boolean psych;
    
    // Measurement Flags (Did the lab actually measure these?)
    private boolean tshMeasured;
    private boolean t3Measured;
    private boolean tt4Measured;
    private boolean t4uMeasured;
    private boolean ftiMeasured;

    // TI-RADS Ultrasound Features
    private String composition;
    private String echogenicity;
    private String shape;
    private String calcification;
    private String margin;

    // Base64 Encoded Image for CNN
    private String ultrasoundImageBase64;
}
