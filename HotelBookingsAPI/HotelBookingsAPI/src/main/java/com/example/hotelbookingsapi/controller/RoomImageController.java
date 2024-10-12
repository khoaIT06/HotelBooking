package com.example.hotelbookingsapi.controller;

import com.example.hotelbookingsapi.model.RoomImage;
import com.example.hotelbookingsapi.service.RoomImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import java.io.File;
import org.springframework.core.io.Resource;

import java.util.List;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import org.springframework.web.multipart.MultipartFile;
import java.util.Optional;

@RestController
@RequestMapping("/roomimages")
@CrossOrigin(origins = {"http://localhost:3000"})
public class RoomImageController {

    @Autowired
    private RoomImageService roomImageService;

    @GetMapping("/getAll")
    public List<RoomImage> getAllImages() {
        return roomImageService.getAllImages();
    }

    @GetMapping("getById/{id}")
    public ResponseEntity<RoomImage> getImageById(@PathVariable Integer id) {
        return ResponseEntity.ok(roomImageService.getImageById(id));
    }

    @PostMapping("create")
    public RoomImage createImage(@RequestBody RoomImage roomImage) {
        return roomImageService.createImage(roomImage);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<RoomImage> updateImage(@PathVariable Integer id, @RequestBody RoomImage roomImage) {
        return ResponseEntity.ok(roomImageService.updateImage(id, roomImage));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteImage(@PathVariable Integer id) {
        roomImageService.deleteImage(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/getImage/{filename}")
    public ResponseEntity<Resource> getImage(@PathVariable String filename) {
        String uploadDir = "src/main/java/com/example/hotelbookingsapi/uploads/";
        File imgFile = new File(uploadDir + filename);

        if (imgFile.exists()) {
            try {
                String contentType = Files.probeContentType(imgFile.toPath());
                if (contentType == null) {
                    contentType = "application/octet-stream";
                }

                HttpHeaders headers = new HttpHeaders();
                headers.set(HttpHeaders.CONTENT_TYPE, contentType);

                FileSystemResource resource = new FileSystemResource(imgFile);
                return new ResponseEntity<>(resource, headers, HttpStatus.OK);
            } catch (IOException e) {
                e.printStackTrace();
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/upload")
    public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file) {
        String uploadDir = "src/main/java/com/example/hotelbookingsapi/uploads/";

        File directory = new File(uploadDir);
        if (!directory.exists()) {
            directory.mkdirs();
        }

        try {
            String fileName = file.getOriginalFilename();
            File saveFile = new File(uploadDir + fileName);
            file.transferTo(saveFile);

            RoomImage roomImage = new RoomImage();
            roomImage.setUrl("uploads/" + fileName);
            roomImageService.createImage(roomImage);

            return ResponseEntity.ok("File uploaded successfully");
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Failed to upload file");
        }
    }

    @GetMapping("/getByRoomId/{roomId}")
    public ResponseEntity<List<RoomImage>> getRoomImagesByRoomId(@PathVariable int roomId) {
        List<RoomImage> roomImages = roomImageService.getImagesByRoomId(roomId);
        if (roomImages.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(roomImages);
    }

    @GetMapping("/getByUrl/{url}")
    public ResponseEntity<RoomImage> getRoomImageByUrl(@PathVariable String url) {
        Optional<RoomImage> roomImage = roomImageService.getRoomImageByUrl("uploads/" + url);
        return roomImage.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/deleteByRoomId/{roomId}")
    public ResponseEntity<Void> deleteByRoomId(@PathVariable int roomId) {
        roomImageService.deleteImagesByRoomId(roomId);
        return ResponseEntity.noContent().build();
    }
}
