package com.back.backend.services;


import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import com.back.backend.dto.PosteWithUserDTO;
import com.back.backend.enums.TypePoste;
import com.back.backend.Entities.Poste;
import com.back.backend.Entities.PosteFiles;
import com.back.backend.Entities.PosteLikes;
import com.back.backend.Entities.User;
import com.back.backend.repositories.PosteFilesRepository;
import com.back.backend.repositories.PosteLikesRepository;
import com.back.backend.repositories.PosteRepository;
import com.back.backend.repositories.UserRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class PosteService {
    private final PosteRepository posteRepository ; 
    private final PosteLikesRepository posteLikesRepository ; 
    private final PosteFilesRepository posteFilesRepository ;
    private final UserRepository userRepository ;
    
    
    public List<PosteWithUserDTO> findPostesByUserId(int id){
        List<Poste> userPostes = this.posteRepository.findPostesByUserId(id) ; 
         return userPostes.stream()
        .map(poste -> {
            User user = this.userRepository.findById(poste.getUserId())
                           .orElse(null);
            String firstName = user.getFirstName();
            String lastName = user.getLastName();
            String photoProfile = user.getPhotoProfile();
            return new PosteWithUserDTO(poste, firstName, lastName , photoProfile);
        })
        .collect(Collectors.toList());
    }

   public List<PosteWithUserDTO> findPostesByOrder() {
    List<Poste> postes = this.posteRepository.findPostesByOrder();

    return postes.stream()
        .filter(poste -> poste.getTypePoste() == TypePoste.NORMAL) // Filter only NORMAL posts
        .map(poste -> {
            User user = this.userRepository.findById(poste.getUserId())
                .orElse(null);

            String firstName = user != null ? user.getFirstName() : "";
            String lastName = user != null ? user.getLastName() : "";
            String photoProfile = user != null ? user.getPhotoProfile() : "";

            return new PosteWithUserDTO(poste, firstName, lastName, photoProfile);
        })
        .collect(Collectors.toList());
}


    public boolean checkLikedPoste(PosteLikes posteLikes){
        PosteLikes isLiked = this.posteLikesRepository.checklikes(posteLikes.getPosteId(), posteLikes.getUserId()) ; 
        return isLiked==null ? false : true ;
    }
    public ResponseEntity<String> deletePoste(int idPoste){
        try{
            this.posteRepository.deleteById(idPoste) ;
        }catch(Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur lors de la suppression du poste");
        }
        return ResponseEntity.ok().body("Poste supprimé avec succes");
    }
}