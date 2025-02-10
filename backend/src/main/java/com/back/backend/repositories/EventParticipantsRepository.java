package com.back.backend.repositories;

import com.back.backend.Entities.EventParticipants;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EventParticipantsRepository extends JpaRepository<EventParticipants, Integer> {
    Optional<EventParticipants> findByEvenementIdAndUserId(int evenementId, int userId);
    boolean existsByEvenementIdAndUserId(int evenementId, int userId);
}