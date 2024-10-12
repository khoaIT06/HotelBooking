package com.example.hotelbookingsapi.service;

import com.example.hotelbookingsapi.DTO.PasswordResetRequest;
import com.example.hotelbookingsapi.model.Account;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.example.hotelbookingsapi.model.Customer;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import com.example.hotelbookingsapi.DTO.VerificationCodeRequest;


@Service
public class PasswordResetService {

    @Autowired
    private CustomerService customerService;

    @Autowired
    private AccountService accountService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private String verificationCode;

    public ResponseEntity<String> sendVerificationCode(VerificationCodeRequest request) {
        this.verificationCode = request.getCode();
        return ResponseEntity.ok("Mã xác nhận đã được gửi");
    }

    public ResponseEntity<String> resetPassword(PasswordResetRequest request) {
        if (!request.getVerificationCode().equals(verificationCode)) {
            return ResponseEntity.badRequest().body("Mã xác nhận không chính xác.");
        }

        Customer customer = customerService.findByEmail(request.getEmail());
        if (customer == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy tài khoản với email này");
        }

        Integer customerId = customer.getId();
        Account account = accountService.findByCustomerId(customerId);
        if (account == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy tài khoản liên kết với khách hàng");
        }

        account.setPassword(passwordEncoder.encode(request.getNewPassword()));
        accountService.updateAccount(account.getId(), account);

        // Xóa mã xác nhận sau khi sử dụng
        verificationCode = null;

        return ResponseEntity.ok("Mật khẩu đã được cập nhật thành công");
    }
}
