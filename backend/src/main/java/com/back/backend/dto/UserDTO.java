package com.back.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;



@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {
    private int id;
    private String firstName;
    private String lastName;
    private String photoProfile;
}
