package com.example.hotelbookingsapi.controller;

import com.example.hotelbookingsapi.model.Room;
import com.example.hotelbookingsapi.repository.RoomImageRepository;
import com.example.hotelbookingsapi.service.RoomImageService;
import com.example.hotelbookingsapi.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.example.hotelbookingsapi.model.RoomImage;
import com.example.hotelbookingsapi.repository.RoomRepository;
import com.example.hotelbookingsapi.DTO.RoomImageRequest;
import com.example.hotelbookingsapi.model.RoomStatus;

import java.util.Map;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/rooms")
@CrossOrigin(origins = {"http://localhost:3000"})
public class RoomController {

    @Autowired
    private RoomService roomService;
    @Autowired
    private RoomImageService roomImageService;

    @GetMapping("/getAll")
    public List<Room> getAllRooms() {
        return roomService.findAll();
    }

    @GetMapping("/getById/{id}")
    public ResponseEntity<Room> getRoomById(@PathVariable Integer id) {
        Optional<Room> room = roomService.findById(id);
        return room.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/create")
    public Room createRoom(@RequestPart("roomData") String roomData, @RequestPart("images") List<MultipartFile> images) {
        ObjectMapper objectMapper = new ObjectMapper();
        Room room;

        try {
            room = objectMapper.readValue(roomData, Room.class);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            throw new IllegalArgumentException("Lỗi khi chuyển đổi dữ liệu phòng: " + e.getMessage());
        }

        if (room.getRoomType() == null || room.getRoomStatus() == null) {
            throw new IllegalArgumentException("Room Type and Status are required.");
        }

        Room savedRoom = roomService.save(room);

        if (images != null && !images.isEmpty()) {
            for (MultipartFile image : images) {
                try {
                    String fileName = roomService.saveFile(image);
                    roomService.saveImageToDatabase(fileName, savedRoom);
                } catch (Exception e) {
                    e.printStackTrace();
                    throw new IllegalArgumentException("Lỗi khi lưu ảnh: " + e.getMessage());
                }
            }
        }
        return savedRoom;
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Room> updateRoom(
            @PathVariable Integer id,
            @RequestPart("roomData") String roomData,
            @RequestPart(value = "images", required = false) List<MultipartFile> images) {

        Optional<Room> existingRoomOpt = roomService.findById(id);

        if (!existingRoomOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        ObjectMapper objectMapper = new ObjectMapper();
        Room room;

        try {
            room = objectMapper.readValue(roomData, Room.class);
            room.setId(id);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            throw new IllegalArgumentException("Lỗi khi chuyển đổi dữ liệu phòng: " + e.getMessage());
        }

        Room updatedRoom = roomService.save(room);

        if (images != null && !images.isEmpty()) {
            for (MultipartFile image : images) {
                try {
                    String fileName = roomService.saveFile(image);
                    roomService.saveImageToDatabase(fileName, updatedRoom);
                } catch (Exception e) {
                    e.printStackTrace();
                    throw new IllegalArgumentException("Lỗi khi lưu ảnh: " + e.getMessage());
                }
            }
        }

        return ResponseEntity.ok(updatedRoom);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteRoom(@PathVariable Integer id) {
        if (roomService.findById(id).isPresent()) {
            roomService.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/updateStatus/{id}")
    public ResponseEntity<Room> updateRoomStatus(@PathVariable Integer id) {
        Optional<Room> existingRoomOpt = roomService.findById(id);

        if (!existingRoomOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        Room room = existingRoomOpt.get();
        RoomStatus bookedStatus = new RoomStatus();
        bookedStatus.setId(2);
        room.setRoomStatus(bookedStatus);

        Room updatedRoom = roomService.save(room);

        return ResponseEntity.ok(updatedRoom);
    }
}
