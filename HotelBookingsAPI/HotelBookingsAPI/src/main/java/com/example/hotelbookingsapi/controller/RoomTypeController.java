package com.example.hotelbookingsapi.controller;

import com.example.hotelbookingsapi.model.RoomType;
import com.example.hotelbookingsapi.service.RoomTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/roomtype")
@CrossOrigin(origins = {"http://localhost:3000"})
public class RoomTypeController {

    @Autowired
    private RoomTypeService roomTypeService;

    @GetMapping("/getAll")
    public List<RoomType> getAllRoomTypes() {
        return roomTypeService.getAllRoomTypes();
    }

    @GetMapping("/getById/{id}")
    public ResponseEntity<RoomType> getRoomTypeById(@PathVariable Integer id) {
        RoomType roomType = roomTypeService.getRoomTypeById(id);
        return ResponseEntity.ok().body(roomType);
    }

    @PostMapping("/create")
    public ResponseEntity<RoomType> createRoomType(@RequestBody RoomType roomType) {
        RoomType createdRoomType = roomTypeService.createRoomType(roomType);
        return ResponseEntity.ok().body(createdRoomType);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<RoomType> updateRoomType(@PathVariable Integer id, @RequestBody RoomType roomTypeDetails) {
        RoomType updatedRoomType = roomTypeService.updateRoomType(id, roomTypeDetails);
        return ResponseEntity.ok().body(updatedRoomType);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteRoomType(@PathVariable Integer id) {
        roomTypeService.deleteRoomType(id);
        return ResponseEntity.noContent().build();
    }
}
