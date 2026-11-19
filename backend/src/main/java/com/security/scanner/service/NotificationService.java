package com.security.scanner.service;

import com.security.scanner.dto.response.NotificationDto;
import com.security.scanner.entity.Notification;
import com.security.scanner.entity.User;
import com.security.scanner.exception.ResourceNotFoundException;
import com.security.scanner.repository.NotificationRepository;
import com.security.scanner.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationService(NotificationRepository notificationRepository, UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public Page<NotificationDto> getUserNotifications(Pageable pageable) {
        Page<Notification> page = notificationRepository.findAllByOrderByCreatedAtDesc(pageable);
        List<NotificationDto> dtoList = page.stream().map(this::mapToDto).toList();
        return new PageImpl<>(dtoList, pageable, page.getTotalElements());
    }

    @Transactional(readOnly = true)
    public long getUnreadCount() {
        return notificationRepository.countByIsReadFalse();
    }

    @Transactional
    public void markAsRead(Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found: " + id));
        notification.setRead(true);
        notificationRepository.save(notification);
    }

    @Transactional
    public void markAllAsRead() {
        List<Notification> unread = notificationRepository.findAll();
        for (Notification n : unread) {
            n.setRead(true);
        }
        notificationRepository.saveAll(unread);
    }

    public NotificationDto mapToDto(Notification n) {
        NotificationDto dto = new NotificationDto();
        dto.setId(n.getId());
        dto.setScanId(n.getScanId());
        dto.setTitle(n.getTitle());
        dto.setMessage(n.getMessage());
        dto.setType(n.getType());
        dto.setRead(n.isRead());
        dto.setCreatedAt(n.getCreatedAt());
        return dto;
    }

    private User getCurrentUser() {
        try {
            var auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getName())) {
                var found = userRepository.findByUsername(auth.getName());
                if (found.isPresent()) return found.get();
            }
        } catch (Exception ignored) {}

        return userRepository.findByUsername("analyst")
                .or(() -> userRepository.findAll().stream().findFirst())
                .orElseGet(() -> userRepository.save(new User("analyst", "analyst@cybershield.local", "password123", Role.ROLE_USER)));
    }
}
