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
    private int id;

    private TypePoste typePoste;

    private String textArea;

    private LocalDateTime datePoste;
    private int nbrLikes ; 

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false, updatable = false, insertable = false)
    @JsonBackReference(value = "user-poste")
    private User user;

    @OneToMany(mappedBy = "poste", cascade = CascadeType.ALL)
    // A poste can have multiple likes
    @JsonManagedReference(value = "poste-likes")
    private List<PosteLikes> posteLikes;

    @Column(name = "user_id")
    private int userId;

    // Multiple postes can belong to a single caummunaute
    @ManyToOne
    @JoinColumn(name = "caummunaute_id", nullable = true)
    private Caummunaute caummunaute;

    @OneToMany(mappedBy = "poste", cascade = CascadeType.ALL)
    // A poste can have multiple files
    @JsonManagedReference("poste-files")
    private List<PosteFiles> posteFiles;

}
