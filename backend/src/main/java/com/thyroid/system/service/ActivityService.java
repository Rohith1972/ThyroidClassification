package com.thyroid.system.service;

import com.thyroid.system.dto.ActivityDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@Slf4j
public class ActivityService {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public void broadcastActivity(String type, String message, String actor) {
        ActivityDTO activity = ActivityDTO.builder()
                .type(type)
                .message(message)
                .actor(actor)
                .timestamp(LocalDateTime.now())
                .build();

        log.info("Broadcasting activity: {}", message);
        messagingTemplate.convertAndSend("/topic/activities", activity);
    }
}
