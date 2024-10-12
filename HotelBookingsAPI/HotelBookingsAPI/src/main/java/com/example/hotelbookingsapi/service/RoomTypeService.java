package com.example.hotelbookingsapi.service;

import com.example.hotelbookingsapi.model.RoomType;
import com.example.hotelbookingsapi.repository.RoomTypeRepository;
import com.example.hotelbookingsapi.Custom.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoomTypeService {

    @Autowired
    private RoomTypeRepository roomTypeRepository;

    public List<RoomType> getAllRoomTypes() {
        return roomTypeRepository.findAll();
    }

    public RoomType getRoomTypeById(Integer id) {
        return roomTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("RoomType not found for this id :: " + id));
    }

    public RoomType createRoomType(RoomType roomType) {
        return roomTypeRepository.save(roomType);
    }

    public RoomType updateRoomType(Integer id, RoomType roomTypeDetails) {
        RoomType roomType = roomTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("RoomType not found for this id :: " + id));

        roomType.setName(roomTypeDetails.getName());

        return roomTypeRepository.save(roomType);
    }

    public void deleteRoomType(Integer id) {
        RoomType roomType = roomTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("RoomType not found for this id :: " + id));

        roomTypeRepository.delete(roomType);
    }
}
