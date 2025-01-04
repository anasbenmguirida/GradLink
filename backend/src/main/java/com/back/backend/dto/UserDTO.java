package com.back.backend.DTO;

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
    private byte[] photoProfile;
}
