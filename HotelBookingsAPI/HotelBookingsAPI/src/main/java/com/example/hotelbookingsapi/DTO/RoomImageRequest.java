package com.example.hotelbookingsapi.DTO;
import org.springframework.web.multipart.MultipartFile;

public class RoomImageRequest {
    private MultipartFile file; // Tệp ảnh
    private boolean isEdit;

    public MultipartFile getFile() {
        return file;
    }

    public void setFile(MultipartFile file) {
        this.file = file;
    }

    public boolean isEdit() {
        return isEdit;
    }

    public void setEdit(boolean edit) {
        isEdit = edit;
    }
}
