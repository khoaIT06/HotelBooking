package com.example.hotelbookingsapi.controller;

import com.example.hotelbookingsapi.model.Customer;
import com.example.hotelbookingsapi.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/customers")
//@PreAuthorize("hasRole('Admin') or hasRole('Customer')")
@CrossOrigin(origins = {"http://localhost:3000"})
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    @GetMapping("/getAll")
    //@PreAuthorize("hasAnyAuthority('Customer')")
    public List<Customer> getAllCustomers() {
        return customerService.findAll();
    }

    @GetMapping("/getById/{id}")
    public ResponseEntity<Customer> getCustomerById(@PathVariable Integer id) {
        Optional<Customer> customer = customerService.findById(id);
        return customer.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/create")
    public Customer createCustomer(@RequestBody Customer customer) {
        return customerService.save(customer);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Customer> updateCustomer(@PathVariable Integer id, @RequestBody Customer customer) {
        if (customerService.findById(id).isPresent()) {
            customer.setId(id);
            return ResponseEntity.ok(customerService.save(customer));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable Integer id) {
        if (customerService.findById(id).isPresent()) {
            customerService.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
