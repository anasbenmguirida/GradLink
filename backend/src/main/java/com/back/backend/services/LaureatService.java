package com.back.backend.services;

import java.sql.Date;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.multipart.MultipartFile;

import com.back.backend.Entities.DemandeMentorat;
import com.back.backend.Entities.Laureat;
import com.back.backend.Entities.Poste;
import com.back.backend.Entities.User;
import com.back.backend.dto.DemandeWithStudent;
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

    //ACCEPTER DEMANDE
    // public String accepterDemande(DemandeMentorat demande){
    //     DemandeMentorat demandeMentorat = demandeRepository.getDemandeMentorat(demande.getLaureatId(), demande.getEtudiantId()) ; 
    //     if(demandeMentorat!= null){
    //         demande.setStatusMentorat(StatusMentorat.ACCEPTED);
    //         demandeRepository.save(demande) ; 
    //         return "demnade accepte" ; 
    //     }
    //     return "demande introuvable" ; 
    // }

    //ACCEPTER DEMANDE
    public String accepterDemande(DemandeMentorat demande){
        DemandeMentorat demandeMentorat = demandeRepository.getDemandeMentorat(demande.getLaureatId(), demande.getEtudiantId()) ; 
        if(demandeMentorat!= null){
            demandeMentorat.setStatusMentorat(StatusMentorat.ACCEPTED);
            demandeRepository.save(demandeMentorat) ; 
            return "demnade accepte" ; 
        }
        return "demande introuvable" ; 
    }
    // refuser dmande
    public String refuserDemande(DemandeMentorat demande){
        DemandeMentorat demandeMentorat = demandeRepository.getDemandeMentorat(demande.getLaureatId(), demande.getEtudiantId()) ; 
        if(demande!=null){
           DemandeMentorat demandeMentorat2= demandeRepository.getDemandeMentorat(demande.getLaureatId() , demande.getEtudiantId()) ; 
           demandeRepository.deleteById(demandeMentorat2.getId());
           return "demnade rejetee et supprimer de la table" ; 
        }
        return "demande introuvable" ; 
    }
    public List<DemandeMentorat> getAllLaureatDemandes(int id){
        return demandeRepository.getAllDemandeLaureat(id) ;  
    }
    // status mentorat 
    public int getStatusMentorat(DemandeMentorat demandeMentorat){
        DemandeMentorat demande = demandeRepository.getDemandeMentorat(demandeMentorat.getLaureatId(), demandeMentorat.getEtudiantId() ) ; 
        if(demande!=null){
        return demandeRepository.getStatusMentorat(demandeMentorat.getLaureatId() , demandeMentorat.getEtudiantId()) ;
        }
        else{
            return 2 ; 
        }
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

 /* 
    public List<DemandeMentorat> getMentoredStudents(int laureatId) {
        return demandeRepository.findMentoredStudentsByLaureatIdAndStatusMentorat(laureatId, StatusMentorat.ACCEPTED);
    }
        */
        
    
        // demande pas encore accepte status = 0 
    public List<DemandeWithStudent> getAllDemandes(int idLanreat) {
        List<DemandeMentorat> listeDemande = demandeRepository.getAllDemandes(idLanreat);
        return listeDemande.stream()
            .map(demande -> {
                User user = this.userRepository.findById(demande.getEtudiantId())
                               .orElse(null);
                String firstName =  user.getFirstName() ;
                String lastName =  user.getLastName() ;
                String photo=user.getPhotoProfile() ; 
                return new DemandeWithStudent(demande, firstName, lastName , photo);
            })
            .collect(Collectors.toList());
    }
}