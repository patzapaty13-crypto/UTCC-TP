package org.example.utcctp.chat;

import org.example.utcctp.model.ChatMessage;
import org.example.utcctp.model.User;
import org.example.utcctp.repository.ChatMessageRepository;
import org.example.utcctp.repository.UserRepository;
import org.example.utcctp.auth.UserProfile;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChatService {
    private final ChatMessageRepository chatMessageRepository;
    private final UserRepository userRepository;

    public ChatService(ChatMessageRepository chatMessageRepository, UserRepository userRepository) {
        this.chatMessageRepository = chatMessageRepository;
        this.userRepository = userRepository;
    }

    public ChatMessageDto sendMessage(String senderUsername, SendMessageRequest request) {
        User sender = userRepository.findByUsername(senderUsername)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Sender not found"));
        User receiver = userRepository.findByUsername(request.receiverUsername())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Receiver not found"));

        ChatMessage message = new ChatMessage(sender, receiver, request.content());

        ChatMessage saved = chatMessageRepository.save(message);
        return mapToDto(saved);
    }

    public List<ChatMessageDto> getConversation(String username, String otherUsername) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        User other = userRepository.findByUsername(otherUsername)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Other user not found"));

        List<ChatMessage> conversation = chatMessageRepository.findConversation(user, other);
        
        // Mark as read
        conversation.stream()
                .filter(m -> m.getReceiver().getUsername().equals(username) && !m.isRead())
                .forEach(m -> {
                    m.setRead(true);
                    chatMessageRepository.save(m);
                });

        return conversation.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public List<UserProfile> getContacts(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        
        return chatMessageRepository.findContactedUsers(user).stream()
                .map(UserProfile::from)
                .collect(Collectors.toList());
    }

    private ChatMessageDto mapToDto(ChatMessage m) {
        return new ChatMessageDto(
            m.getId(),
            m.getSender().getUsername(),
            m.getSender().getDisplayName(),
            m.getReceiver().getUsername(),
            m.getContent(),
            m.getSentAt(),
            m.isRead()
        );
    }
}
