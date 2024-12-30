package com.back.backend.services;

import com.back.backend.Entities.Admin;
import com.back.backend.Entities.Caummunaute;
import com.back.backend.repositories.AdminRepository;
import com.back.backend.repositories.CaummunauteRepository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CaummunauteService {

    private final CaummunauteRepository caummunauteRepository;
    private final AdminRepository adminRepository;

    @Autowired
    public CaummunauteService(CaummunauteRepository caummunauteRepository, AdminRepository adminRepository) {
        this.caummunauteRepository = caummunauteRepository;
        this.adminRepository = adminRepository;
    }

    // Create Community
    public Caummunaute createCaummunaute(Caummunaute caummunaute, int adminId) {
        
        Admin admin = (Admin) adminRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin with ID " + adminId + " not found"));
        caummunaute.setAdmin(admin); 
        if (caummunaute.getTitre() == null || caummunaute.getTitre().isEmpty()) {
            throw new IllegalArgumentException("Titre de la communauté est obligatoire.");
        }
        if (caummunaute.getDescription() == null || caummunaute.getDescription().isEmpty()) {
            throw new IllegalArgumentException("Description de la communauté est obligatoire.");
        }

        return caummunauteRepository.save(caummunaute);
    }

    // Update Community
    public Caummunaute updateCaummunaute(int id, Caummunaute updatedCaummunaute) {
        Caummunaute existingCaummunaute = caummunauteRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Caummunaute with ID " + id + " not found"));
        if (updatedCaummunaute.getTitre() != null && !updatedCaummunaute.getTitre().isEmpty()) {
            existingCaummunaute.setTitre(updatedCaummunaute.getTitre());
        }
        if (updatedCaummunaute.getDescription() != null && !updatedCaummunaute.getDescription().isEmpty()) {
            existingCaummunaute.setDescription(updatedCaummunaute.getDescription());
        }

        return caummunauteRepository.save(existingCaummunaute);
    }

    // Delete Community
    public void deleteCaummunaute(int id) {
        Caummunaute existingCaummunaute = caummunauteRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Caummunaute with ID " + id + " not found"));
        caummunauteRepository.delete(existingCaummunaute);
    }

    // Retrieve all communities
    public List<Caummunaute> getAllCommunities() {
        return caummunauteRepository.findAll();
    }
    
     // Retrieve a specific community by ID
    public Caummunaute getCommunityById(int id) {
            return caummunauteRepository.findById(id).orElse(null);
    }

  
}