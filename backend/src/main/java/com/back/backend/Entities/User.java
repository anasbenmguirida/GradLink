package com.back.backend.Entities;



import jakarta.persistence.Id;

import java.util.List;

import com.back.backend.enums.Role;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.Lob;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
 private int id ; 
 private String firstName ; 
 private String lastName ; 
 private String email ; 
 private Role role ; // its an enum
 private String password ; 

 @Lob
 @Column(name = "image", columnDefinition="bytea")
    private byte[] image;

@OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
private List<Poste> postes  ;

@OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
// un utilisateur peut aimer plusieurs postes
private List<PosteLikes> posteLikes;

@OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
private List<EventParticipants> eventParticipants ; 
}
