package com.example.hotelbookingsapi.service;

import com.example.hotelbookingsapi.model.Room;
import com.example.hotelbookingsapi.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;

import com.example.hotelbookingsapi.model.RoomImage;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import com.example.hotelbookingsapi.repository.RoomImageRepository;

@Service
public class RoomService {

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private RoomImageService roomImageService;

    @Autowired
    private RoomImageRepository roomImageRepository;

    public List<Room> findAll() {
        return roomRepository.findAll();
    }

    public Optional<Room> findById(Integer id) {
        return roomRepository.findById(id);
    }

    public Room save(Room room) {
        return roomRepository.save(room);
    }

    public void deleteById(Integer id) {
        roomRepository.deleteById(id);
    }

    private final String imagePath = "src/main/java/com/example/hotelbookingsapi/uploads/";

    public String saveFile(MultipartFile file) throws Exception {
        try {
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path directoryPath = Paths.get(imagePath);
            Path filePath = directoryPath.resolve(fileName);

            if (!Files.exists(directoryPath)) {
                Files.createDirectories(directoryPath);
            }
            Files.copy(file.getInputStream(), filePath);
            return fileName;
        } catch (IOException e) {
            e.printStackTrace();
            throw new Exception("Lỗi khi lưu tệp: " + e.getMessage());
        }
    }

    public void saveImageToDatabase(String fileName, Room room) {
        RoomImage roomImage = new RoomImage();
        roomImage.setRoom(room);
        roomImage.setUrl("uploads/" + fileName);
        roomImageRepository.save(roomImage);
    }
}
