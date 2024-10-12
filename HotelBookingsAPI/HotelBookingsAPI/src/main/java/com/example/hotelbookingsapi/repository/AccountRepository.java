package com.example.hotelbookingsapi.repository;

import com.example.hotelbookingsapi.model.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AccountRepository extends JpaRepository<Account, Integer> {
    Account findByUsername(String username);
    Account findByCustomerId(Integer customerid);
    List<Account> findAllByCustomerId(int customerid);
}
