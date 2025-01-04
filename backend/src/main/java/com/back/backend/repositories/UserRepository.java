package com.back.backend.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.back.backend.Entities.Laureat;
import com.back.backend.Entities.User;
import com.back.backend.enums.Role;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByEmail(String email);
    // a query that retrieve all users where role is laureat

    @Query("SELECT u FROM User u WHERE u.role = :role")
    List<User> findAllByRole(@Param("role") Role role);

    
    @Query("SELECT u FROM User u WHERE u.id = :id")
    Optional<User> findByIdUser(Integer id);
    List<User> findByRoleNot(com.back.backend.enums.Role admin);


    @Query(value = "SELECT photo_profile FROM users WHERE id = :id"  , nativeQuery = true)
    byte[] getImageById(int id);

}
