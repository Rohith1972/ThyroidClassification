package com.thyroid.system.service.impl;

import com.thyroid.system.dto.PatientDTO;
import com.thyroid.system.exception.ResourceNotFoundException;
import com.thyroid.system.model.Patient;
import com.thyroid.system.repository.PatientRepository;
import com.thyroid.system.service.PatientService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class PatientServiceImpl implements PatientService {

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private com.thyroid.system.service.AIService aiService;

    @Override
    public PatientDTO createPatient(PatientDTO patientDTO, String createdBy) {
        Patient patient = new Patient();
        BeanUtils.copyProperties(patientDTO, patient);
        patient.setCreatedBy(createdBy);
        patient.setCreatedAt(LocalDateTime.now());
        patient.setUpdatedAt(LocalDateTime.now());
        patient.setDeleted(false);
        
        // Call AI Service to get Prediction
        if (patient.getLabValues() != null) {
            if (patient.getAiServiceType() != null) {
                patient.setPrediction(aiService.getPrediction(patient, patient.getAiServiceType()));
            } else {
                patient.setPrediction(aiService.getPrediction(patient));
            }
        }
        
        Patient savedPatient = patientRepository.save(patient);
        return convertToDTO(savedPatient);
    }

    @Override
    public PatientDTO getPatientById(String id) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + id));
        if (patient.isDeleted()) {
           throw new ResourceNotFoundException("Patient not found with id: " + id);
        }
        return convertToDTO(patient);
    }

    @Override
    public Page<PatientDTO> getAllPatients(Pageable pageable) {
        return patientRepository.findAllActive(pageable).map(this::convertToDTO);
    }

    @Override
    public PatientDTO updatePatient(String id, PatientDTO patientDTO) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + id));
        
        patient.setName(patientDTO.getName());
        patient.setAge(patientDTO.getAge());
        patient.setGender(patientDTO.getGender());
        patient.setLabValues(patientDTO.getLabValues());
        patient.setUpdatedAt(LocalDateTime.now());

        // TODO: Re-run prediction if lab values changed?

        Patient updatedPatient = patientRepository.save(patient);
        return convertToDTO(updatedPatient);
    }

    @Override
    public void deletePatient(String id) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + id));
        patient.setDeleted(true);
        patientRepository.save(patient);
    }
    
    @Override
    public Page<PatientDTO> searchPatients(String name, Pageable pageable) {
        return patientRepository.findByNameContainingIgnoreCaseAndDeletedFalse(name, pageable)
                .map(this::convertToDTO);
    }

    private PatientDTO convertToDTO(Patient patient) {
        PatientDTO dto = new PatientDTO();
        BeanUtils.copyProperties(patient, dto);
        return dto;
    }
}
