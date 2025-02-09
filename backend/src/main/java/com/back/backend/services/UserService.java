package com.back.backend.services;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.multipart.MultipartFile;

import com.back.backend.Entities.Etudiant;
import com.back.backend.Entities.Laureat;
import com.back.backend.Entities.Poste;
import com.back.backend.Entities.PosteFiles;
import com.back.backend.Entities.PosteLikes;
import com.back.backend.Entities.User;
import com.back.backend.enums.Role;
import com.back.backend.enums.TypePoste;
import com.back.backend.repositories.PosteFilesRepository;
import com.back.backend.repositories.PosteLikesRepository;
import com.back.backend.repositories.PosteRepository;
import com.back.backend.repositories.UserRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.AllArgsConstructor;


// this class will serve foor common things between the users 
@Service
@AllArgsConstructor
public class UserService {
private final PosteRepository posteRepository;
private final PosteLikesRepository posteLikesRepository;
private final PosteFilesRepository posteFilesRepository;
private final UserRepository userRepository;


 // creation de postes par un laureat => 2 type de possible NORMAL ET CAUMMUNAUTE
 public void createPoste(String textArea, TypePoste typePost, MultipartFile[] files, int userId) {
    try {
        // Créer un nouvel objet Poste
        Poste poste = new Poste();
        poste.setTextArea(textArea);
        poste.setTypePoste(typePost);
        poste.setDatePoste(LocalDateTime.now());
        poste.setNbrLikes(0);
        poste.setUserId(userId);

        // Sauvegarder le poste dans la base de données
        posteRepository.save(poste);

        // Gestion des fichiers (si présents)
        if (files != null && files.length > 0) {
            for (MultipartFile file : files) {
                if (!file.isEmpty()) {
                    PosteFiles posteFiles = new PosteFiles();
                    posteFiles.setFileName(file.getOriginalFilename());
                    posteFiles.setFileType(file.getContentType());
                    posteFiles.setData(file.getBytes());
                    posteFiles.setPoste(poste); // Associer le fichier au poste
                    posteFilesRepository.save(posteFiles);
                }
            }
        }
    } catch (IOException e) {
        throw new RuntimeException("Erreur lors du traitement des fichiers : " + e.getMessage());
    } catch (Exception e) {
        throw new RuntimeException("Erreur lors de la création du poste : " + e.getMessage());
    }
}


    public boolean checklikes(int userId , int postId){
        PosteLikes posteLikes= this.posteLikesRepository.checklikes(userId, postId);
        if(posteLikes != null){
            return true ; 
        }
        return false ; 
    }

    public ResponseEntity<String> likePoste(int idPoste , int idUser){
        Poste poste = this.posteRepository.findById(idPoste).orElse(null);
        // check if the user already liked the poste if yes he cant like it again 
        PosteLikes posteLikes = this.posteLikesRepository.checklikes(idUser, idPoste) ; 
        if(poste != null && posteLikes == null){
            poste.setNbrLikes(poste.getNbrLikes()+1);
            this.posteRepository.save(poste);
            PosteLikes newPosteLikes = PosteLikes.builder()
                                    .posteId(idPoste)
                                    .userId(idUser)
                                    .build() ;  
            this.posteLikesRepository.save(newPosteLikes) ; 
           return ResponseEntity.ok("Poste liké avec succes");
            }
            return ResponseEntity.badRequest().body("Poste non trouvé et le poste est deja like par cet utilisateur");
    }

    public ResponseEntity<String> unlikePoste(int posteId , int userId){
        Poste poste = this.posteRepository.findById(posteId).orElse(null);
        PosteLikes likedPosteCheck = this.posteLikesRepository.checklikes(userId , posteId) ; 
        if(poste != null && likedPosteCheck != null){
            poste.setNbrLikes(poste.getNbrLikes()-1);
            this.posteRepository.save(poste);
            this.posteLikesRepository.delete(likedPosteCheck) ; 
            return ResponseEntity.ok("Poste unliké avec succes");
            }
            return ResponseEntity.badRequest().body("Poste non trouvé et le poste n'est pas like par cet utilisateur");
    }


    public ResponseEntity<String> SaveProfilePicture(MultipartFile file, int idUser) {
    try {
        User user = this.userRepository.findById(idUser).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().body("User not found");
        }

        // Define the path to the static/images directory relative to the current working directory
        String uploadDir = System.getProperty("user.dir") + "/backend/src/main/resources/static/images";
    
        // Ensure the directory exists
        File directory = new File(uploadDir);
        if (!directory.exists()) {
            directory.mkdirs();
        }

        // Generate a unique file name
        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();

        // Save the file
        Path filePath = Paths.get(uploadDir, fileName);
        Files.write(filePath, file.getBytes());

        // Verify if the file was written
        if (!Files.exists(filePath)) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to save file to the directory");
        }

        // Return the URL to access the image
        String imageUrl = "http://localhost:8080/images/" + fileName;
        user.setPhotoProfile(imageUrl);

        // Save the user entity
        userRepository.save(user);

        return ResponseEntity.ok(imageUrl);
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to save profile picture: " + e.getMessage());
    }
}
   
   
  // retrieving the profile picture of a user
  public ResponseEntity<String> getProfileImage(int userId) {
    User user = this.userRepository.findById(userId).orElse(null);
    String imageUrl = user.getPhotoProfile() ; 
    return ResponseEntity.ok(imageUrl);

}


    public ResponseEntity<String> deleteUser(int id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return ResponseEntity.ok("User deleted successfully");
        }
        return ResponseEntity.notFound().build();
    }
    public User getUserById(int id) {
        return userRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("User not found with ID: " + id));
    }

    public void updateEtudiantProfile(Etudiant updatedEtudiant) {
        userRepository.save(updatedEtudiant);
    }
    
    public void updateLaureatProfile(Laureat updatedLaureat) {
        userRepository.save(updatedLaureat);
    }


    
    public List<User> getAllUsersExceptAdmins() {
        return userRepository.findByRoleNot(Role.ADMIN);
    }

 
}