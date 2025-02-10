package com.back.backend.dto;

import com.back.backend.Entities.Message;
import java.util.List;

public class ContactMessagesDTO {

    private int id;
    private String firstName;
    private String lastName;
    private List<Message> messages;
    private String profilePhoto;

    public ContactMessagesDTO(int id, String firstName, String lastName,  String profilePhoto, List<Message> messages) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.profilePhoto = profilePhoto;
        this.messages = messages;

    }

    public int getId() {
        return id;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getProfilePhoto() {
        return profilePhoto;
    }

    public List<Message> getMessages() {
        return messages;
    }
}