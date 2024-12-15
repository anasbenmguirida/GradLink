package com.back.backend.services;

import com.back.backend.Entities.Admin;
import com.back.backend.Entities.Caummunaute;
import com.back.backend.repositories.AdminRepository;
import com.back.backend.repositories.CaummunauteRepository;
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
        // Fetch the admin by ID, if not found, throw an exception
        Admin admin = (Admin) adminRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin with ID " + adminId + " not found"));
        caummunaute.setAdmin(admin); // Set the admin who creates the community

        // Validate required fields
        if (caummunaute.getTitre() == null || caummunaute.getTitre().isEmpty()) {
            throw new IllegalArgumentException("Titre de la communauté est obligatoire.");
        }
        if (caummunaute.getDescription() == null || caummunaute.getDescription().isEmpty()) {
            throw new IllegalArgumentException("Description de la communauté est obligatoire.");
        }

        // Save the community to the repository
        return caummunauteRepository.save(caummunaute);
    }

    // Update Community
    public Caummunaute updateCaummunaute(int id, Caummunaute updatedCaummunaute) {
        Caummunaute existingCaummunaute = caummunauteRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Caummunaute with ID " + id + " not found"));

        // Update the fields only if they are provided
        if (updatedCaummunaute.getTitre() != null && !updatedCaummunaute.getTitre().isEmpty()) {
            existingCaummunaute.setTitre(updatedCaummunaute.getTitre());
        }
        if (updatedCaummunaute.getDescription() != null && !updatedCaummunaute.getDescription().isEmpty()) {
            existingCaummunaute.setDescription(updatedCaummunaute.getDescription());
        }

        // Save the updated community
        return caummunauteRepository.save(existingCaummunaute);
    }

    // Delete Community
    public void deleteCaummunaute(int id) {
        Caummunaute existingCaummunaute = caummunauteRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Caummunaute with ID " + id + " not found"));
        caummunauteRepository.delete(existingCaummunaute);
    }

}
