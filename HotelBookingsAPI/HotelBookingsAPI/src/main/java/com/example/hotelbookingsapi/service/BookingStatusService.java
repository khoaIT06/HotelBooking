package com.example.hotelbookingsapi.service;

import com.example.hotelbookingsapi.model.BookingStatus;
import com.example.hotelbookingsapi.repository.BookingStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.hotelbookingsapi.Custom.ResourceNotFoundException;

import java.util.List;

@Service
public class BookingStatusService {

    @Autowired
    private BookingStatusRepository bookingStatusRepository;

    public List<BookingStatus> getAllBookingStatuses() {
        return bookingStatusRepository.findAll();
    }

    public BookingStatus getBookingStatusById(Integer id) {
        return bookingStatusRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("BookingStatus not found with id " + id));
    }

    public BookingStatus createBookingStatus(BookingStatus bookingStatus) {
        return bookingStatusRepository.save(bookingStatus);
    }

    public BookingStatus updateBookingStatus(Integer id, BookingStatus bookingStatusDetails) {
        BookingStatus bookingStatus = getBookingStatusById(id);
        bookingStatus.setName(bookingStatusDetails.getName());
        return bookingStatusRepository.save(bookingStatus);
    }

    public void deleteBookingStatus(Integer id) {
        BookingStatus bookingStatus = getBookingStatusById(id);
        bookingStatusRepository.delete(bookingStatus);
    }
}
