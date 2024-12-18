package com.back.backend.Entities;

import java.sql.Date;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.back.backend.enums.TypePoste;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Poste {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id  ; 
    // pdf et les images 
   @Lob
    @Column(columnDefinition = "BYTEA")
    private byte[] fichiers;
    private TypePoste typePoste ; 
    private String textArea ; 
    private LocalDateTime datePoste ; 
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false, updatable = false, insertable = false)
    private User user;
    
    @OneToMany(mappedBy = "poste", cascade = CascadeType.ALL)
    // un poste peut avoir plusieurs reations(likes mostly)
    @JsonManagedReference
    private List<PosteLikes> posteLikes ; 
    @Column(name = "user_id")
    private int userId;

    // plusieurs postes peuvent appartenir a une seul caummunaute 
    @ManyToOne
    @JoinColumn(name = "caummunaute_id", nullable = true)
      @JsonBackReference
    private Caummunaute caummunaute;

}
