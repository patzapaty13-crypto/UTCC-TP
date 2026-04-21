import { MOCK_INTERNSHIPS, MOCK_APPLICATIONS, delay, updateMockApplicationStatus, createMockApplication } from "./mockData";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
console.log(`[API Config] Base URL set to: ${API_BASE}`);
const USE_MOCK_API = false; // Feature flag for ATS mock

export async function apiFetch(path, options = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("utcctp_token") : null;
  
  const isFormData = options.body instanceof FormData;
  
  const headers = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const url = `${API_BASE}${path}`;
  console.log(`[API] Fetching: ${url}`);
  
  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Handle 401 — token expired or invalid
  if (response.status === 401) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("utcctp_token");
      window.location.href = "/login";
    }
    throw new Error("Session expired. Please log in again.");
  }

  if (response.status === 503) {
    const errorData = await response.json().catch(() => ({}));
    if (errorData.code === "MAINTENANCE") {
       if (typeof window !== "undefined") {
         window.dispatchEvent(new CustomEvent('maintenance_mode'));
       }
       throw new Error("MAINTENANCE_ACTIVE");
    }
  }

  if (!response.ok) {
    let message = "Request failed";
    try {
      const errorData = await response.json();
      message = errorData?.message || errorData?.error || message;
    } catch {
      message = await response.text() || message;
    }
    throw new Error(message);
  }

  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return response.json();
  }
  
  return null;
}

export const api = {
  // Auth (Always Real API if backend is running, otherwise use mocks below later if needed)
  login: async (credentials) => {
    if (USE_MOCK_API) {
      await delay(800);
      if (credentials.password === "pass123") {
        return { token: "mock-jwt-token", username: credentials.username };
      }
      throw new Error("Invalid credentials");
    }
    return apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },
  getMe: async () => {
    if (USE_MOCK_API) {
      await delay(300);
      return { 
        id: 2, 
        username: "student1", 
        displayName: "Demo Student", 
        roles: ["STUDENT"], 
        major: "Information Technology",
        academicYear: 3 
      };
    }
    return apiFetch("/auth/me");
  },
  updateProfile: (data) => apiFetch("/auth/me", {
    method: "PUT",
    body: JSON.stringify(data),
  }),
  logout: async () => {
    if (USE_MOCK_API) return await delay(200);
    return apiFetch("/auth/logout", { method: "POST" });
  },

  // Dashboard Target Metrics
  getDashboard: async () => {
    if (USE_MOCK_API) {
      await delay(400);
      return { totalApplications: MOCK_APPLICATIONS.length, pendingInterviews: MOCK_APPLICATIONS.filter(a => a.status === "INTERVIEW_SCHEDULED").length, activeJobs: MOCK_INTERNSHIPS.length };
    }
    return apiFetch("/dashboard/summary");
  },

  // -------------------------------------------------------------
  // DEPRECATED: TRIPS
  // -------------------------------------------------------------
  getTrips: () => apiFetch("/trips"),
  getTrip: (id) => apiFetch(`/trips/${id}`),
  createTrip: (data) => apiFetch("/trips", { method: "POST", body: JSON.stringify(data) }),
  updateTrip: (id, data) => apiFetch(`/trips/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  publishTrip: (id) => apiFetch(`/trips/${id}/publish`, { method: "POST" }),
  addTripSchedule: (id, data) => apiFetch(`/trips/${id}/schedule`, { method: "POST", body: JSON.stringify(data) }),

  // -------------------------------------------------------------
  // ATS: INTERNSHIPS & JOB POSTINGS
  // -------------------------------------------------------------
  getInternships: async () => {
    if (USE_MOCK_API) { await delay(); return MOCK_INTERNSHIPS; }
    return apiFetch("/internships");
  },
  getInternship: (id) => apiFetch(`/internships/${id}`),
  createInternship: (data) => apiFetch("/internships", { method: "POST", body: JSON.stringify(data) }),
  updateInternship: (id, data) => apiFetch(`/internships/${id}`, { method: "PUT", body: JSON.stringify(data) }),

  // -------------------------------------------------------------
  // Companies
  // -------------------------------------------------------------
  getCompanies: () => apiFetch("/companies"),
  getCompany: (id) => apiFetch(`/companies/${id}`),
  createCompany: (data) => apiFetch("/companies", { method: "POST", body: JSON.stringify(data) }),
  updateCompany: (id, data) => apiFetch(`/companies/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteCompany: (id) => apiFetch(`/companies/${id}`, { method: "DELETE" }),

  // -------------------------------------------------------------
  // ATS: APPLICATIONS (FUNNEL & TRACKING)
  // -------------------------------------------------------------
  getApplications: async () => {
    if (USE_MOCK_API) { await delay(); return [...MOCK_APPLICATIONS]; }
    return apiFetch("/applications");
  },
  applyForInternship: async (data) => {
    if (USE_MOCK_API) return createMockApplication(data.internshipId, data);
    const payload = {
      type: "INTERNSHIP",
      internshipPositionId: data.internshipId,
      // Phase 1 Enhancement Fields
      phone: data.phone,
      email: data.email,
      address: data.address,
      gpa: data.gpa,
      major: data.major,
      year: data.year,
      coverLetter: data.coverLetter,
      portfolioUrl: data.portfolioUrl,
    };
    return apiFetch("/applications", { method: "POST", body: JSON.stringify(payload) });
  },
  updateApplicationStatus: async (id, payload) => {
    // payload: { status: "INTERVIEW_SCHEDULED", interviewScheduledAt: "ISO_STR" }
    if (USE_MOCK_API) return updateMockApplicationStatus(id, payload.status, payload.interviewScheduledAt);
    return apiFetch(`/applications/${id}/status`, { method: "PUT", body: JSON.stringify(payload) });
  },

  // -------------------------------------------------------------
  // Reports
  // -------------------------------------------------------------
  getReports: () => apiFetch("/reports"),
  submitReport: (data) => apiFetch("/reports", { method: "POST", body: JSON.stringify(data) }),
  gradeReport: (id, data) => apiFetch(`/reports/${id}/grade`, { method: "PUT", body: JSON.stringify(data) }),
  
  // -------------------------------------------------------------
  // Interviews / Offers
  // -------------------------------------------------------------
  getInterviews: (applicationId) => apiFetch(`/interviews${applicationId ? `?applicationId=${applicationId}` : ""}`),
  createInterview: (data) => apiFetch("/interviews", { method: "POST", body: JSON.stringify(data) }),
  updateInterview: (id, data) => apiFetch(`/interviews/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  getOffers: (applicationId) => apiFetch(`/offers${applicationId ? `?applicationId=${applicationId}` : ""}`),
  createOffer: (data) => apiFetch("/offers", { method: "POST", body: JSON.stringify(data) }),
  updateOffer: (id, data) => apiFetch(`/offers/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  respondToOffer: (id, data) => apiFetch(`/offers/${id}/respond`, { method: "PUT", body: JSON.stringify(data) }),
  
  // ATS Decide
  decideForInternship: async (id, payload) => {
    if (USE_MOCK_API) return updateMockApplicationStatus(id, payload.decision === "APPROVE" ? "REVIEWING" : "REJECTED");
    return apiFetch(`/applications/${id}/decision`, { method: "PUT", body: JSON.stringify(payload) });
  },
  bulkDecideForInternships: async (payload) => {
    return apiFetch("/applications/bulk-decision", { method: "PUT", body: JSON.stringify(payload) });
  },
  downloadLetterUrl: (id) => `${API_BASE}/applications/${id}/download-letter`,

  // Resumes
  getMyResume: () => apiFetch("/resumes/mine"),
  updateMyResume: (data) => apiFetch("/resumes/mine", { method: "PUT", body: JSON.stringify(data) }),
  getUserResume: (userId) => apiFetch(`/resumes/user/${userId}`),

  // Social Feed
  listPosts: () => apiFetch("/posts"),
  createPost: (data) => apiFetch("/posts", { method: "POST", body: JSON.stringify(data) }),
  deletePost: (id) => apiFetch(`/posts/${id}`, { method: "DELETE" }),

  // -------------------------------------------------------------
  // Analytics
  // -------------------------------------------------------------
  getAnalyticsOverview: () => apiFetch("/analytics/overview"),
  getAnalyticsDashboard: () => apiFetch("/analytics/dashboard"),

  // -------------------------------------------------------------
  // Notifications
  // -------------------------------------------------------------
  getNotifications: () => apiFetch("/notifications"),
  markNotificationRead: (id) => apiFetch(`/notifications/${id}/read`, { method: "PUT" }),

  // -------------------------------------------------------------
  // Files & Documents
  // -------------------------------------------------------------
  upload: async (path, formData) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("utcctp_token") : null;
    const headers = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    const url = `${API_BASE}${path}`;
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: formData,
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Upload failed" }));
      throw new Error(error.message || "Upload failed");
    }
    return response.json();
  },
  get: async (path) => apiFetch(path),
  put: async (path, data) => apiFetch(path, { method: "PUT", body: JSON.stringify(data) }),
  delete: async (path) => apiFetch(path, { method: "DELETE" }),

  // -------------------------------------------------------------
  // Signup (OTP flow)
  // -------------------------------------------------------------
  signupRequestOtp: (data) => apiFetch("/auth/signup/request-otp", {
    method: "POST",
    body: JSON.stringify(data),
  }),
  signupResendOtp: (data) => apiFetch("/auth/signup/resend-otp", {
    method: "POST",
    body: JSON.stringify(data),
  }),
  signupVerifyOtp: (data) => apiFetch("/auth/signup/verify", {
    method: "POST",
    body: JSON.stringify(data),
  }),

  // -------------------------------------------------------------
  // Forgot Password
  // -------------------------------------------------------------
  forgotPassword: async (data) => {
    if (USE_MOCK_API) {
      await delay(1000);
      return { status: "sent" };
    }
    return apiFetch("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  resetPassword: async (data) => {
    if (USE_MOCK_API) {
      await delay(1000);
      return { status: "success" };
    }
    return apiFetch("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  changePassword: async (data) => {
    return apiFetch("/auth/change-password", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // -------------------------------------------------------------
  // Chat System
  // -------------------------------------------------------------
  sendChatMessage: (data) => apiFetch("/chat/send", { method: "POST", body: JSON.stringify(data) }),
  getChatConversation: (otherUsername) => apiFetch(`/chat/messages/${otherUsername}`),
  getChatContacts: () => apiFetch("/chat/contacts"),

  // -------------------------------------------------------------
  // Audit logs (admin only)
  // -------------------------------------------------------------
  getAuditLogs: (page = 0, size = 50) => apiFetch(`/admin/audit?page=${page}&size=${size}`),
  
  // -------------------------------------------------------------
  // Admin: Users Management
  // -------------------------------------------------------------
  getUsers: () => apiFetch("/admin/users"),
  getUser: (id) => apiFetch(`/admin/users/${id}`),
  createUser: (data) => apiFetch("/admin/users", { method: "POST", body: JSON.stringify(data) }),
  updateUser: (id, data) => apiFetch(`/admin/users/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteUser: (id) => apiFetch(`/admin/users/${id}`, { method: "DELETE" }),
};
