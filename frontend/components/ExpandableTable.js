export function InternshipTable({ internships, onApply, userRole }) {
  if (!internships || internships.length === 0) {
    return null;
  }

  const MODE_LABELS = {
    ON_SITE: { label: "On-site", cls: "badge-blue", icon: "fa-building" },
    REMOTE: { label: "Remote", cls: "badge-purple", icon: "fa-laptop" },
    HYBRID: { label: "Hybrid", cls: "badge-green", icon: "fa-house-laptop" },
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {internships.map((internship) => (
        <div
          key={internship.id}
          className="card"
          style={{
            padding: 24,
            cursor: "pointer",
            transition: "all 0.3s ease",
            borderLeft: "4px solid #3B82F6",
          }}
          onClick={() => onApply(internship)}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6, color: "#1e293b", lineHeight: 1.3 }}>
                {internship.title}
              </h3>
              <p style={{ fontSize: 15, color: "#64748b", marginBottom: 12, fontWeight: 500 }}>
                <i className="fas fa-building" style={{ marginRight: 6 }}></i>
                {internship.company}
              </p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <span className={`badge ${MODE_LABELS[internship.mode]?.cls || "badge-gray"}`}>
                  <i className={`fas ${MODE_LABELS[internship.mode]?.icon || "fa-circle"}`} style={{ marginRight: 6 }}></i>
                  {MODE_LABELS[internship.mode]?.label || internship.mode}
                </span>
                {internship.location && (
                  <span className="badge badge-gray">
                    <i className="fas fa-location-dot" style={{ marginRight: 6 }}></i>
                    {internship.location}
                  </span>
                )}
                {internship.slots && (
                  <span className="badge badge-gray">
                    <i className="fas fa-users" style={{ marginRight: 6 }}></i>
                    {internship.slots} ตำแหน่ง
                  </span>
                )}
              </div>
            </div>
            {userRole === "STUDENT" && (
              <button
                className="btn btn-primary"
                style={{
                  marginLeft: 20,
                  padding: "10px 24px",
                  fontWeight: 600,
                  borderRadius: 8,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onApply(internship);
                }}
              >
                <i className="fas fa-paper-plane" style={{ marginRight: 8 }}></i>
                สมัคร
              </button>
            )}
          </div>
          {internship.description && (
            <p
              style={{
                fontSize: 14,
                color: "#64748b",
                marginTop: 16,
                lineHeight: 1.6,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                paddingTop: 16,
                borderTop: "1px solid #e2e8f0",
              }}
            >
              {internship.description}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

export function ApplicationTable({ applications, onStatusChange, userRole }) {
  if (!applications || applications.length === 0) {
    return null;
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case "DRAFT":
        return { label: "ร่าง", cls: "badge-gray" };
      case "PENDING":
        return { label: "รออนุมัติ", cls: "badge-yellow" };
      case "ADVISOR_APPROVED":
        return { label: "อนุมัติ", cls: "badge-green" };
      case "REVIEWING":
        return { label: "กำลังพิจารณา", cls: "badge-blue" };
      case "SHORTLISTED":
        return { label: "ผ่านรอบแรก", cls: "badge-purple" };
      case "INTERVIEW_SCHEDULED":
        return { label: "นัดสัมภาษณ์", cls: "badge-orange" };
      case "INTERVIEW_COMPLETED":
        return { label: "สัมภาษณ์เสร็จ", cls: "badge-blue" };
      case "OFFER_EXTENDED":
        return { label: "ได้รับ Offer", cls: "badge-green" };
      case "ACCEPTED":
        return { label: "ตอบรับแล้ว", cls: "badge-success" };
      case "REJECTED":
        return { label: "ปฏิเสธแล้ว", cls: "badge-red" };
      case "WITHDRAWN":
        return { label: "ถอนใบสมัคร", cls: "badge-gray" };
      default:
        return { label: status, cls: "badge-gray" };
    }
  };

  const getStatusBorderColor = (status) => {
    switch (status) {
      case "ADVISOR_APPROVED":
      case "OFFER_EXTENDED":
      case "ACCEPTED":
        return "#10b981"; // green
      case "REJECTED":
        return "#ef4444"; // red
      case "PENDING":
      case "REVIEWING":
        return "#f59e0b"; // orange
      default:
        return "#3B82F6"; // blue
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {applications.map((app) => {
        const statusConfig = getStatusLabel(app.status);
        const borderColor = getStatusBorderColor(app.status);
        
        return (
          <div
            key={app.id}
            className="card"
            style={{
              padding: 24,
              transition: "all 0.3s ease",
              borderLeft: `4px solid ${borderColor}`,
              backgroundColor: app.status === "ADVISOR_APPROVED" || app.status === "ACCEPTED" ? "#f0fdf4" : "white",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6, color: "#1e293b", lineHeight: 1.3 }}>
                  {app.internshipTitle || app.tripTitle || "ใบสมัคร"}
                </h3>
                <p style={{ fontSize: 15, color: "#64748b", marginBottom: 12, fontWeight: 500 }}>
                  <i className="fas fa-building" style={{ marginRight: 6 }}></i>
                  {app.companyName}
                </p>
                <span className={`badge ${statusConfig.cls}`}>
                  {statusConfig.label}
                </span>
              </div>
              {userRole === "STUDENT" && app.status === "PENDING" && (
                <button
                  className="btn btn-danger"
                  style={{
                    marginLeft: 20,
                    padding: "8px 16px",
                    fontWeight: 600,
                    borderRadius: 8,
                  }}
                  onClick={() => onStatusChange({ applicationId: app.id, action: "WITHDRAWN" })}
                >
                  <i className="fas fa-times" style={{ marginRight: 6 }}></i>
                  ถอนใบสมัคร
                </button>
              )}
            </div>
            {app.appliedAt && (
              <p style={{ fontSize: 13, color: "#94a3b8", marginTop: 12 }}>
                สมัครเมื่อ: {new Date(app.appliedAt).toLocaleDateString("th-TH")}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
