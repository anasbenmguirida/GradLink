package com.back.backend.services;

import com.back.backend.Entities.Admin;
import com.back.backend.Entities.Evenement;
import com.back.backend.Entities.EventParticipants;
import com.back.backend.Entities.User;
import com.back.backend.repositories.AdminRepository;
import com.back.backend.repositories.EvenementRepository;
import com.back.backend.repositories.EventParticipantsRepository;
import com.back.backend.repositories.UserRepository;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EvenementService {
    private final EvenementRepository evenementRepository;
    private final AdminRepository adminRepository;
    private final UserRepository userRepository;
    private final EventParticipantsRepository eventParticipantsRepository;

    @Autowired
    public EvenementService(EvenementRepository evenementRepository, 
                             AdminRepository adminRepository, 
                             UserRepository userRepository,
                             EventParticipantsRepository eventParticipantsRepository) {
        this.evenementRepository = evenementRepository;
        this.adminRepository = adminRepository;
        this.userRepository = userRepository;
        this.eventParticipantsRepository = eventParticipantsRepository;
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
    /**
     * Get all events.
     */
    public List<Evenement> getAllEvents() {
        return evenementRepository.findAll();
    }

    /**
     * Get an event by ID.
     */
    public Optional<Evenement> getEventById(int id) {
        return evenementRepository.findById(id);
    }

    /**
     * Reserve a place for a user in an event.
     */
    public String reservePlace(int eventId, int userId) {
        Optional<Evenement> eventOptional = evenementRepository.findById(eventId);
        Optional<User> userOptional = userRepository.findById(userId);

        if (eventOptional.isEmpty()) {
            return "Event not found.";
        }

        if (userOptional.isEmpty()) {
            return "User not found.";
        }

        Evenement event = eventOptional.get();
        User user = userOptional.get();

        if (event.getPlaceRestant() <= 0) {
            return "No places available.";
        }

        // Check if the user is already registered
        boolean alreadyRegistered = event.getEventParticipants().stream()
                .anyMatch(participant -> participant.getUser().getId() == user.getId());

        if (alreadyRegistered) {
            return "User already registered for this event.";
        }

        // Register the user and decrement the remaining places
        EventParticipants participant = new EventParticipants();
        participant.setEvenement(event);
        participant.setUser(user);
        event.getEventParticipants().add(participant);
        event.setPlaceRestant(event.getPlaceRestant() - 1);

        // Save changes
        eventParticipantsRepository.save(participant);
        evenementRepository.save(event);

        return "Reservation successful.";
    }
}
