package com.example.hotelbookingsapi.service;

import com.example.hotelbookingsapi.model.Booking;
import com.example.hotelbookingsapi.model.BookingDetail;
import com.example.hotelbookingsapi.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.hotelbookingsapi.Custom.ResourceNotFoundException;
import com.example.hotelbookingsapi.model.Account;
import com.example.hotelbookingsapi.DTO.BookingInfoDTO;
import com.example.hotelbookingsapi.repository.AccountRepository;
import com.example.hotelbookingsapi.model.Account;
import com.example.hotelbookingsapi.repository.BookingRepository;
import com.example.hotelbookingsapi.model.BookingStatus;
import com.example.hotelbookingsapi.DTO.RoomInfoDTO;
import com.example.hotelbookingsapi.model.Room;
import com.example.hotelbookingsapi.model.RoomStatus;
import com.example.hotelbookingsapi.repository.RoomRepository;

import java.util.List;
import java.util.Collections;
import java.util.stream.Collectors;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private BookingStatusRepository bookingStatusRepository;

    @Autowired
    private BookingDetailRepository bookingDetailRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private RoomStatusRepository roomStatusRepository;

    @Autowired
    private RoomRepository roomRepository;

    public Booking createBooking(Booking booking) {
        Booking savedBooking = bookingRepository.save(booking);
        return savedBooking;
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public Booking getBookingById(Integer id) {
        return bookingRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
    }

    public void deleteBooking(Integer id) {
        bookingRepository.deleteById(id);
    }

    public Booking updateBooking(Integer id, Booking bookingDetails) {
        Booking booking = getBookingById(id);

        booking.setCheckInDate(bookingDetails.getCheckInDate());
        booking.setCheckOutDate(bookingDetails.getCheckOutDate());
        booking.setTotalAmount(bookingDetails.getTotalAmount());
        booking.setCustomer(bookingDetails.getCustomer());
        booking.setBookingStatus(bookingDetails.getBookingStatus());

        return bookingRepository.save(booking);
    }

    public List<BookingInfoDTO> getBookingsByUsername(String username) {
        Account account = accountRepository.findByUsername(username);
        if (account != null) {
            List<Booking> bookings = bookingRepository.findByCustomerId(account.getCustomerId());
            return bookings.stream().map(booking -> {
                BookingInfoDTO dto = new BookingInfoDTO();
                dto.setBookingId(booking.getId());
                dto.setCheckInDate(booking.getCheckInDate());
                dto.setCheckOutDate(booking.getCheckOutDate());
                dto.setPrice(booking.getTotalAmount());
                dto.setBookingStatus(booking.getBookingStatus().getName());

                // Lấy thông tin phòng từ BookingDetail và Room
                List<RoomInfoDTO> roomInfos = booking.getBookingDetails().stream()
                        .map(detail -> new RoomInfoDTO(
                                detail.getRoom().getRoomNumber(),  // roomNumber
                                detail.getRoom().getRoomType().getName()  // roomType
                        )).collect(Collectors.toList());

                dto.setRoomInfos(roomInfos);
                return dto;
            }).collect(Collectors.toList());
        }
        return Collections.emptyList();
    }


    public void cancelBooking(Integer bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        BookingStatus cancelledStatus = bookingStatusRepository.findByName("Cancelled");
        booking.setBookingStatus(cancelledStatus);

        List<BookingDetail> bookingDetails = booking.getBookingDetails();
        RoomStatus availableStatus = roomStatusRepository.findByName("Available");
        bookingDetails.forEach(detail -> {
            Room room = detail.getRoom();
            room.setRoomStatus(availableStatus);
            roomRepository.save(room);
        });

        bookingRepository.save(booking);
    }
}
