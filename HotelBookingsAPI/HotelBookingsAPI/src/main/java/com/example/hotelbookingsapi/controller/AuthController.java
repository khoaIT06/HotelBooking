package com.example.hotelbookingsapi.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.example.hotelbookingsapi.config.JwtUtil;
import com.example.hotelbookingsapi.model.AuthenticationRequest;
import com.example.hotelbookingsapi.model.Account;
import com.example.hotelbookingsapi.repository.AccountRepository;
import com.example.hotelbookingsapi.DTO.RegisterRequest;
import com.example.hotelbookingsapi.model.Customer;
import com.example.hotelbookingsapi.repository.CustomerRepository;
import com.example.hotelbookingsapi.repository.RoleRepository;
import com.example.hotelbookingsapi.DTO.LoginResponse;
import com.example.hotelbookingsapi.model.MyUserDetails;

@RestController
@RequestMapping("/api")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private RoleRepository roleRepository;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest registerRequest) {
        try {
            // Tạo đối tượng Customer từ thông tin khách hàng
            Customer customer = new Customer();
            customer.setName(registerRequest.getName());
            customer.setbirthday(registerRequest.getBirthday());
            customer.setPhone(registerRequest.getPhone());
            customer.setAddress(registerRequest.getAddress());
            customer.setidentificationnumber(registerRequest.getIdentificationNumber());
            customer.setEmail(registerRequest.getEmail());

            customerRepository.save(customer);

            Account account = new Account();
            account.setUsername(registerRequest.getUsername());
            account.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
            account.setActive(true);
            account.setCustomerId(customer.getId());
            account.setRole(roleRepository.findById(2).orElse(null));

            accountRepository.save(account);

            return ResponseEntity.ok("User registered successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Registration failed");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> createAuthenticationToken(@RequestBody AuthenticationRequest authRequest) throws Exception {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword())
            );
        } catch (Exception e) {
            throw new Exception("Incorrect username or password", e);
        }

        final MyUserDetails userDetails = (MyUserDetails) userDetailsService.loadUserByUsername(authRequest.getUsername());
        final String jwt = jwtUtil.generateToken(userDetails.getUsername());

        LoginResponse loginResponse = new LoginResponse(jwt, userDetails.getRole());
        return ResponseEntity.ok(loginResponse);
    }
}

