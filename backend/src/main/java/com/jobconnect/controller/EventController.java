package com.jobconnect.controller;

import com.jobconnect.dto.EventDto;
import com.jobconnect.service.EventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class EventController {
    
    private final EventService eventService;
    
    @PostMapping
    public ResponseEntity<?> createEvent(@Valid @RequestBody EventDto eventDto) {
        try {
            EventDto createdEvent = eventService.createEvent(eventDto);
            return ResponseEntity.ok(createdEvent);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateEvent(@PathVariable Long id, @Valid @RequestBody EventDto eventDto) {
        try {
            EventDto updatedEvent = eventService.updateEvent(id, eventDto);
            return ResponseEntity.ok(updatedEvent);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEvent(@PathVariable Long id) {
        try {
            eventService.deleteEvent(id);
            return ResponseEntity.ok("Event deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getEventById(@PathVariable Long id) {
        try {
            EventDto event = eventService.getEventById(id);
            return ResponseEntity.ok(event);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @GetMapping("/my-events")
    public ResponseEntity<List<EventDto>> getMyEvents() {
        return ResponseEntity.ok(eventService.getEventsByUser());
    }
    
    @GetMapping("/upcoming")
    public ResponseEntity<List<EventDto>> getUpcomingEvents() {
        return ResponseEntity.ok(eventService.getUpcomingEvents());
    }
    
    @PutMapping("/{id}/complete")
    public ResponseEntity<?> markEventAsCompleted(@PathVariable Long id) {
        try {
            EventDto completedEvent = eventService.markEventAsCompleted(id);
            return ResponseEntity.ok(completedEvent);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}