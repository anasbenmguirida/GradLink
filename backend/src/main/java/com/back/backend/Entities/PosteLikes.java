package com.back.backend.Entities;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PosteLikes {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false , insertable=false, updatable=false)
     @JsonBackReference(value = "user-likes")
    private User user ;

    @ManyToOne
    @JoinColumn(name = "poste_id", nullable = false , insertable=false, updatable=false)
   @JsonBackReference("poste-likes")
    private Poste poste ;

    @Column(name = "poste_id")
    private int posteId ; 

    @Column(name = "user_id")
    private int userId ; 
}
