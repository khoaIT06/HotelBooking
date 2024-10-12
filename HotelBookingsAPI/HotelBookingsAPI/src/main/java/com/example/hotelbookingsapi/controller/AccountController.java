package com.example.hotelbookingsapi.controller;

import com.example.hotelbookingsapi.model.Account;
import com.example.hotelbookingsapi.repository.AccountRepository;
import com.example.hotelbookingsapi.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import com.example.hotelbookingsapi.DTO.PasswordCheckRequest;
import org.springframework.http.HttpStatus;
import com.example.hotelbookingsapi.DTO.PasswordResetRequest;
import com.example.hotelbookingsapi.service.PasswordResetService;
import com.example.hotelbookingsapi.DTO.VerificationCodeRequest;

import java.util.List;

@RestController
@RequestMapping("/accounts")
@CrossOrigin(origins = {"http://localhost:3000"})
public class AccountController {

    @Autowired
    private AccountService accountService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private PasswordResetService passwordResetService;

    private String verificationCode;
    @Autowired
    private AccountRepository accountRepository;

    @GetMapping("/getAll")
    public List<Account> getAllAccounts() {
        return accountService.getAllAccounts();
    }

    @GetMapping("/getById/{id}")
    public ResponseEntity<Account> getAccountById(@PathVariable Integer id) {
        return accountService.getAccountById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/create")
    public ResponseEntity<Account> createAccount(@RequestBody Account account) {
        Account createdAccount = accountService.createAccount(account);
        return ResponseEntity.ok(createdAccount);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Account> updateAccount(@PathVariable Integer id, @RequestBody Account accountDetails) {
        return accountService.updateAccount(id, accountDetails)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteAccount(@PathVariable Integer id) {
        try {
            accountService.deleteAccount(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/getByUsername/{username}")
    public ResponseEntity<Account> getByUsername(@PathVariable String username) {
        Account account = accountService.findByUsername(username);
        if (account != null) {
            return ResponseEntity.ok(account);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/checkPassword")
    public ResponseEntity<String> checkPassword(@RequestBody PasswordCheckRequest request) {
        Account account = accountService.findByUsername(request.getUsername());
        if (account != null) {
            boolean passwordMatch = passwordEncoder.matches(request.getOldPassword(), account.getPassword());
            if (passwordMatch) {
                return ResponseEntity.ok("Password is correct");
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Mật khẩu hiện tại không trùng khớp");
            }
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy tài khoản");
    }

    @PutMapping("/updatePassword")
    public ResponseEntity<String> updatePassword(@RequestBody PasswordCheckRequest request) {
        Account account = accountService.findByUsername(request.getUsername());
        if (account != null) {
            boolean passwordMatch = passwordEncoder.matches(request.getOldPassword(), account.getPassword());
            if (passwordMatch) {
                account.setPassword(passwordEncoder.encode(request.getNewPassword()));
                accountService.updateAccount(account.getId(), account);
                return ResponseEntity.ok("Password updated successfully");
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Mật khẩu hiện tại không trùng khớp");
            }
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy tài khoản");
    }

    @PutMapping("/resetPassword")
    public ResponseEntity<String> resetPassword(@RequestBody PasswordResetRequest request) {
        try {
            return passwordResetService.resetPassword(request);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/sendVerificationCode")
    public ResponseEntity<String> sendVerificationCode(@RequestBody VerificationCodeRequest request) {
        return passwordResetService.sendVerificationCode(request);
    }

    @DeleteMapping("/deleteByCustomerId/{customerid}")
    public ResponseEntity<String> deleteByCustomerId(@PathVariable Integer customerid) {
        return accountService.deleteAccountsByCustomerId(customerid);
    }

    @GetMapping("/findByCustomerId/{customerid}")
    public ResponseEntity<List<Account>> findByCustomerId(@PathVariable Integer customerid) {
        List<Account> accounts = accountRepository.findAllByCustomerId(customerid);
        if (accounts == null || accounts.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(accounts);
    }

    @GetMapping("/{id}/role-name")
    public ResponseEntity<String> getRoleName(@PathVariable Integer id) {
        String roleName = accountService.getRoleNameByAccountId(id);
        if (roleName != null) {
            return ResponseEntity.ok(roleName);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/updateRole")
    public ResponseEntity<String> updateRole(@RequestParam int customerid, @RequestParam int roleid) {
        try {
            accountService.updateRole(customerid, roleid);
            return ResponseEntity.ok("Cập nhật vai trò thành công.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Đã xảy ra lỗi khi cập nhật vai trò.");
        }
    }

    @PutMapping("/disable/{accountid}")
    public ResponseEntity<String> disableAccount(@PathVariable int accountid) {
        try {
            accountService.disableAccount(accountid);
            return ResponseEntity.ok("Vô hiệu hóa tài khoản thành công.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Đã xảy ra lỗi khi vô hiệu hóa tài khoản.");
        }
    }
}
