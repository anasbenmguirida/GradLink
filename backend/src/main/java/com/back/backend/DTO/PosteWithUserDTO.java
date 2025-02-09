package com.back.backend.dto;

import com.back.backend.Entities.Poste;
import com.back.backend.Entities.User;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PosteWithUserDTO {
 private Poste poste;
    private  String firstName;
    private  String lastName;
    private String photoProfile;
}
