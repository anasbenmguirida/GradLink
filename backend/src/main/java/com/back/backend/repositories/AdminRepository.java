package com.back.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.back.backend.Entities.Admin;
@Repository
public interface AdminRepository extends JpaRepository<Admin , Integer> {

}
