package com.back.backend.services;

import com.back.backend.Entities.DemandeMentorat;
import com.back.backend.repositories.DemandeMentoratRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DemandeMentoratService {

    @Autowired
    private DemandeMentoratRepository demandeMentoratRepository;

    public DemandeMentorat saveDemandeMentorat(DemandeMentorat demandeMentorat) {
        return demandeMentoratRepository.save(demandeMentorat); // Return the saved entity
    }
}