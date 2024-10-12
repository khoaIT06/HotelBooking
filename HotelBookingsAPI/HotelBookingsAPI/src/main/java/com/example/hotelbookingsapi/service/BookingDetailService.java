package com.example.hotelbookingsapi.service;

import com.example.hotelbookingsapi.model.BookingDetail;
import com.example.hotelbookingsapi.repository.BookingDetailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.hotelbookingsapi.Custom.ResourceNotFoundException;

import java.util.List;

@Service
public class BookingDetailService {

    @Autowired
    private BookingDetailRepository bookingDetailRepository;

    public BookingDetail createBookingDetail(BookingDetail bookingDetail) {
        return bookingDetailRepository.save(bookingDetail);
    }

    public List<BookingDetail> getAllBookingDetails() {
        return bookingDetailRepository.findAll();
    }

    public BookingDetail getBookingDetailById(Integer id) {
        return bookingDetailRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("BookingDetail not found"));
    }

    public void deleteBookingDetail(Integer id) {
        bookingDetailRepository.deleteById(id);
    }

    public BookingDetail updateBookingDetail(Integer id, BookingDetail bookingDetailDetails) {
        BookingDetail bookingDetail = getBookingDetailById(id);
        bookingDetail.setRoom(bookingDetailDetails.getRoom());
        bookingDetail.setBooking(bookingDetailDetails.getBooking());
        return bookingDetailRepository.save(bookingDetail);
    }

    public List<BookingDetail> getAllBookingDetailsByBookingId(int bookingid) {
        return bookingDetailRepository.findAllByBookingId(bookingid);
    }
}
