package com.jobconnect.service;

import com.jobconnect.dto.EventDto;
import com.jobconnect.entity.EventReminder;
import com.jobconnect.entity.Job;
import com.jobconnect.entity.User;
import com.jobconnect.repository.EventRepository;
import com.jobconnect.repository.JobRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class EventServiceImpl implements EventService {
    
    private final EventRepository eventRepository;
    private final JobRepository jobRepository;
    private final UserService userService;
    private final ModelMapper modelMapper;
    
    @Override
    @Transactional
    public EventDto createEvent(EventDto eventDto) {
        User currentUser = userService.getCurrentUser();
        
        EventReminder event = new EventReminder();
        event.setTitle(eventDto.getTitle());
        event.setDescription(eventDto.getDescription());
        event.setEventType(eventDto.getEventType());
        event.setEventDate(eventDto.getEventDate());
        event.setLocation(eventDto.getLocation());
        event.setLink(eventDto.getLink());
        event.setUser(currentUser);
        
        if (eventDto.getJobId() != null) {
            Job job = jobRepository.findById(eventDto.getJobId())
                    .orElseThrow(() -> new RuntimeException("Job not found"));
            event.setJob(job);
        }
        
        EventReminder savedEvent = eventRepository.save(event);
        return convertToDto(savedEvent);
    }
    
    @Override
    @Transactional
    public EventDto updateEvent(Long id, EventDto eventDto) {
        EventReminder event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        
        User currentUser = userService.getCurrentUser();
        if (!event.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("You can only update your own events");
        }
        
        event.setTitle(eventDto.getTitle());
        event.setDescription(eventDto.getDescription());
        event.setEventType(eventDto.getEventType());
        event.setEventDate(eventDto.getEventDate());
        event.setLocation(eventDto.getLocation());
        event.setLink(eventDto.getLink());
        
        if (eventDto.getJobId() != null) {
            Job job = jobRepository.findById(eventDto.getJobId())
                    .orElseThrow(() -> new RuntimeException("Job not found"));
            event.setJob(job);
        }
        
        EventReminder updatedEvent = eventRepository.save(event);
        return convertToDto(updatedEvent);
    }
    
    @Override
    @Transactional
    public void deleteEvent(Long id) {
        EventReminder event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        
        User currentUser = userService.getCurrentUser();
        if (!event.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("You can only delete your own events");
        }
        
        eventRepository.deleteById(id);
    }
    
    @Override
    public EventDto getEventById(Long id) {
        EventReminder event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        return convertToDto(event);
    }
    
    @Override
    public List<EventDto> getEventsByUser() {
        User currentUser = userService.getCurrentUser();
        return eventRepository.findByUser(currentUser).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<EventDto> getUpcomingEvents() {
        User currentUser = userService.getCurrentUser();
        LocalDateTime now = LocalDateTime.now();
        return eventRepository.findUpcomingEventsByUser(currentUser, now).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional
    public EventDto markEventAsCompleted(Long id) {
        EventReminder event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        
        User currentUser = userService.getCurrentUser();
        if (!event.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("You can only update your own events");
        }
        
        event.setCompleted(true);
        EventReminder updatedEvent = eventRepository.save(event);
        return convertToDto(updatedEvent);
    }
    
    @Override
    @Scheduled(fixedRate = 3600000) // Run every hour
    @Transactional
    public void sendReminders() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime reminderTime = now.plusHours(24); // Send reminders 24 hours before event
        
        List<EventReminder> upcomingEvents = eventRepository.findUpcomingReminders(now, reminderTime);
        
        for (EventReminder event : upcomingEvents) {
            try {
                // Here you would integrate with an email service or notification system
                log.info("Sending reminder for event: {} to user: {}", 
                        event.getTitle(), event.getUser().getEmail());
                
                event.setReminderSent(true);
                eventRepository.save(event);
            } catch (Exception e) {
                log.error("Failed to send reminder for event: {}", event.getId(), e);
            }
        }
    }
    
    private EventDto convertToDto(EventReminder event) {
        EventDto dto = modelMapper.map(event, EventDto.class);
        dto.setUserId(event.getUser().getId());
        if (event.getJob() != null) {
            dto.setJobId(event.getJob().getId());
            dto.setJobTitle(event.getJob().getTitle());
        }
        return dto;
    }
}