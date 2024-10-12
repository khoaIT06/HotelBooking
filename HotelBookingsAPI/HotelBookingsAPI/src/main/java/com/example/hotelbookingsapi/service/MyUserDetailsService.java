package com.example.hotelbookingsapi.service;

import com.example.hotelbookingsapi.model.Account;
import com.example.hotelbookingsapi.model.MyUserDetails;
import com.example.hotelbookingsapi.model.Role;
import com.example.hotelbookingsapi.repository.AccountRepository;
import com.example.hotelbookingsapi.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class MyUserDetailsService implements UserDetailsService {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Account account = accountRepository.findByUsername(username);
        if (account == null) {
            throw new UsernameNotFoundException("User not found");
        }

        Role role = account.getRole();
        List<SimpleGrantedAuthority> authorities = new ArrayList<>();
        if (role != null) {
            authorities.add(new SimpleGrantedAuthority(role.getName()));
        }

        return new MyUserDetails(account.getUsername(), account.getPassword(), authorities, account.isActive(), role.getName());
    }
}