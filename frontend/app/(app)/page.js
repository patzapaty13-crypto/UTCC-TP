"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";

export default function LinkedInDashboard() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState("");
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    Promise.all([api.getMe(), api.listPosts()])
      .then(([u, p]) => {
        setUser(u);
        setPosts(p);
      })
      .finally(() => setLoading(false));
  }, []);

  const handlePost = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;
    setPosting(true);
    try {
      const p = await api.createPost({ content: newPost });
      setPosts([p, ...posts]);
      setNewPost("");
    } catch (e) {
      alert(e.message);
    } finally {
      setPosting(false);
    }
  };

  if (loading) return <div className="p-20 text-center text-muted">กำลังเตรียมข้อมูลฟีดของคุณ...</div>;

  return (
    <div style={{ 
      display: "grid", 
      gridTemplateColumns: "240px 1fr 300px", 
      gap: 24, 
      alignItems: "start",
      maxWidth: 1200,
      margin: "0 auto"
    }}>
      
      {/* Left Column: Mini Profile */}
      <aside style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ height: 60, background: "linear-gradient(to right, #0A66C2, #3B82F6)" }}></div>
          <div style={{ padding: "0 16px 20px", marginTop: -30, textAlign: "center" }}>
            <div style={{ 
              width: 72, height: 72, borderRadius: "50%", border: "4px solid white", 
              margin: "0 auto", background: "var(--n-100)", display: "flex", 
              alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 900,
              color: "var(--n-900)"
            }}>
              {user.displayName.charAt(0)}
            </div>
            <h3 style={{ marginTop: 12, fontSize: 16, fontWeight: 800 }}>{user.displayName}</h3>
            <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>{user.major || "UTCC Student"}</p>
          </div>
          <div style={{ borderTop: "1px solid var(--n-100)", padding: "12px 16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
              <span style={{ color: "var(--text-muted)", fontWeight: 600 }}>Profile viewers</span>
              <span style={{ color: "#0A66C2", fontWeight: 700 }}>42</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginTop: 8 }}>
              <span style={{ color: "var(--text-muted)", fontWeight: 600 }}>Post impressions</span>
              <span style={{ color: "#0A66C2", fontWeight: 700 }}>128</span>
            </div>
          </div>
          <Link href="/profile/resume" className="btn btn-ghost btn-sm" style={{ width: "100%", borderRadius: 0, borderTop: "1px solid var(--n-100)", justifyContent: "flex-start", padding: "12px 16px", fontSize: 12 }}>
             <i className="fas fa-bookmark mr-2"></i> My Resume
          </Link>
        </div>

        <div className="card" style={{ padding: 12 }}>
           <p style={{ fontSize: 12, fontWeight: 800, marginBottom: 12 }}>Recent</p>
           {["#Engineering", "#Internship2024", "#UTCC", "#WebDev"].map(tag => (
             <div key={tag} style={{ padding: "6px 0", fontSize: 13, color: "var(--text-muted)", cursor: "pointer" }}>
               <span style={{ marginRight: 8 }}>#</span> {tag.slice(1)}
             </div>
           ))}
        </div>
      </aside>

      {/* Center Column: Feed */}
      <main style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        
        {/* Create Post */}
        <div className="card" style={{ padding: 16 }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "var(--n-100)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800 }}>
              {user.displayName.charAt(0)}
            </div>
            <button 
              onClick={() => document.getElementById('post-input').focus()}
              style={{ flex: 1, background: "var(--n-50)", border: "1px solid var(--n-200)", borderRadius: 30, padding: "0 20px", height: 48, textAlign: "left", color: "var(--text-muted)", fontSize: 14, fontWeight: 600, cursor: "pointer" }}
            >
              Start a post
            </button>
          </div>
          <div style={{ display: "flex", justifyContent: "space-around", marginTop: 12 }}>
             <button className="btn btn-ghost btn-sm" style={{ color: "#378FE9" }}><i className="fas fa-image mr-2"></i> Media</button>
             <button className="btn btn-ghost btn-sm" style={{ color: "#5F9B41" }}><i className="fas fa-calendar-alt mr-2"></i> Event</button>
             <button className="btn btn-ghost btn-sm" style={{ color: "#E7A33E" }}><i className="fas fa-newspaper mr-2"></i> Article</button>
          </div>
          
          <form onSubmit={handlePost} style={{ marginTop: 16 }}>
             <textarea 
               id="post-input"
               className="field-input" 
               style={{ minHeight: 80, padding: 12 }}
               placeholder="คุณกำลังคิดอะไรอยู่...?"
               value={newPost}
               onChange={e => setNewPost(e.target.value)}
             />
             <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
                <button type="submit" className="btn btn-primary" disabled={posting || !newPost.trim()}>
                   Post
                </button>
             </div>
          </form>
        </div>

        {/* Posts List */}
        {posts.map(post => (
          <div key={post.id} className="card animate-fade-in" style={{ padding: 0 }}>
             <div style={{ padding: "16px 16px 0", display: "flex", gap: 12, alignItems: "start" }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "var(--n-900)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 18 }}>
                  {post.authorName.charAt(0)}
                </div>
                <div style={{ flex: 1 }}>
                   <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <h4 style={{ fontSize: 14, fontWeight: 800 }}>{post.authorName}</h4>
                      <span style={{ fontSize: 12, color: "var(--text-muted)" }}>• 1st</span>
                   </div>
                   <p style={{ fontSize: 12, color: "var(--text-muted)" }}>{post.authorMajor || "Student"} • {new Date(post.createdAt).toLocaleDateString()}</p>
                </div>
             </div>
             
             <div style={{ padding: "16px", fontSize: 14, lineHeight: 1.6, color: "var(--text-primary)" }}>
                {post.content}
             </div>

             {post.imageUrl && (
               <img src={post.imageUrl} alt="post" style={{ width: "100%", maxHeight: 400, objectFit: "cover" }} />
             )}

             <div style={{ padding: "4px 16px", borderTop: "1px solid var(--n-50)", display: "flex", gap: 8 }}>
                <button className="btn btn-ghost btn-sm" style={{ color: "var(--text-muted)", flex: 1 }}><i className="far fa-thumbs-up mr-2"></i> Like</button>
                <button className="btn btn-ghost btn-sm" style={{ color: "var(--text-muted)", flex: 1 }}><i className="far fa-comment mr-2"></i> Comment</button>
                <button className="btn btn-ghost btn-sm" style={{ color: "var(--text-muted)", flex: 1 }}><i className="fas fa-share mr-2"></i> Share</button>
             </div>
          </div>
        ))}

        {!loading && posts.length === 0 && (
          <div className="empty-state">
            <i className="fas fa-rss mb-4" style={{ fontSize: 40, opacity: 0.2 }}></i>
            <p>ยังไม่มีความเคลื่อนไหวในฟีดของคุณ เริ่มต้นสร้างโพสต์แรกเลย!</p>
          </div>
        )}
      </main>

      {/* Right Column: Suggestions */}
      <aside style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div className="card">
          <p style={{ fontWeight: 800, fontSize: 14, marginBottom: 16 }}>Add to your feed</p>
          {[
            { n: "UTCC Career Center", m: "Company • Higher Education" },
            { n: "Dr. Suda N.", m: "Advisor • Business School" },
            { n: "Tech Internships TH", m: "Community • Tech" }
          ].map(item => (
            <div key={item.n} style={{ display: "flex", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: "var(--n-100)", flexShrink: 0 }}></div>
              <div style={{ minWidth: 0 }}>
                <p style={{ fontSize: 13, fontWeight: 700, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.n}</p>
                <p style={{ fontSize: 11, color: "var(--text-muted)", margin: "2px 0 8px" }}>{item.m}</p>
                <button className="btn btn-secondary btn-sm" style={{ borderRadius: 20, padding: "2px 14px" }}>+ Follow</button>
              </div>
            </div>
          ))}
        </div>

        <div style={{ padding: "0 12px", fontSize: 11, color: "var(--text-muted)", textAlign: "center", lineHeight: 2 }}>
           About • Accessibility • Help Center • Privacy & Terms • Ad Choices • Advertising • Business Services • Get the LinkedIn app • More
           <div style={{ marginTop: 8, fontWeight: 900, color: "var(--primary)" }}>UTCC-TP © 2024</div>
        </div>
      </aside>
    </div>
  );
}
