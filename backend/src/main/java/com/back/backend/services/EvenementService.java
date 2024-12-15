package com.back.backend.services;


import com.back.backend.Entities.Admin;
import com.back.backend.Entities.Evenement;
import com.back.backend.repositories.AdminRepository;
import com.back.backend.repositories.EvenementRepository;
import com.back.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EvenementService {
    private final EvenementRepository evenementRepository;
    private final AdminRepository adminRepository;
    @Autowired
    public EvenementService(EvenementRepository evenementRepository, AdminRepository adminRepository) {
        this.evenementRepository = evenementRepository;
        this.adminRepository = adminRepository;
    }
    public Evenement createEvent(Evenement evenement, int adminId) {
        // Fetch the admin by ID, if not found, throw an exception
        Admin admin = (Admin) adminRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin with ID " + adminId + " not found"));
        evenement.setAdmin(admin); // Set the admin who creates the event


        // Validate that capaciteMaximal is not null
        if (evenement.getCapaciteMaximal() == 0) {
            throw new IllegalArgumentException("Capacité maximale doit être supérieur à zéro.");
        }
        // Validate other required fields (optional)
        if (evenement.getDesignation() == null || evenement.getDesignation().isEmpty()) {
            throw new IllegalArgumentException("La désignation de l'événement est obligatoire.");
        }
        if (evenement.getDescription() == null || evenement.getDescription().isEmpty()) {
            throw new IllegalArgumentException("La description de l'événement est obligatoire.");
        }
        if (evenement.getDateEvenement() == null) {
            throw new IllegalArgumentException("La date de l'événement est obligatoire.");
        }

        // Set admin and initialize remaining places
        evenement.setAdmin(admin);
        // Initially, all spots are available (set placeRestant to capaciteMaximal)
        evenement.setPlaceRestant(evenement.getCapaciteMaximal());
        return evenementRepository.save(evenement);

    }


    // Update Event
    public Evenement updateEvent(int eventId, Evenement updatedEvenement) {
        Evenement existingEvent;
        existingEvent = evenementRepository.findById(eventId)
                .orElseThrow(() -> new IllegalArgumentException("Admin with ID " + eventId + " not found"));

        // Update the fields only if they are provided
        if ( updatedEvenement.getDesignation() != null && !updatedEvenement.getDesignation().isEmpty()) {
            existingEvent.setDesignation(updatedEvenement.getDesignation());
        }
        if (updatedEvenement.getDescription() != null && !updatedEvenement.getDescription().isEmpty()) {
            existingEvent.setDescription(updatedEvenement.getDescription());
        }
        if (updatedEvenement.getDateEvenement() != null) {
            existingEvent.setDateEvenement(updatedEvenement.getDateEvenement());
        }
        if (updatedEvenement.getCapaciteMaximal() > 0 ) {
            existingEvent.setCapaciteMaximal(updatedEvenement.getCapaciteMaximal());
            // Adjust remaining places if capacity changes
            int difference = updatedEvenement.getCapaciteMaximal() - existingEvent.getPlaceRestant();
            existingEvent.setPlaceRestant(existingEvent.getPlaceRestant() + difference);
        }

        return evenementRepository.save(existingEvent);
    }

    // Delete Event
    public void deleteEvent(int eventId) {
        Evenement existingEvent = evenementRepository.findById(eventId)
                .orElseThrow(() -> new IllegalArgumentException("Evenement with ID " + eventId + " not found"));
        evenementRepository.delete(existingEvent);
    }
}