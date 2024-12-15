package com.back.backend.Entities;

import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Caummunaute {
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private int id  ; 
private String titre ; 
private String description ; 

// admin peut creer plusieurs caummunautes 
@ManyToOne
@JoinColumn(name = "admin_id", nullable = false)
private Admin admin ;

    public void setAdmin(Admin admin) {
        this.admin = admin;
    }

    public String getTitre() {
        return titre;
    }
    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }

    public void setTitre(String titre) {
        this.titre = titre;
    }
}
