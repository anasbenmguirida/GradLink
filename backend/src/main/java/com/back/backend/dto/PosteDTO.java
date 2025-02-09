package com.back.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

import com.back.backend.Entities.Poste;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PosteDTO {
    private int id;
    private String textArea;
    private LocalDateTime datePoste;

    private UserDTO user;
    private List<PosteFileDTO> posteFiles; // List of files associated with the post
}
