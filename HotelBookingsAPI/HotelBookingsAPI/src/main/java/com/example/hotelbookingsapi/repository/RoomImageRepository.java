package com.example.hotelbookingsapi.repository;

import com.example.hotelbookingsapi.model.RoomImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface RoomImageRepository extends JpaRepository<RoomImage, Integer> {
    List<RoomImage> findByRoomId(Integer roomId);
    Optional<RoomImage> findByUrl(String url);
}