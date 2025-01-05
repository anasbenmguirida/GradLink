package com.back.backend.controllers;

import com.back.backend.Entities.Caummunaute;
import com.back.backend.dto.CaummunauteDTO;
import com.back.backend.services.CaummunauteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/communities")
@CrossOrigin(origins = "http://localhost:4200")

public class CaummunauteController {

    @Autowired
    private CaummunauteService caummunauteService;

    // Endpoint to get all communities
    //@GetMapping
    //public List<Caummunaute> getAllCommunities() {
        //return caummunauteService.getAllCommunities();
    //}

    @GetMapping
    public List<CaummunauteDTO> getAllCommunitiesWithPostes() {
        return caummunauteService.getAllCommunitiesWithPostes();
    }

    // Endpoint to get a community by ID
    @GetMapping("/{id}")
    public Caummunaute getCommunityById(@PathVariable int id) {
        return caummunauteService.getCommunityById(id);
    }

}
