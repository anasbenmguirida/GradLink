package com.back.backend.auth;



import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data // generates all the getters and setters for non final fields
@Builder // generates a builder for the class
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {

    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String role;
    private String filiere ; 
    private long anneeExperience ; 
    private long promotion ; 
    private String specialite ; 
    
   
    
}
