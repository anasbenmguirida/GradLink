package com.back.backend.Entities;



import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import lombok.Data;

@Entity
@Data
public class PosteFiles {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id  ; 
    private String fileName ;
    private String fileType;
     @Lob
    @Column(columnDefinition = "BYTEA")
    private byte[] data;
    
    @ManyToOne
    @JoinColumn(name = "poste_id", nullable = false)
    @JsonBackReference("poste-files")
    private Poste poste ;

}
