package com.example.hotelbookingsapi.controller;

import com.example.hotelbookingsapi.model.RoomStatus;
import com.example.hotelbookingsapi.service.RoomStatusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/roomstatus")
@CrossOrigin(origins = {"http://localhost:3000"})
public class RoomStatusController {

    @Autowired
    private RoomStatusService roomStatusService;

    @GetMapping("/getAll")
    public List<RoomStatus> getAllRoomStatuses() {
        return roomStatusService.getAllRoomStatuses();
    }

    @GetMapping("/getById/{id}")
    public ResponseEntity<RoomStatus> getRoomStatusById(@PathVariable Integer id) {
        RoomStatus roomStatus = roomStatusService.getRoomStatusById(id);
        return ResponseEntity.ok().body(roomStatus);
    }

    @PostMapping("/create")
    public ResponseEntity<RoomStatus> createRoomStatus(@RequestBody RoomStatus roomStatus) {
        RoomStatus createdRoomStatus = roomStatusService.createRoomStatus(roomStatus);
        return ResponseEntity.ok().body(createdRoomStatus);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<RoomStatus> updateRoomStatus(@PathVariable Integer id, @RequestBody RoomStatus roomStatusDetails) {
        RoomStatus updatedRoomStatus = roomStatusService.updateRoomStatus(id, roomStatusDetails);
        return ResponseEntity.ok().body(updatedRoomStatus);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteRoomStatus(@PathVariable Integer id) {
        roomStatusService.deleteRoomStatus(id);
        return ResponseEntity.noContent().build();
    }
}
