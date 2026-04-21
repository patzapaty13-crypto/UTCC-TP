package org.example.utcctp.api;

import org.example.utcctp.auth.UserProfile;
import org.example.utcctp.chat.ChatMessageDto;
import org.example.utcctp.chat.ChatService;
import org.example.utcctp.chat.SendMessageRequest;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/chat")
public class ChatController {
    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping("/send")
    public ChatMessageDto sendMessage(Principal principal, @RequestBody SendMessageRequest request) {
        return chatService.sendMessage(principal.getName(), request);
    }

    @GetMapping("/messages/{otherUsername}")
    public List<ChatMessageDto> getConversation(Principal principal, @PathVariable String otherUsername) {
        return chatService.getConversation(principal.getName(), otherUsername);
    }

    @GetMapping("/contacts")
    public List<UserProfile> getContacts(Principal principal) {
        return chatService.getContacts(principal.getName());
    }
}
