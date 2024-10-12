package com.example.hotelbookingsapi.repository;

import com.example.hotelbookingsapi.model.RoomStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoomStatusRepository extends JpaRepository<RoomStatus, Integer> {
    RoomStatus findByName(String name);
}