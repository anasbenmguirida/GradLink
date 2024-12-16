package com.back.backend.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RestController;

import com.back.backend.Entities.DemandeMentorat;
import com.back.backend.Entities.Laureat;
import com.back.backend.Entities.User;
import com.back.backend.services.LaureatService;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@RestController
@AllArgsConstructor
@NoArgsConstructor
public class LaureatController {

    @Autowired
    private LaureatService laureatService ; 

    @PutMapping("/api/accept/{id}")
    public String acceptDemande(@PathVariable int id) {
        return this.laureatService.accepterDemande(id) ; 
    }

    @PutMapping("/api/reject/{id}")
    public String refuserDemande(@PathVariable int id) {
        return this.laureatService.refuserDemande(id) ; 
    }
    @GetMapping("/api/laureats")
    public List<Laureat> getAllLaureats() {
        return this.laureatService.getAllLaureat() ; 
    }
    @GetMapping("/api/laureat-demandes/{id}")
    public List<DemandeMentorat> getAllLaureatDemandes(@PathVariable int id) {
        return this.laureatService.getAllLaureatDemandes(id) ;
    }
}
