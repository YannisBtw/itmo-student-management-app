package ru.itmo.weblab3.dto;

public class StudentQueryDto {

    private String fullName;
    private Integer isuId;
    private String group;
    private Integer dormitoryNumber;
    private Integer roomNumber;
    private String moveInDate;
    private Boolean isForeign;
    private String notes;

    private String sortBy;
    private String sortDirection;

    private Integer page;
    private Integer size;


    public StudentQueryDto() {
    }


    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }


    public Integer getIsuId() {
        return isuId;
    }

    public void setIsuId(Integer isuId) {
        this.isuId = isuId;
    }


    public String getGroup() {
        return group;
    }

    public void setGroup(String group) {
        this.group = group;
    }


    public Integer getDormitoryNumber() {
        return dormitoryNumber;
    }

    public void setDormitoryNumber(
            Integer dormitoryNumber
    ) {
        this.dormitoryNumber = dormitoryNumber;
    }


    public Integer getRoomNumber() {
        return roomNumber;
    }

    public void setRoomNumber(Integer roomNumber) {
        this.roomNumber = roomNumber;
    }


    public String getMoveInDate() {
        return moveInDate;
    }

    public void setMoveInDate(String moveInDate) {
        this.moveInDate = moveInDate;
    }


    public Boolean getIsForeign() {
        return isForeign;
    }

    public void setIsForeign(Boolean isForeign) {
        this.isForeign = isForeign;
    }


    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }


    public String getSortBy() {
        return sortBy;
    }

    public void setSortBy(String sortBy) {
        this.sortBy = sortBy;
    }


    public String getSortDirection() {
        return sortDirection;
    }

    public void setSortDirection(
            String sortDirection
    ) {
        this.sortDirection = sortDirection;
    }


    public Integer getPage() {
        return page;
    }

    public void setPage(Integer page) {
        this.page = page;
    }


    public Integer getSize() {
        return size;
    }

    public void setSize(Integer size) {
        this.size = size;
    }
}