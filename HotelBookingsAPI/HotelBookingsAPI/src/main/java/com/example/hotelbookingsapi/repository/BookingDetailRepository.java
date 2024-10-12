package com.example.hotelbookingsapi.repository;

import com.example.hotelbookingsapi.model.BookingDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingDetailRepository extends JpaRepository<BookingDetail, Integer> {
    List<BookingDetail> findAllByBookingId(int bookingid);
}