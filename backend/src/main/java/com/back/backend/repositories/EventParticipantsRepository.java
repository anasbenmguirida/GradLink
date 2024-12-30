package com.back.backend.repositories;

import com.back.backend.Entities.EventParticipants;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EventParticipantsRepository extends JpaRepository<EventParticipants, Integer> {
}