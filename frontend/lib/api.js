const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

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

  const response = await fetch(`${API_BASE}${path}`, {
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
  // Auth
  login: (credentials) => apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  }),
  getMe: () => apiFetch("/auth/me"),
  updateProfile: (data) => apiFetch("/auth/me", {
    method: "PUT",
    body: JSON.stringify(data),
  }),
  logout: () => apiFetch("/auth/logout", { method: "POST" }),

  // Dashboard
  getDashboard: () => apiFetch("/dashboard/summary"),

  // Trips — correct field names from TripResponse DTO
  getTrips: () => apiFetch("/trips"),
  getTrip: (id) => apiFetch(`/trips/${id}`),
  createTrip: (data) => apiFetch("/trips", { method: "POST", body: JSON.stringify(data) }),
  updateTrip: (id, data) => apiFetch(`/trips/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  publishTrip: (id) => apiFetch(`/trips/${id}/publish`, { method: "POST" }),
  addTripSchedule: (id, data) => apiFetch(`/trips/${id}/schedule`, { method: "POST", body: JSON.stringify(data) }),

  // Internships — correct field names: company (not companyName), slots (not availableSlots)
  getInternships: () => apiFetch("/internships"),
  createInternship: (data) => apiFetch("/internships", { method: "POST", body: JSON.stringify(data) }),
  updateInternship: (id, data) => apiFetch(`/internships/${id}`, { method: "PUT", body: JSON.stringify(data) }),

  // Reports — correct fields: submittedAt (not createdAt), no grade field
  getReports: () => apiFetch("/reports"),
  submitReport: (data) => apiFetch("/reports", { method: "POST", body: JSON.stringify(data) }),
  gradeReport: (id, data) => apiFetch(`/reports/${id}/grade`, { method: "PUT", body: JSON.stringify(data) }),

  // Applications
  getApplications: () => apiFetch("/applications"),
  applyForTrip: (data) => apiFetch("/applications", { method: "POST", body: JSON.stringify(data) }),
  applyForInternship: (data) => apiFetch("/applications", { method: "POST", body: JSON.stringify(data) }),
};
