"use client";

import { useEffect, useState, useRef } from "react";
import { api } from "@/lib/api";
import { useSearchParams } from "next/navigation";

export default function MessagesPage() {
  const searchParams = useSearchParams();
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const scrollRef = useRef(null);

  useEffect(() => {
    const init = async () => {
      const user = await api.getMe();
      setCurrentUser(user);
      loadContacts();

      // Check if user parameter exists in URL
      const userParam = searchParams.get("user");
      if (userParam) {
        // Find the user in contacts or search results
        const foundContact = contacts.find(c => c.username === userParam) ||
                             searchResults.find(u => u.username === userParam);
        if (foundContact) {
          selectContact(foundContact);
        } else {
          // If not found in contacts, try to get all users and find them
          api.getUsers().then(users => {
            const foundUser = users.find(u => u.username === userParam);
            if (foundUser) {
              selectContact(foundUser);
            }
          });
        }
      }
    };

    init();

    const interval = setInterval(() => {
      if (selectedContact) {
        refreshMessages(selectedContact.username);
      }
      loadContacts();
    }, 5000); // Poll every 5s

    return () => clearInterval(interval);
  }, [selectedContact]);

  useEffect(() => {
    if (currentUser) {
      loadContacts();
    }
  }, [currentUser]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const loadContacts = async () => {
    try {
      // Load all users and filter by role
      let users = [];
      try {
        users = await api.getUsers();
      } catch (err) {
        console.warn("Cannot load all users, using chat contacts only");
      }

      const currentUsername = currentUser?.username;

      // Filter out current user from advisors and students
      const advisors = users.filter(u => u.roles?.includes("ADVISOR") && u.username !== currentUsername);
      const students = users.filter(u => u.roles?.includes("STUDENT") && u.username !== currentUsername);

      // Combine with existing chat contacts (also filter out current user)
      const chatContacts = await api.getChatContacts().catch(() => []);
      const filteredChatContacts = chatContacts.filter(c => c.username !== currentUsername);

      // Create a combined list with role indicators
      const allContacts = [
        ...advisors.map(u => ({ ...u, role: "ADVISOR", isSystemContact: true })),
        ...students.map(u => ({ ...u, role: "STUDENT", isSystemContact: true })),
        ...filteredChatContacts.map(c => ({ ...c, isChatContact: true }))
      ];

      // Remove duplicates (prefer chat contacts)
      const uniqueContacts = [];
      const seenUsernames = new Set();
      for (const contact of allContacts) {
        if (!seenUsernames.has(contact.username)) {
          seenUsernames.add(contact.username);
          uniqueContacts.push(contact);
        }
      }

      setContacts(uniqueContacts);
    } catch (err) {
      console.error("Failed to load contacts", err);
    } finally {
      setLoading(false);
    }
  };

  const selectContact = async (contact) => {
    setSelectedContact(contact);
    setMessages([]);
    setIsSearching(false);
    setSearchQuery("");
    refreshMessages(contact.username);
  };

  const refreshMessages = async (username) => {
    try {
      const data = await api.getChatConversation(username);
      setMessages(data);
    } catch (err) {
      console.error("Failed to load messages", err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedContact) return;

    const content = newMessage;
    setNewMessage("");

    try {
      const sent = await api.sendChatMessage({
        receiverUsername: selectedContact.username,
        content: content
      });
      setMessages([...messages, sent]);
      loadContacts();
    } catch (err) {
      alert("Failed to send message");
    }
  };

  const handleSearch = async (e) => {
    const q = e.target.value;
    setSearchQuery(q);
    if (q.length > 2) {
      setIsSearching(true);
      try {
        // Try to get users - this will fail for non-admin users
        const users = await api.getUsers();
        setSearchResults(users.filter(u =>
          (u.username.toLowerCase().includes(q.toLowerCase()) ||
           (u.displayName && u.displayName.toLowerCase().includes(q.toLowerCase()))) &&
          u.username !== currentUser?.username
        ));
      } catch (err) {
        // If admin endpoint fails, show empty results or suggest manual search
        setSearchResults([]);
      }
    } else {
      setIsSearching(false);
    }
  };

  const theme = {
    primary: "#2563EB",
    bg: "#F8FAFC",
    border: "#E2E8F0",
    textDeep: "#0F172A",
    textSoft: "#64748B"
  };

  return (
    <div style={{ height: "calc(100vh - 120px)", display: "flex", background: "white", borderRadius: "24px", overflow: "hidden", border: `1px solid ${theme.border}`, boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
      {/* ── Sidebar ── */}
      <div style={{ width: 350, borderRight: `1px solid ${theme.border}`, display: "flex", flexDirection: "column", background: "#FDFDFD" }}>
        <div style={{ padding: "24px", borderBottom: `1px solid ${theme.border}` }}>
          <h2 style={{ fontSize: 20, fontWeight: 900, color: theme.textDeep, marginBottom: 16 }}>ข้อความ</h2>
          <div style={{ position: "relative" }}>
            <i className="fas fa-search" style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: theme.textSoft, fontSize: 14 }}></i>
            <input 
              type="text" 
              placeholder="ค้นหาผู้ใช้งาน..." 
              value={searchQuery}
              onChange={handleSearch}
              style={{ width: "100%", padding: "12px 16px 12px 44px", background: "#F1F5F9", border: "none", borderRadius: "14px", fontSize: 14, outline: "none" }} 
            />
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto" }}>
          {isSearching ? (
            <div style={{ padding: 10 }}>
              <p style={{ fontSize: 12, fontWeight: 800, color: theme.textSoft, padding: "10px 14px", textTransform: "uppercase" }}>ผลการค้นหา</p>
              {searchResults.length === 0 ? (
                <p style={{ textAlign: "center", padding: 20, color: theme.textSoft, fontSize: 14 }}>ไม่พบผู้ใช้งาน</p>
              ) : (
                searchResults.map(u => (
                  <div key={u.username} onClick={() => selectContact(u)} style={{ padding: "12px 24px", cursor: "pointer", display: "flex", alignItems: "center", gap: 12, transition: "0.2s" }}>
                    <div style={{ width: 44, height: 44, borderRadius: "14px", background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: theme.primary }}>{u.username[0].toUpperCase()}</div>
                    <div>
                      <div style={{ fontWeight: 700, color: theme.textDeep }}>{u.displayName || u.username}</div>
                      <div style={{ fontSize: 12, color: theme.textSoft }}>@{u.username}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <>
              {contacts.length === 0 ? (
                <div style={{ padding: 40, textAlign: "center" }}>
                  <i className="fas fa-comments" style={{ fontSize: 40, color: "#E2E8F0", marginBottom: 16 }}></i>
                  <p style={{ color: theme.textSoft, fontSize: 14 }}>ยังไม่มีบทสนทนา<br/>ลองค้นหาผู้ใช้งานเพื่อเริ่มคุย</p>
                </div>
              ) : (
                contacts.map(c => (
                  <div
                    key={c.username}
                    onClick={() => selectContact(c)}
                    style={{
                      padding: "16px 24px", cursor: "pointer", display: "flex", alignItems: "center", gap: 14,
                      background: selectedContact?.username === c.username ? "#F1F5F9" : "transparent",
                      borderLeft: selectedContact?.username === c.username ? `4px solid ${theme.primary}` : "4px solid transparent",
                      transition: "0.2s"
                    }}
                  >
                    <div style={{ width: 50, height: 50, borderRadius: "18px", background: c.role === "ADVISOR" ? "#F5F3FF" : "#EFF6FF", border: `2px solid ${selectedContact?.username === c.username ? "white" : "transparent"}`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: c.role === "ADVISOR" ? "#7C3AED" : theme.primary, fontSize: 18 }}>
                      {c.displayName?.[0] || c.username[0].toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 2 }}>
                        <span style={{ fontWeight: 800, color: theme.textDeep, fontSize: 15, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.displayName || c.username}</span>
                        {c.role && (
                          <span style={{
                            padding: "2px 8px",
                            borderRadius: "6px",
                            fontSize: 10,
                            fontWeight: 700,
                            background: c.role === "ADVISOR" ? "#F5F3FF" : "#EFF6FF",
                            color: c.role === "ADVISOR" ? "#7C3AED" : theme.primary,
                            textTransform: "uppercase"
                          }}>
                            {c.role === "ADVISOR" ? "อาจารย์" : "นักศึกษา"}
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: 13, color: theme.textSoft, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        คลิกเพื่อเริ่มสนทนา
                      </div>
                    </div>
                  </div>
                ))
              )}
            </>
          )}
        </div>
      </div>

      {/* ── Chat Area ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#FFFFFF" }}>
        {selectedContact ? (
          <>
            {/* Header */}
            <div style={{ padding: "16px 32px", borderBottom: `1px solid ${theme.border}`, display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: "14px", background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: theme.primary }}>
                {selectedContact.displayName?.[0] || selectedContact.username[0].toUpperCase()}
              </div>
              <div>
                <div style={{ fontWeight: 900, color: theme.textDeep, fontSize: 16 }}>{selectedContact.displayName || selectedContact.username}</div>
                <div style={{ fontSize: 12, color: "#10B981", fontWeight: 700 }}>Online</div>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "32px", display: "flex", flexDirection: "column", gap: 16, background: "#F8FAFC" }}>
              {messages.map((m, i) => {
                const isMine = m.senderUsername === currentUser?.username;
                return (
                  <div key={m.id || i} style={{ alignSelf: isMine ? "flex-end" : "flex-start", maxWidth: "70%" }}>
                    <div style={{ 
                      padding: "12px 20px", 
                      borderRadius: isMine ? "20px 20px 4px 20px" : "20px 20px 20px 4px",
                      background: isMine ? theme.primary : "white",
                      color: isMine ? "white" : theme.textDeep,
                      boxShadow: isMine ? "0 4px 12px rgba(37, 99, 235, 0.2)" : "0 2px 8px rgba(0,0,0,0.03)",
                      fontSize: 15,
                      fontWeight: 500,
                      lineHeight: 1.5
                    }}>
                      {m.content}
                    </div>
                    <div style={{ fontSize: 11, color: theme.textSoft, marginTop: 4, textAlign: isMine ? "right" : "left", fontWeight: 600 }}>
                      {new Date(m.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input */}
            <div style={{ padding: "24px 32px", background: "white", borderTop: `1px solid ${theme.border}` }}>
              <form onSubmit={handleSendMessage} style={{ display: "flex", gap: 12 }}>
                <input 
                  type="text" 
                  placeholder="พิมพ์ข้อความที่นี่..." 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  style={{ flex: 1, padding: "14px 20px", background: "#F1F5F9", border: "none", borderRadius: "16px", fontSize: 15, outline: "none" }}
                />
                <button type="submit" style={{ width: 50, height: 50, borderRadius: "16px", background: theme.primary, color: "white", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "0.2s" }}>
                  <i className="fas fa-paper-plane"></i>
                </button>
              </form>
            </div>
          </>
        ) : (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: theme.textSoft, gap: 20 }}>
            <div style={{ width: 80, height: 80, borderRadius: "30px", background: "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, color: "#CBD5E1" }}>
              <i className="fas fa-comments"></i>
            </div>
            <div style={{ textAlign: "center" }}>
              <h3 style={{ fontSize: 18, fontWeight: 900, color: theme.textDeep, marginBottom: 8 }}>ยินดีต้อนรับสู่ระบบแชท</h3>
              <p style={{ maxWidth: 300, lineHeight: 1.6 }}>เลือกผู้ใช้งานจากทางด้านซ้ายเพื่อเริ่มการสนทนา หรือค้นหาเพื่อนร่วมโครงการ</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
