package com.back.backend.services;

import java.sql.Date;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.multipart.MultipartFile;

import com.back.backend.Entities.DemandeMentorat;
import com.back.backend.Entities.Laureat;
import com.back.backend.Entities.Poste;
import com.back.backend.Entities.User;
import com.back.backend.enums.Role;
import com.back.backend.enums.StatusMentorat;
import com.back.backend.enums.TypePoste;
import com.back.backend.repositories.DemandeRepository;
import com.back.backend.repositories.EtudiantRepository;
import com.back.backend.repositories.LaureatRepository;
import com.back.backend.repositories.PosteRepository;
import com.back.backend.repositories.UserRepository;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Service
@AllArgsConstructor

public class LaureatService {

   
    private final DemandeRepository demandeRepository;
    private final LaureatRepository laureatRepository ; 
    private final PosteRepository posteRepository ; 
    private final UserRepository userRepository ;
    
    public List<Laureat> getAllLaureat(){
      return laureatRepository.findAllByRole(Role.LAUREAT) ;     
    }

    //pour les demandes de mentorats par default on va les mettre les status a PENDING 
    public String accepterDemande(int idDemande){
        Optional<DemandeMentorat> demandeMentorat = demandeRepository.findById(idDemande) ; 
        if(demandeMentorat.isPresent()){
            DemandeMentorat demande = demandeMentorat.get();
            demande.setStatusMentorat(StatusMentorat.ACCEPTED);
            demandeRepository.save(demande) ; 
            return "demnade accepte" ; 
        }
        return "demande introuvable" ; 
    }

    public String refuserDemande(int idDemande){
        Optional<DemandeMentorat> demandeMentorat = demandeRepository.findById(idDemande) ; 
        if(demandeMentorat.isPresent()){
            DemandeMentorat demande = demandeMentorat.get();
            demande.setStatusMentorat(StatusMentorat.REJECTED);
            demandeRepository.save(demande) ; 
            return "demnade rejetee" ; 
        }
        return "demande introuvable" ; 
    }
    public List<DemandeMentorat> getAllLaureatDemandes(int id){
        return demandeRepository.getAllDemandeLaureat(id) ;  
    }
    
    public ResponseEntity<String> modifierPoste(int posteId , String textArea){
       Poste posteAmodifier= this.posteRepository.findById(posteId).orElse(null); 
       if(posteAmodifier !=null){
           posteAmodifier.setTextArea(textArea);
           this.posteRepository.save(posteAmodifier);
           return ResponseEntity.ok("poste modifie");
       }
       else{
           return ResponseEntity.ok("poste introuvable");
       }
    }


    public List<DemandeMentorat> getMentoredStudents(int laureatId) {
        return demandeRepository.findMentoredStudentsByLaureatIdAndStatusMentorat(laureatId, StatusMentorat.ACCEPTED);
    }
        
    
}
