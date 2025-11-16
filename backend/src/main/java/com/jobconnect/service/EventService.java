package com.jobconnect.service;

import com.jobconnect.dto.EventDto;
import java.util.List;

public interface EventService {
    EventDto createEvent(EventDto eventDto);
    EventDto updateEvent(Long id, EventDto eventDto);
    void deleteEvent(Long id);
    EventDto getEventById(Long id);
    List<EventDto> getEventsByUser();
    List<EventDto> getUpcomingEvents();
    EventDto markEventAsCompleted(Long id);
    void sendReminders();
}