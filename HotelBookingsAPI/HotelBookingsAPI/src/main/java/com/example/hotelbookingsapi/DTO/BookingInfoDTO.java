package com.example.hotelbookingsapi.DTO;
import java.time.LocalDate;
import com.example.hotelbookingsapi.DTO.RoomInfoDTO;

import java.util.List;

public class    BookingInfoDTO {
    private int bookingId;
    private int roomNumber;
    private int price;
    private String roomType;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private String bookingStatus;
    private List<RoomInfoDTO> roomInfos;

    public int getBookingId() {
        return bookingId;
    }

    public void setBookingId(int bookingId) {
        this.bookingId = bookingId;
    }

    public int getRoomNumber() {
        return roomNumber;
    }

    public void setRoomNumber(int roomNumber) {
        this.roomNumber = roomNumber;
    }

    public int getPrice() {
        return price;
    }

    public void setPrice(int price) {
        this.price = price;
    }

    public LocalDate getCheckInDate() {
        return checkInDate;
    }

    public void setCheckInDate(LocalDate checkInDate) {
        this.checkInDate = checkInDate;
    }

    public LocalDate getCheckOutDate() {
        return checkOutDate;
    }

    public void setCheckOutDate(LocalDate checkOutDate) {
        this.checkOutDate = checkOutDate;
    }

    public String getBookingStatus() {
        return bookingStatus;
    }

    public void setBookingStatus(String bookingStatus) {
        this.bookingStatus = bookingStatus;
    }

    public String getRoomType() {
        return roomType;
    }

    public void setRoomType(String roomType) {
        this.roomType = roomType;
    }

    public List<RoomInfoDTO> getRoomInfos() {
        return roomInfos;
    }

    public void setRoomInfos(List<RoomInfoDTO> roomInfos) {
        this.roomInfos = roomInfos;
    }

}
