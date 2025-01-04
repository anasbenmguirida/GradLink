package com.back.backend.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CaummunauteDTO {
    private int id;
    private String name;
    private String description;
    private List<PosteDTO> postes; // List of postes in the community
}
