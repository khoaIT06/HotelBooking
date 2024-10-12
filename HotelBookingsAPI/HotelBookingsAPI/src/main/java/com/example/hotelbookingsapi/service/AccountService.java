package com.example.hotelbookingsapi.service;

import com.example.hotelbookingsapi.model.Account;
import com.example.hotelbookingsapi.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import com.example.hotelbookingsapi.repository.CustomerRepository;
import com.example.hotelbookingsapi.model.Role;
import com.example.hotelbookingsapi.repository.RoleRepository;

import java.util.List;
import java.util.Optional;

@Service
public class AccountService {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<Account> getAllAccounts() {
        List<Account> accounts = accountRepository.findAll();
        System.out.println(accounts);
        return accounts;
    }

    public Optional<Account> getAccountById(Integer id) {
        return accountRepository.findById(id);
    }

    public Account createAccount(Account account) {
        account.setPassword(passwordEncoder.encode(account.getPassword()));
        account.setActive(true);
        return accountRepository.save(account);
    }

    public Optional<Account> updateAccount(Integer id, Account accountDetails) {
        return accountRepository.findById(id).map(existingAccount -> {
            existingAccount.setUsername(accountDetails.getUsername());
            if (accountDetails.getPassword() != null && !accountDetails.getPassword().isEmpty()
                &&!accountDetails.getPassword().equals(existingAccount.getPassword())) {
                existingAccount.setPassword(accountDetails.getPassword());
            }
            existingAccount.setActive(accountDetails.isActive());
            existingAccount.setCustomerId(accountDetails.getCustomerId());
            return accountRepository.save(existingAccount);
        });
    }

    public void deleteAccount(Integer id) {
        accountRepository.deleteById(id);
    }

    public Account findByUsername(String username) {
        return accountRepository.findByUsername(username);
    }

    public Account findByCustomerId(Integer customerid) {
        return accountRepository.findByCustomerId(customerid);
    }

    public ResponseEntity<String> deleteAccountsByCustomerId(int customerid) {
        if (!customerRepository.existsById(customerid)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Customer not found");
        }
        List<Account> accounts = accountRepository.findAllByCustomerId(customerid);

        if (accounts.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Tài khoản không tìm thấy");
        }

        for (Account account : accounts) {
            accountRepository.delete(account);
        }
        return ResponseEntity.ok("Xóa tài khoản thành công");
    }

    public String getRoleNameByAccountId(Integer accountId) {
        Account account = accountRepository.findById(accountId).orElse(null);
        if (account != null && account.getRole() != null) {
            return account.getRole().getName();
        }
        return null;
    }

    public void updateRole(int customerid, int roleid) {
        Account account = accountRepository.findByCustomerId(customerid);
        if (account != null) {
            Role newRole = roleRepository.findById(roleid)
                    .orElseThrow(() -> new RuntimeException("Vai trò không tồn tại."));
            account.setRole(newRole);
            accountRepository.save(account);
        } else {
            throw new RuntimeException("Không tìm thấy tài khoản với CustomerId: " + customerid);
        }
    }

    public void disableAccount(int accountid) {
        Account account = accountRepository.findById(accountid)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản với ID: " + accountid));
        account.setActive(false);
        accountRepository.save(account);
    }
}
