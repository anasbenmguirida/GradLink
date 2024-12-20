package com.back.backend.Entities;



import jakarta.persistence.Id;

import java.util.Collection;
import java.util.List;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.Type;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.back.backend.enums.Role;
import com.fasterxml.jackson.annotation.JsonManagedReference;

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
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;



@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
@Inheritance(strategy = InheritanceType.JOINED)
@Table(name = "users")
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
 private int id ; 
 private String firstName ; 
 private String lastName ; 
 private String email ; 
 private Role role ; // its an enum
 private String password ; 

 /*@Lob 
private byte[] image ; 
*/

    
@OneToMany(mappedBy = "user", cascade = CascadeType.ALL)

private List<Poste> postes  ;

@OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
// un utilisateur peut aimer plusieurs postes

private List<PosteLikes> posteLikes;

@OneToMany(mappedBy = "user", cascade = CascadeType.ALL)

private List<EventParticipants> eventParticipants ; 


// ovvering the methods for the interface UserDetails
@Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.name()));
    }

    @Override
    public String getUsername() {
        return this.email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override

    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }




}
