package com.rippleofchange.api.controller;

import com.rippleofchange.api.model.User;
import com.rippleofchange.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/leaderboard")
public class LeaderboardController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<User>> getTopUsers() {
        // 1. Get all users
        // 2. Sort by "points" in DESCENDING order (Highest first)
        List<User> topUsers = userRepository.findAll(Sort.by(Sort.Direction.DESC, "points"));

        // 3. Limit the list to the top 10 people
        if (topUsers.size() > 10) {
            topUsers = topUsers.subList(0, 10);
        }

        return ResponseEntity.ok(topUsers);
    }
}