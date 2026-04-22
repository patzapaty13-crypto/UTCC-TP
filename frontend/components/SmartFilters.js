import { useState } from "react";

export function InternshipFilters({ internships, onFilter }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMode, setSelectedMode] = useState("");

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    applyFilters(value, selectedMode);
  };

  const handleModeChange = (e) => {
    const value = e.target.value;
    setSelectedMode(value);
    applyFilters(searchTerm, value);
  };

  const applyFilters = (search, mode) => {
    let filtered = internships;

    if (search) {
      filtered = filtered.filter(
        (item) =>
          item.title?.toLowerCase().includes(search.toLowerCase()) ||
          item.company?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (mode) {
      filtered = filtered.filter((item) => item.mode === mode);
    }

    onFilter(filtered, { searchTerm: search, mode });
  };

  return (
    <div className="card" style={{ padding: 20, marginBottom: 20, background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)" }}>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ flex: 1, minWidth: 280, position: "relative" }}>
          <i className="fas fa-search" style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "#94a3b8", zIndex: 1, pointerEvents: "none" }}></i>
          <input
            type="text"
            className="form-control"
            placeholder="ค้นหาตำแหน่งหรือบริษัท..."
            style={{ paddingLeft: 44, paddingRight: 16, paddingTop: 12, paddingBottom: 12, borderRadius: 8 }}
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <div style={{ minWidth: 180 }}>
          <select
            className="form-control"
            style={{ borderRadius: 8, padding: "12px 16px" }}
            value={selectedMode}
            onChange={handleModeChange}
          >
            <option value="">ทุกโหมด</option>
            <option value="ON_SITE">🏢 On-site</option>
            <option value="REMOTE">💻 Remote</option>
            <option value="HYBRID">🏠 Hybrid</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export function ApplicationFilters({ applications, onFilter }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    applyFilters(value, selectedStatus);
  };

  const handleStatusChange = (e) => {
    const value = e.target.value;
    setSelectedStatus(value);
    applyFilters(searchTerm, value);
  };

  const applyFilters = (search, status) => {
    let filtered = applications;

    if (search) {
      filtered = filtered.filter(
        (item) =>
          item.companyName?.toLowerCase().includes(search.toLowerCase()) ||
          item.positionTitle?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (status) {
      filtered = filtered.filter((item) => item.status === status);
    }

    onFilter(filtered, { searchTerm: search, status });
  };

  return (
    <div className="card" style={{ padding: 20, marginBottom: 20, background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)" }}>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ flex: 1, minWidth: 280, position: "relative" }}>
          <i className="fas fa-search" style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "#94a3b8", zIndex: 1, pointerEvents: "none" }}></i>
          <input
            type="text"
            className="form-control"
            placeholder="ค้นหาบริษัทหรือตำแหน่ง..."
            style={{ paddingLeft: 44, paddingRight: 16, paddingTop: 12, paddingBottom: 12, borderRadius: 8 }}
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <div style={{ minWidth: 180 }}>
          <select
            className="form-control"
            style={{ borderRadius: 8, padding: "12px 16px" }}
            value={selectedStatus}
            onChange={handleStatusChange}
          >
            <option value="">ทุกสถานะ</option>
            <option value="PENDING">⏳ รอการตรวจสอบ 5 - 7 วัน</option>
            <option value="UNDER_REVIEW">🔍 กำลังตรวจสอบ</option>
            <option value="INTERVIEW_SCHEDULED">📅 นัดสัมภาษณ์</option>
            <option value="INTERVIEW_COMPLETED">✅ สัมภาษณ์เสร็จสิ้น</option>
            <option value="OFFER_RECEIVED">📄 ได้รับข้อเสนอ</option>
            <option value="ACCEPTED">🤝 รับข้อเสนอแล้ว</option>
            <option value="REJECTED">❌ ไม่ผ่านการคัดเลือก</option>
            <option value="WITHDRAWN">🚫 ถอนใบสมัคร</option>
          </select>
        </div>
      </div>
    </div>
  );
}
