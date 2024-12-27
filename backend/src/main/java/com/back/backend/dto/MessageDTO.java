package com.back.backend.dto;

public class MessageDTO {
    private int etudiantId;
    private int laureatId;
    private String contenue;

    // Getters and setters
    public int getEtudiantId() {
        return etudiantId;
    }

    public void setEtudiantId(int etudiantId) {
        this.etudiantId = etudiantId;
    }

    public int getLaureatId() {
        return laureatId;
    }

    public void setLaureatId(int laureatId) {
        this.laureatId = laureatId;
    }

    public String getContenue() {
        return contenue;
    }

    public void setContenue(String contenue) {
        this.contenue = contenue;
    }
}
