package com.example.hotelbookingsapi.repository;

import com.example.hotelbookingsapi.model.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookingStatusRepository extends JpaRepository<BookingStatus, Integer> {
    BookingStatus findByName(String name);
}