package com.thyroid.system.service;

import com.thyroid.system.dto.PatientDTO;
import com.thyroid.system.model.Patient;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface PatientService {
    PatientDTO createPatient(PatientDTO patientDTO, String createdBy);
    PatientDTO getPatientById(String id);
    Page<PatientDTO> getAllPatients(Pageable pageable);
    PatientDTO updatePatient(String id, PatientDTO patientDTO);
    void deletePatient(String id);
    Page<PatientDTO> searchPatients(String name, Pageable pageable);
}
