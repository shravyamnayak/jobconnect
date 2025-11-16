package com.jobconnect.repository;

import com.jobconnect.entity.EventReminder;
import com.jobconnect.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<EventReminder, Long> {
    List<EventReminder> findByUser(User user);
    List<EventReminder> findByUserAndCompleted(User user, Boolean completed);
    
    @Query("SELECT e FROM EventReminder e WHERE e.reminderSent = false AND " +
           "e.eventDate BETWEEN :now AND :reminderTime AND e.completed = false")
    List<EventReminder> findUpcomingReminders(
        @Param("now") LocalDateTime now,
        @Param("reminderTime") LocalDateTime reminderTime
    );
    
    @Query("SELECT e FROM EventReminder e WHERE e.user = :user AND " +
           "e.eventDate >= :now ORDER BY e.eventDate ASC")
    List<EventReminder> findUpcomingEventsByUser(
        @Param("user") User user,
        @Param("now") LocalDateTime now
    );
}