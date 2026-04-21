package org.example.utcctp.chat;

public record SendMessageRequest(
    String receiverUsername,
    String content
) {}
