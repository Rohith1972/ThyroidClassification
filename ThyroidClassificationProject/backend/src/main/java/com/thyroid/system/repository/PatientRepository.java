package com.thyroid.system.repository;

import com.thyroid.system.model.Patient;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

public interface PatientRepository extends MongoRepository<Patient, String> {
    
    @Query("{ 'deleted': false }")
    Page<Patient> findAllActive(Pageable pageable);

    @Query("{ 'createdBy': ?0, 'deleted': false }")
    Page<Patient> findByCreatedByAndDeletedFalse(String createdBy, Pageable pageable);
    
    // Search by name
    Page<Patient> findByNameContainingIgnoreCaseAndDeletedFalse(String name, Pageable pageable);
}

