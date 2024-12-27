package com.back.backend.services;

import com.back.backend.Entities.Admin;
import com.back.backend.Entities.Evenement;
import com.back.backend.repositories.AdminRepository;
import com.back.backend.repositories.EvenementRepository;
import org.springframework.stereotype.Service;

@Service
public class EvenementService {
    private final EvenementRepository evenementRepository;
    private final AdminRepository adminRepository;

    public EvenementService(EvenementRepository evenementRepository, AdminRepository adminRepository) {
        this.evenementRepository = evenementRepository;
        this.adminRepository = adminRepository;
    }

    public Evenement createEvent(Evenement evenement, int adminId) {
        Admin admin = adminRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin with ID " + adminId + " not found"));
        evenement.setAdmin(admin);

        if (evenement.getCapaciteMaximal() == 0) {
            throw new IllegalArgumentException("Capacité maximale doit être supérieur à zéro.");
        }
        if (evenement.getDesignation() == null || evenement.getDesignation().isEmpty()) {
            throw new IllegalArgumentException("La désignation de l'événement est obligatoire.");
        }
        if (evenement.getDescription() == null || evenement.getDescription().isEmpty()) {
            throw new IllegalArgumentException("La description de l'événement est obligatoire.");
        }
        if (evenement.getDateEvenement() == null) {
            throw new IllegalArgumentException("La date de l'événement est obligatoire.");
        }

        evenement.setPlaceRestant(evenement.getCapaciteMaximal());
        return evenementRepository.save(evenement);
    }

    public Evenement updateEvent(int eventId, Evenement updatedEvenement) {
        Evenement existingEvent = evenementRepository.findById(eventId)
                .orElseThrow(() -> new IllegalArgumentException("Evenement with ID " + eventId + " not found"));

        if (updatedEvenement.getDesignation() != null && !updatedEvenement.getDesignation().isEmpty()) {
            existingEvent.setDesignation(updatedEvenement.getDesignation());
        }
        if (updatedEvenement.getDescription() != null && !updatedEvenement.getDescription().isEmpty()) {
            existingEvent.setDescription(updatedEvenement.getDescription());
        }
        if (updatedEvenement.getDateEvenement() != null) {
            existingEvent.setDateEvenement(updatedEvenement.getDateEvenement());
        }
        if (updatedEvenement.getCapaciteMaximal() > 0) {
            existingEvent.setCapaciteMaximal(updatedEvenement.getCapaciteMaximal());
            int difference = updatedEvenement.getCapaciteMaximal() - existingEvent.getCapaciteMaximal();
            existingEvent.setPlaceRestant(existingEvent.getPlaceRestant() + difference);

            // Ensure that placeRestant doesn't go negative
            if (existingEvent.getPlaceRestant() < 0) {
                throw new IllegalArgumentException("Le nombre de places restantes ne peut pas être négatif.");
            }
        }

        return evenementRepository.save(existingEvent);
    }

    public void deleteEvent(int eventId) {
        Evenement existingEvent = evenementRepository.findById(eventId)
                .orElseThrow(() -> new IllegalArgumentException("Evenement with ID " + eventId + " not found"));
        evenementRepository.delete(existingEvent);
    }
}
