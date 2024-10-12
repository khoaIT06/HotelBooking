package com.example.hotelbookingsapi.controller;

import com.example.hotelbookingsapi.model.BookingDetail;
import com.example.hotelbookingsapi.service.BookingDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/bookingdetails")
@CrossOrigin(origins = {"http://localhost:3000"})
public class BookingDetailController {

    @Autowired
    private BookingDetailService bookingDetailService;

    @PostMapping("/create")
    public ResponseEntity<BookingDetail> createBookingDetail(@RequestBody BookingDetail bookingDetail) {
        BookingDetail createdBookingDetail = bookingDetailService.createBookingDetail(bookingDetail);
        return ResponseEntity.ok(createdBookingDetail);
    }

    @GetMapping("/getAll")
    public List<BookingDetail> getAllBookingDetails() {
        return bookingDetailService.getAllBookingDetails();
    }

    @GetMapping("/getById/{id}")
    public ResponseEntity<BookingDetail> getBookingDetailById(@PathVariable Integer id) {
        BookingDetail bookingDetail = bookingDetailService.getBookingDetailById(id);
        return ResponseEntity.ok(bookingDetail);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<BookingDetail> updateBookingDetail(@PathVariable Integer id, @RequestBody BookingDetail bookingDetailDetails) {
        BookingDetail updatedBookingDetail = bookingDetailService.updateBookingDetail(id, bookingDetailDetails);
        return ResponseEntity.ok(updatedBookingDetail);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteBookingDetail(@PathVariable Integer id) {
        bookingDetailService.deleteBookingDetail(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/getDetails/{bookingid}")
    public ResponseEntity<List<BookingDetail>> getAllBookingDetailsByBookingId(@PathVariable("bookingid") int bookingId) {
        List<BookingDetail> bookingDetails = bookingDetailService.getAllBookingDetailsByBookingId(bookingId);
        return ResponseEntity.ok(bookingDetails);
    }
}
