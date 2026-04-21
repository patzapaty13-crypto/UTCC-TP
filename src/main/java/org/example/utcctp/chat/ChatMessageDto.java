package org.example.utcctp.chat;

import java.time.LocalDateTime;

public record ChatMessageDto(
    Long id,
    String senderUsername,
    String senderDisplayName,
    String receiverUsername,
    String content,
    LocalDateTime sentAt,
    boolean isRead
) {}
