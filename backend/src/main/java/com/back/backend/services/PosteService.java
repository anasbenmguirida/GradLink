package com.back.backend.services;


import java.time.LocalDateTime;
import java.util.List;


import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;
import com.back.backend.Entities.Poste;
import com.back.backend.Entities.PosteLikes;
import com.back.backend.repositories.PosteLikesRepository;
import com.back.backend.repositories.PosteRepository;


import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class PosteService {
    private final PosteRepository posteRepository ; 
    private final PosteLikesRepository posteLikesRepository ; 
    
    // creation de postes par un laureat => 2 type de possible NORMAL ET CAUMMUNAUTE
    public ResponseEntity<String> createPoste(@RequestBody Poste poste) {
       poste.setDatePoste(LocalDateTime.now());
        poste.setNbrLikes(0);
        this.posteRepository.save(poste) ; 
        return ResponseEntity.ok("Poste cree avec succes") ;
    }


    public List<Poste> getAllPoste() {
        return this.posteRepository.findAll() ; 
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

    public boolean checkLikedPoste(PosteLikes posteLikes){
        PosteLikes isLiked = this.posteLikesRepository.checklikes(posteLikes.getPosteId(), posteLikes.getUserId()) ; 
        return isLiked==null ? false : true ;
    }
}
