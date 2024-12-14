package com.back.backend.services;


import java.util.Optional;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.back.backend.Entities.Admin;
import com.back.backend.Entities.Etudiant;
import com.back.backend.Entities.Laureat;
import com.back.backend.Entities.User;
import com.back.backend.auth.AuthenticationResponse;
import com.back.backend.auth.LoginRequest;
import com.back.backend.auth.RegisterRequest;
import com.back.backend.config.JwtService;
import com.back.backend.enums.Role;
import com.back.backend.repositories.AdminRepository;
import com.back.backend.repositories.EtudiantRepository;
import com.back.backend.repositories.LaureatRepository;
import com.back.backend.repositories.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {
        private final UserRepository userRepository;
        private final PasswordEncoder passwordEncoder;
        private final JwtService jwtService;
        private final AuthenticationManager authenticationManager;
        private final EtudiantRepository etudiantRepository ; 
        private final LaureatRepository laureatRepository ; 
        private final AdminRepository adminRepository ; 


        public AuthenticationResponse register(RegisterRequest request) {
                // every user that create an acount is gonna be stored in the users table 
                User user = User.builder()
                                .firstName(request.getFirstName())
                                .lastName(request.getLastName())
                                .email(request.getEmail())
                                .password(passwordEncoder.encode(request.getPassword()))
                                .role(Role.valueOf(request.getRole()))
                                .build();
                this.userRepository.save(user);
                int foreignKey = user.getId() ; 
                var jwtToken=jwtService.generateToken(user) ; 
                if (user.getRole() == Role.ETUDIANT) {
                        Etudiant etudiant = new Etudiant(); 
                        etudiant.setId(foreignKey);
                        etudiant.setFiliere(request.getFiliere());
                        this.etudiantRepository.save(etudiant);  
                
                }
                else if(user.getRole() == Role.ADMIN){
                        Admin admin = new Admin(); 
                        admin.setId(foreignKey);
                        admin.setAnneeExeprience(request.getAnneeExeprience());
                        this.adminRepository.save(admin);  
                
                }
                else {
                        Laureat laureat = new Laureat(); 
                        laureat.setId(foreignKey);
                        laureat.setPromotion(request.getPromotion()); 
                        laureat.setSpecialite(request.getSpecialite());
                        this.laureatRepository.save(laureat);
                
                }
                return AuthenticationResponse.builder()
                                .accessToken(jwtToken).build();
                }


        // the Login
        public AuthenticationResponse login(LoginRequest request) {
                System.out.println(request.getEmail());

                authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(
                                                request.getEmail(),
                                                request.getPassword()));

                User user = userRepository.findByEmail(request.getEmail())
                                .orElseThrow();
                if (passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                        var jwtToken = jwtService.generateToken(user);
                        return AuthenticationResponse.builder()
                                        .accessToken(jwtToken).build();
                } else {
                        return null;
                }

        }
}
