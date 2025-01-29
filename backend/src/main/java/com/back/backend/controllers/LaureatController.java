package com.back.backend.controllers;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.back.backend.Entities.DemandeMentorat;
import com.back.backend.Entities.Laureat;
import com.back.backend.Entities.User;
import com.back.backend.dto.DemandeWithStudent;
import com.back.backend.services.LaureatService;
import com.back.backend.services.PosteService;
import com.back.backend.services.UserService;



import jakarta.servlet.annotation.MultipartConfig;
import lombok.AllArgsConstructor;


@RestController
@AllArgsConstructor
@MultipartConfig
@RequestMapping(path = "/api/laureat/")
@CrossOrigin(origins = "http://localhost:4200")

public class LaureatController {

    
    private final PosteService posteService ; 
    private final LaureatService laureatService ; 
    private final UserService userService ;

    @PutMapping("accept")
    public String acceptDemande(@RequestBody DemandeMentorat demande) {
        return this.laureatService.accepterDemande(demande) ; 
    }

    @PutMapping("reject")
    public String refuserDemande(@RequestBody DemandeMentorat demande) {
        return this.laureatService.refuserDemande(demande) ; 
    }
    // avoir la liste de toutes les laureats 
    @GetMapping("all")
    public List<Laureat> getAllLaureats() {
        return this.laureatService.getAllLaureat() ; 
    }

   /*  @GetMapping("mentored-students/{id}")
    public ResponseEntity<List<DemandeMentorat>> getMentoredStudents(@PathVariable int id) {
    try {
        List<DemandeMentorat> mentoredStudents = laureatService.getMentoredStudents(id);
        return ResponseEntity.ok(mentoredStudents);
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
    }
}*/
    // status mentorat  :  pending (0)   , accepted (1) , rejected (2)
    @PostMapping("status")
    public int getStatusMentorat(@RequestBody DemandeMentorat demande) {
        return this.laureatService.getStatusMentorat(demande) ; 
    }
 
    @GetMapping("demandes-pending/{id}")
    public List<DemandeWithStudent> getAllDemandes(@PathVariable int id) {
        return this.laureatService.getAllDemandes(id) ; 
    }
    
}


