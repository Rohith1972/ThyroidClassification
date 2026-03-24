package com.thyroid.system.controller;

import com.thyroid.system.dto.PatientDTO;
import com.thyroid.system.model.AIServiceType;
import com.thyroid.system.service.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/patients")
public class PatientController {

    @Autowired
    private PatientService patientService;

    @GetMapping
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN')")
    public Page<PatientDTO> getAllPatients(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {
        
        Sort.Direction sortDirection = direction.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));
        return patientService.getAllPatients(pageable);
    }
    
    @GetMapping("/search")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN')")
    public Page<PatientDTO> searchPatients(
            @RequestParam String name,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return patientService.searchPatients(name, pageable);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN')")
    public PatientDTO getPatient(@PathVariable String id) {
        return patientService.getPatientById(id);
    }

    @GetMapping("/ai-services")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN')")
    public List<AIServiceInfo> getAIServices() {
        return Arrays.stream(AIServiceType.values())
                .filter(service -> service == AIServiceType.AI_SERVICE_1 || service == AIServiceType.AI_SERVICE_2 || service == AIServiceType.AI_SERVICE_3)
                .map(service -> new AIServiceInfo(service.name(), service.getDisplayName(), service.getServiceName()))
                .collect(Collectors.toList());
    }

    @PostMapping
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN')")
    public PatientDTO createPatient(@RequestBody PatientDTO patientDTO, Authentication authentication) {
        String username = authentication.getName(); 
        return patientService.createPatient(patientDTO, username);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN')")
    public PatientDTO updatePatient(@PathVariable String id, @RequestBody PatientDTO patientDTO) {
        return patientService.updatePatient(id, patientDTO);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deletePatient(@PathVariable String id) {
        patientService.deletePatient(id);
    }

    public static class AIServiceInfo {
        private String name;
        private String displayName;
        private String serviceName;

        public AIServiceInfo(String name, String displayName, String serviceName) {
            this.name = name;
            this.displayName = displayName;
            this.serviceName = serviceName;
        }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        
        public String getDisplayName() { return displayName; }
        public void setDisplayName(String displayName) { this.displayName = displayName; }
        
        public String getServiceName() { return serviceName; }
        public void setServiceName(String serviceName) { this.serviceName = serviceName; }
    }
}
