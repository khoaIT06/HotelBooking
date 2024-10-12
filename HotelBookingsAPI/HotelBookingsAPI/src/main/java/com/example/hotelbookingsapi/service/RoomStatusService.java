package com.example.hotelbookingsapi.service;

import com.example.hotelbookingsapi.model.RoomStatus;
import com.example.hotelbookingsapi.repository.RoomStatusRepository;
import com.example.hotelbookingsapi.Custom.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoomStatusService {

    @Autowired
    private RoomStatusRepository roomStatusRepository;

    public List<RoomStatus> getAllRoomStatuses() {
        return roomStatusRepository.findAll();
    }

    public RoomStatus getRoomStatusById(Integer id) {
        return roomStatusRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("RoomStatus not found for this id :: " + id));
    }

    public RoomStatus createRoomStatus(RoomStatus roomStatus) {
        return roomStatusRepository.save(roomStatus);
    }

    public RoomStatus updateRoomStatus(Integer id, RoomStatus roomStatusDetails) {
        RoomStatus roomStatus = roomStatusRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("RoomStatus not found for this id :: " + id));

        roomStatus.setName(roomStatusDetails.getName());

        return roomStatusRepository.save(roomStatus);
    }

    public void deleteRoomStatus(Integer id) {
        RoomStatus roomStatus = roomStatusRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("RoomStatus not found for this id :: " + id));

        roomStatusRepository.delete(roomStatus);
    }
}
