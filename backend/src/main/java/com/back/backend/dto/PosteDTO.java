package com.back.backend.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PosteDTO {
    private int id;
    private String textArea;
    private UserDTO user;
    private List<PosteFileDTO> posteFiles; // List of files associated with the post
}
