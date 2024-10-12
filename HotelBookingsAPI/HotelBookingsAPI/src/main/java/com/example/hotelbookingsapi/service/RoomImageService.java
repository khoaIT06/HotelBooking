package com.example.hotelbookingsapi.service;

import com.example.hotelbookingsapi.model.RoomImage;
import com.example.hotelbookingsapi.repository.RoomImageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.hotelbookingsapi.Custom.ResourceNotFoundException;

import java.util.List;
import java.util.Optional;

@Service
public class RoomImageService {

    @Autowired
    private RoomImageRepository roomImageRepository;

    public List<RoomImage> getAllImages() {
        return roomImageRepository.findAll();
    }

    public RoomImage getImageById(Integer id) {
        return roomImageRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Image not found"));
    }

    public RoomImage createImage(RoomImage roomImage) {
        return roomImageRepository.save(roomImage);
    }

    public RoomImage updateImage(Integer id, RoomImage roomImage) {
        RoomImage existingImage = getImageById(id);
        existingImage.setUrl(roomImage.getUrl());
        return roomImageRepository.save(existingImage);
    }

    public void deleteImage(Integer id) {
        roomImageRepository.deleteById(id);
    }

    public List<RoomImage> getImagesByRoomId(Integer roomId) {
        return roomImageRepository.findByRoomId(roomId);
    }

    public Optional<RoomImage> getRoomImageByUrl(String url) {
        return roomImageRepository.findByUrl(url);
    }

    public void deleteImagesByRoomId(int roomId) {
        List<RoomImage> roomImages = roomImageRepository.findByRoomId(roomId);
        for (RoomImage image : roomImages) {
            roomImageRepository.delete(image);
        }
    }
}
