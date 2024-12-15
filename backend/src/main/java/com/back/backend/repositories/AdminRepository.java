package com.back.backend.repositories;

import com.back.backend.Entities.Admin;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminRepository extends JpaRepository<Admin, Integer> {
    // You can add additional custom query methods if needed
}
