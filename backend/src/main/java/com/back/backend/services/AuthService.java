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
       


        public AuthenticationResponse register(RegisterRequest request) {
                //on cree une instance de user => par defaut 
                User user = User.builder()
                        .firstName(request.getFirstName())
                        .lastName(request.getLastName())
                        .email(request.getEmail())
                        .password(passwordEncoder.encode(request.getPassword()))
                        .role(Role.valueOf(request.getRole()))
                        .build();
            
                var jwtToken = jwtService.generateToken(user);
            
                // on verifie le role 
                if (user.getRole() == Role.ETUDIANT) {
                    Etudiant etudiant = new Etudiant();
                    copyUserFieldsToSubclass(user, etudiant);
                    etudiant.setFiliere(request.getFiliere()); 
                    userRepository.save(etudiant); 
                } else if (user.getRole() == Role.ADMIN) {
                    Admin admin = new Admin();
                    copyUserFieldsToSubclass(user, admin); 
                    admin.setAnneeExeprience(request.getAnneeExeprience()); 
                    userRepository.save(admin); 
                } else if (user.getRole() == Role.LAUREAT) {
                    Laureat laureat = new Laureat();
                    copyUserFieldsToSubclass(user, laureat); 
                    laureat.setPromotion(request.getPromotion());
                    laureat.setSpecialite(request.getSpecialite()); 
                    userRepository.save(laureat);
                }
        
                return AuthenticationResponse.builder()
                        .accessToken(jwtToken)
                        .build();
            }
            
            // method pour copier les champs du user vers n'importe quel subclass (admin , laureat , etudiant)
            private void copyUserFieldsToSubclass(User user, User subclass) {
                subclass.setFirstName(user.getFirstName());
                subclass.setLastName(user.getLastName());
                subclass.setEmail(user.getEmail());
                subclass.setPassword(user.getPassword());
                subclass.setRole(user.getRole());
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
