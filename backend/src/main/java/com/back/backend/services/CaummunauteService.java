package com.back.backend.services;

import com.back.backend.Entities.Admin;
import com.back.backend.Entities.Caummunaute;
import com.back.backend.dto.CaummunauteDTO;
import com.back.backend.dto.PosteDTO;
import com.back.backend.dto.PosteFileDTO;
import com.back.backend.dto.UserDTO;
import com.back.backend.repositories.AdminRepository;
import com.back.backend.repositories.CaummunauteRepository;

import java.util.List;
import java.util.stream.Collectors;

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
    
     // Retrieve a specific community by ID
    public Caummunaute getCommunityById(int id) {
            return caummunauteRepository.findById(id).orElse(null);
    }

        public List<CaummunauteDTO> getAllCommunitiesWithPostes() {
        List<Caummunaute> caummunauteList = caummunauteRepository.findAll();

        return caummunauteList.stream().map(caummunaute -> {
            CaummunauteDTO caummunauteDTO = new CaummunauteDTO();
            caummunauteDTO.setId(caummunaute.getId());
            caummunauteDTO.setName(caummunaute.getTitre());
            caummunauteDTO.setDescription(caummunaute.getDescription());

            // Mapping postes to DTOs
            List<PosteDTO> posteDTOs = caummunaute.getPostes().stream().map(poste -> {
                PosteDTO posteDTO = new PosteDTO();
                posteDTO.setId(poste.getId());
                posteDTO.setTextArea(poste.getTextArea());

                // Mapping user to UserDTO with null check
                UserDTO userDTO = null;
                if (poste.getUser() != null) {
                    userDTO = new UserDTO(poste.getUser().getId(),
                            poste.getUser().getFirstName(),
                            poste.getUser().getLastName(),
                            poste.getUser().getPhotoProfile());
                }
                posteDTO.setUser(userDTO);

                // Mapping files for the post
                List<PosteFileDTO> posteFileDTOs = poste.getPosteFiles().stream().map(posteFile -> 
                    new PosteFileDTO(posteFile.getId(), posteFile.getFileName(), posteFile.getFileType(), "")
                ).collect(Collectors.toList());

                posteDTO.setPosteFiles(posteFileDTOs);

                return posteDTO;
            }).collect(Collectors.toList());

            caummunauteDTO.setPostes(posteDTOs);
            return caummunauteDTO;
        }).collect(Collectors.toList());
    }

  
}