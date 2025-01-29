package com.back.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PosteFileDTO {
    private int id;
    private String fileName;
    private String fileType;
    private byte[] data; 
}
