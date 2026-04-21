"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import RoleDashboardShell from "@/components/RoleDashboardShell";
import { api } from "@/lib/api";

const STATUS_CONFIG = {
  PENDING: { label: "รอตอบรับ", color: "#F59E0B", bg: "#FFFBEB", icon: "clock" },
  ACCEPTED: { label: "ตอบรับแล้ว", color: "#10B981", bg: "#ECFDF5", icon: "check-circle" },
  REJECTED: { label: "ปฏิเสธแล้ว", color: "#EF4444", bg: "#FEF2F2", icon: "times-circle" },
  EXPIRED: { label: "หมดอายุ", color: "#6B7280", bg: "#F9FAFB", icon: "calendar-times" },
  WITHDRAWN: { label: "ถอนคืน", color: "#8B5CF6", bg: "#F5F3FF", icon: "undo" },
};

export default function StudentOffersPage() {
  const router = useRouter();
  const [offers, setOffers] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // First get applications to get offer data
      const applicationsData = await api.getApplications();
      setApplications(applicationsData || []);
      
      // Get offers for each application
      const allOffers = [];
      for (const application of applicationsData || []) {
        try {
          const applicationOffers = await api.get(`/offers/application/${application.id}`);
          if (applicationOffers && applicationOffers.length > 0) {
            // Add application info to each offer
            const offersWithAppInfo = applicationOffers.map(offer => ({
              ...offer,
              applicationInfo: application
            }));
            allOffers.push(...offersWithAppInfo);
          }
        } catch (err) {
          console.error(`Failed to load offers for application ${application.id}:`, err);
        }
      }
      
      setOffers(allOffers);
    } catch (err) {
      console.error("Failed to load data:", err);
    } finally {
      setLoading(false);
    }
  };

  const getOfferStatus = (offer) => {
    if (offer.status === "ACCEPTED" || offer.status === "REJECTED") {
      return offer.status;
    }
    
    if (offer.responseDeadline && new Date(offer.responseDeadline) < new Date()) {
      return "EXPIRED";
    }
    
    return "PENDING";
  };

  const filteredOffers = offers.filter(offer => {
    const status = getOfferStatus(offer);
    if (filter === "ALL") return true;
    if (filter === "ACTIVE") return ["PENDING"].includes(status);
    if (filter === "RESPONDED") return ["ACCEPTED", "REJECTED"].includes(status);
    if (filter === "EXPIRED") return status === "EXPIRED";
    return status === filter;
  });

  const activeCount = offers.filter(o => getOfferStatus(o) === "PENDING").length;
  const respondedCount = offers.filter(o => ["ACCEPTED", "REJECTED"].includes(getOfferStatus(o))).length;
  const expiredCount = offers.filter(o => getOfferStatus(o) === "EXPIRED").length;

  return (
    <RoleDashboardShell role="STUDENT" title="ข้อเสนองาน" subtitle="จัดการข้อเสนองานฝึกงานและตอบรับ">
      {/* Filter Tabs */}
      <div className="card" style={{ padding: 20, marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <FilterButton
            active={filter === "ALL"}
            onClick={() => setFilter("ALL")}
            icon="list"
            label="ทั้งหมด"
            count={offers.length}
          />
          <FilterButton
            active={filter === "ACTIVE"}
            onClick={() => setFilter("ACTIVE")}
            icon="clock"
            label="รอตอบรับ"
            count={activeCount}
            color="#F59E0B"
          />
          <FilterButton
            active={filter === "RESPONDED"}
            onClick={() => setFilter("RESPONDED")}
            icon="check-circle"
            label="ตอบรับแล้ว"
            count={respondedCount}
            color="#10B981"
          />
          <FilterButton
            active={filter === "EXPIRED"}
            onClick={() => setFilter("EXPIRED")}
            icon="calendar-times"
            label="หมดอายุ"
            count={expiredCount}
            color="#6B7280"
          />
        </div>
      </div>

      {/* Offers List */}
      {loading ? (
        <div className="card" style={{ padding: 40, textAlign: "center" }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: 32, color: "#3B82F6", marginBottom: 16 }}></i>
          <p className="text-muted">กำลังโหลดข้อเสนองาน...</p>
        </div>
      ) : filteredOffers.length === 0 ? (
        <div className="card" style={{ padding: 60, textAlign: "center" }}>
          <div style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "#F3F4F6",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
            fontSize: 36,
            color: "#9CA3AF"
          }}>
            <i className="fas fa-file-signature"></i>
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>ไม่มีข้อเสนองาน</h3>
          <p className="text-muted">
            {filter === "ALL" ? "คุณยังไม่มีข้อเสนองาน" : `ไม่มีข้อเสนองานในหมวด "${filter}"`}
          </p>
          {filter === "ALL" && (
            <button
              className="btn btn-primary"
              onClick={() => router.push("/internships")}
              style={{ marginTop: 16 }}
            >
              <i className="fas fa-search" style={{ marginRight: 8 }}></i>
              ค้นหาตำแหน่งฝึกงาน
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: "grid", gap: 16 }}>
          {filteredOffers.map((offer) => (
            <OfferCard
              key={offer.id}
              offer={offer}
              status={getOfferStatus(offer)}
              onViewDetails={() => router.push(`/student/offers/${offer.id}/respond`)}
            />
          ))}
        </div>
      )}
    </RoleDashboardShell>
  );
}

// Filter Button Component
function FilterButton({ active, onClick, icon, label, count, color = "#2563EB" }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "10px 20px",
        background: active ? color : "transparent",
        color: active ? "white" : "var(--text-secondary)",
        border: active ? "none" : "1px solid var(--border)",
        borderRadius: 10,
        fontSize: 13,
        fontWeight: 700,
        cursor: "pointer",
        transition: "all 0.2s ease",
        display: "flex",
        alignItems: "center",
        gap: 8
      }}
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.background = "var(--n-50)";
          e.currentTarget.style.borderColor = color;
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.borderColor = "var(--border)";
        }
      }}
    >
      <i className={`fas fa-${icon}`}></i>
      {label}
      <span style={{
        padding: "2px 8px",
        background: active ? "rgba(255,255,255,0.2)" : color + "20",
        color: active ? "white" : color,
        borderRadius: 99,
        fontSize: 11,
        fontWeight: 800
      }}>
        {count}
      </span>
    </button>
  );
}

// Offer Card Component
function OfferCard({ offer, status, onViewDetails }) {
  const statusConfig = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING;
  const isExpired = status === "EXPIRED";
  const isPending = status === "PENDING";
  const isUrgent = isPending && offer.responseDeadline && 
    new Date(offer.responseDeadline) - new Date() < 3 * 24 * 60 * 60 * 1000; // 3 days

  const formatCurrency = (amount, currency = "THB") => {
    if (!amount) return "ไม่ระบุ";
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "ไม่ระบุ";
    return new Date(dateString).toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  const getDaysLeft = () => {
    if (!offer.responseDeadline) return null;
    const days = Math.ceil((new Date(offer.responseDeadline) - new Date()) / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  const daysLeft = getDaysLeft();

  return (
    <div
      className="card"
      style={{
        padding: 24,
        transition: "all 0.2s ease",
        cursor: "pointer",
        borderLeft: `4px solid ${statusConfig.color}`,
        background: isUrgent ? "#FEF3F2" : undefined
      }}
      onClick={onViewDetails}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "var(--shadow-lg)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "none";
        e.currentTarget.style.boxShadow = "var(--shadow-sm)";
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
        <div style={{ flex: 1 }}>
          {/* Status Badge */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <span style={{
              padding: "6px 14px",
              background: statusConfig.bg,
              color: statusConfig.color,
              borderRadius: 99,
              fontSize: 12,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: 6
            }}>
              <i className={`fas fa-${statusConfig.icon}`}></i>
              {statusConfig.label}
            </span>
            {isUrgent && (
              <span style={{
                padding: "6px 14px",
                background: "#FEF2F2",
                color: "#EF4444",
                borderRadius: 99,
                fontSize: 12,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: 6
              }}>
                <i className="fas fa-exclamation-triangle"></i>
                เร่งด่วน
              </span>
            )}
          </div>

          {/* Position & Company */}
          <h3 style={{ fontSize: 18, fontWeight: 800, color: "var(--text-primary)", marginBottom: 8 }}>
            {offer.title || offer.applicationInfo?.positionTitle || "ตำแหน่งงาน"}
          </h3>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 12 }}>
            <i className="fas fa-building" style={{ marginRight: 8, color: "#6B7280" }}></i>
            {offer.applicationInfo?.companyName || "บริษัท"}
          </p>

          {/* Key Details */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 16 }}>
            {offer.allowanceAmount && (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <i className="fas fa-money-bill-wave" style={{ color: "#10B981", fontSize: 16 }}></i>
                <div>
                  <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 2 }}>เงินเดือน</p>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "#10B981" }}>
                    {formatCurrency(offer.allowanceAmount, offer.allowanceCurrency)}
                  </p>
                </div>
              </div>
            )}
            
            {offer.startsOn && offer.endsOn && (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <i className="fas fa-calendar" style={{ color: "#3B82F6", fontSize: 16 }}></i>
                <div>
                  <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 2 }}>ระยะเวลา</p>
                  <p style={{ fontSize: 14, fontWeight: 700 }}>
                    {formatDate(offer.startsOn)} - {formatDate(offer.endsOn)}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Deadline Warning */}
          {isPending && daysLeft !== null && (
            <div style={{
              padding: 12,
              background: daysLeft <= 3 ? "#FEF2F2" : "#FFFBEB",
              borderRadius: 8,
              border: `1px solid ${daysLeft <= 3 ? "#FECACA" : "#FDE68A"}`,
              marginBottom: 12
            }}>
              <p style={{
                fontSize: 13,
                color: daysLeft <= 3 ? "#DC2626" : "#D97706",
                margin: 0,
                display: "flex",
                alignItems: "center",
                gap: 8
              }}>
                <i className={`fas fa-${daysLeft <= 3 ? "exclamation-triangle" : "clock"}`}></i>
                {daysLeft === 0 ? "หมดเขตวันนี้" : `เหลือเวลา ${daysLeft} วัน`}
                {offer.responseDeadline && ` (ถึงวันที่ ${formatDate(offer.responseDeadline)})`}
              </p>
            </div>
          )}

          {/* Terms Preview */}
          {offer.termsText && (
            <div style={{
              padding: 12,
              background: "var(--n-50)",
              borderRadius: 8,
              marginBottom: 12
            }}>
              <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0 }}>
                <i className="fas fa-file-contract" style={{ marginRight: 6 }}></i>
                <strong>เงื่อนไข:</strong> {offer.termsText.substring(0, 100)}
                {offer.termsText.length > 100 && "..."}
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
          {isPending && !isExpired && (
            <button
              className="btn btn-primary"
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails();
              }}
              style={{ padding: "8px 16px", fontSize: 13, whiteSpace: "nowrap" }}
            >
              <i className="fas fa-reply" style={{ marginRight: 6 }}></i>
              ตอบรับ
            </button>
          )}
          <button
            className="btn btn-ghost"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails();
            }}
            style={{ padding: "8px 16px", fontSize: 13 }}
          >
            <i className="fas fa-eye" style={{ marginRight: 6 }}></i>
            ดูรายละเอียด
          </button>
          
          {/* Response Date */}
          {offer.respondedAt && (
            <p style={{ fontSize: 11, color: "var(--text-muted)", margin: 0, textAlign: "right" }}>
              ตอบรับเมื่อ {new Date(offer.respondedAt).toLocaleDateString("th-TH")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}