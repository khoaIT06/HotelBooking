package com.example.hotelbookingsapi.controller;

import com.example.hotelbookingsapi.model.BookingStatus;
import com.example.hotelbookingsapi.service.BookingStatusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/bookingstatus")
@CrossOrigin(origins = {"http://localhost:3000"})
public class BookingStatusController {

    @Autowired
    private BookingStatusService bookingStatusService;

    @GetMapping("/getAll")
    public List<BookingStatus> getAllBookingStatuses() {
        return bookingStatusService.getAllBookingStatuses();
    }

    @GetMapping("/getById/{id}")
    public ResponseEntity<BookingStatus> getBookingStatusById(@PathVariable Integer id) {
        BookingStatus bookingStatus = bookingStatusService.getBookingStatusById(id);
        return ResponseEntity.ok(bookingStatus);
    }

    @PostMapping("/create")
    public ResponseEntity<BookingStatus> createBookingStatus(@RequestBody BookingStatus bookingStatus) {
        BookingStatus createdBookingStatus = bookingStatusService.createBookingStatus(bookingStatus);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdBookingStatus);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<BookingStatus> updateBookingStatus(@PathVariable Integer id, @RequestBody BookingStatus bookingStatusDetails) {
        BookingStatus updatedBookingStatus = bookingStatusService.updateBookingStatus(id, bookingStatusDetails);
        return ResponseEntity.ok(updatedBookingStatus);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteBookingStatus(@PathVariable Integer id) {
        bookingStatusService.deleteBookingStatus(id);
        return ResponseEntity.noContent().build();
    }
}