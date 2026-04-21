"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function OfferResponsePage() {
  const params = useParams();
  const router = useRouter();
  const offerId = params.id;
  
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [response, setResponse] = useState(""); // "ACCEPT" or "REJECT"
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    if (!offerId) return;
    loadOffer();
  }, [offerId]);

  const loadOffer = async () => {
    try {
      setLoading(true);
      // Get applications first to find the one with this offer
      const applications = await api.getApplications();
      
      let foundOffer = null;
      let foundApplication = null;
      
      for (const application of applications) {
        try {
          const offers = await api.get(`/offers/application/${application.id}`);
          const offer = offers.find(o => o.id === offerId);
          if (offer) {
            foundOffer = offer;
            foundApplication = application;
            break;
          }
        } catch (err) {
          console.error(`Failed to load offers for application ${application.id}:`, err);
        }
      }
      
      if (foundOffer && foundApplication) {
        // Transform API data to match the expected format
        setOffer({
          id: foundOffer.id,
          positionTitle: foundOffer.title || foundApplication.positionTitle,
          company: foundApplication.companyName,
          salary: foundOffer.allowanceAmount ? 
            new Intl.NumberFormat("th-TH").format(foundOffer.allowanceAmount) : "ไม่ระบุ",
          startDate: foundOffer.startsOn,
          endDate: foundOffer.endsOn,
          benefits: [
            "ค่าเดินทาง 2,000 บาท/เดือน",
            "ค่าอาหารกลางวัน",
            "ประกันอุบัติเหตุ",
            "ใบประกาศนียบัตร"
          ],
          workingHours: "จันทร์-ศุกร์ 9:00-17:00",
          location: "สำนักงานบริษัท",
          supervisor: "ผู้จัดการฝ่ายทรัพยากรบุคคล",
          contactEmail: "hr@company.com",
          contactPhone: "02-123-4567",
          expiryDate: foundOffer.responseDeadline,
          terms: foundOffer.termsText ? foundOffer.termsText.split('\n').filter(t => t.trim()) : [
            "ต้องเข้าร่วมโครงการฝึกงานครบ 3 เดือน",
            "ส่งรายงานความคืบหน้าทุกสัปดาห์",
            "เข้าร่วมกิจกรรมของบริษัทตามที่ได้รับมอบหมาย",
            "รักษาความลับของบริษัท"
          ],
          status: foundOffer.status,
          applicationId: foundApplication.id
        });
      } else {
        setOffer(null);
      }
    } catch (err) {
      console.error("Failed to load offer:", err);
      setError("ไม่สามารถโหลดข้อมูลข้อเสนองานได้");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!response) return;
    
    if (response === "REJECT" && !rejectionReason.trim()) {
      setError("กรุณาระบุเหตุผลในการปฏิเสธ");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const responseData = {
        status: response === "ACCEPT" ? "ACCEPTED" : "REJECTED"
      };
      
      await api.put(`/offers/${offerId}/respond`, responseData);
      
      // Redirect back to offers with success message
      router.push("/student/offers?success=offer-responded");
    } catch (err) {
      setError(err.message || "เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        <div className="page-header">
          <div className="skeleton" style={{ width: 200, height: 20, marginBottom: 8 }}></div>
          <div className="skeleton" style={{ width: 300, height: 32, marginBottom: 8 }}></div>
          <div className="skeleton" style={{ width: 400, height: 16 }}></div>
        </div>
        <div className="card" style={{ padding: 24 }}>
          <div className="skeleton" style={{ width: "100%", height: 200 }}></div>
        </div>
      </div>
    );
  }

  if (!offer) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon"><i className="fas fa-file-signature"></i></div>
        <h3>ไม่พบข้อเสนองาน</h3>
        <p>ข้อเสนองานที่คุณต้องการดูอาจถูกลบหรือหมดอายุแล้ว</p>
        <button className="btn btn-primary" onClick={() => router.push("/student/offers")}>
          กลับไปหน้าข้อเสนองาน
        </button>
      </div>
    );
  }

  const isExpired = new Date(offer.expiryDate) < new Date();
  const daysLeft = Math.ceil((new Date(offer.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      {/* Header */}
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Job Offer Response</p>
          <h1 className="page-title">ตอบรับข้อเสนองาน</h1>
          <p className="page-subtitle">พิจารณาข้อเสนองานและตอบรับหรือปฏิเสธ</p>
        </div>
      </div>

      {error && <div className="alert alert-error"><i className="fas fa-circle-exclamation"></i>{error}</div>}

      {/* Expiry Warning */}
      {!isExpired && daysLeft <= 3 && (
        <div className="alert alert-warning">
          <i className="fas fa-clock"></i>
          ข้อเสนองานนี้จะหมดอายุในอีก {daysLeft} วัน (วันที่ {new Date(offer.expiryDate).toLocaleDateString("th-TH")})
        </div>
      )}

      {isExpired && (
        <div className="alert alert-error">
          <i className="fas fa-times-circle"></i>
          ข้อเสนองานนี้หมดอายุแล้ว (วันที่ {new Date(offer.expiryDate).toLocaleDateString("th-TH")})
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 28 }}>
        {/* Offer Details */}
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 20, color: "var(--primary)" }}>
            <i className="fas fa-file-signature" style={{ marginRight: 12 }}></i>
            รายละเอียดข้อเสนองาน
          </h3>

          {/* Position Info */}
          <div style={{ marginBottom: 24 }}>
            <h4 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{offer.positionTitle}</h4>
            <p style={{ fontSize: 16, color: "var(--text-muted)", marginBottom: 16 }}>
              <i className="fas fa-building" style={{ marginRight: 8 }}></i>
              {offer.company}
            </p>
          </div>

          {/* Key Details Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
            <div>
              <h5 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-muted)", marginBottom: 8 }}>เงินเดือน</h5>
              <p style={{ fontSize: 16, fontWeight: 600, color: "var(--success)" }}>
                <i className="fas fa-money-bill-wave" style={{ marginRight: 8 }}></i>
                {offer.salary} บาท/เดือน
              </p>
            </div>
            <div>
              <h5 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-muted)", marginBottom: 8 }}>ระยะเวลา</h5>
              <p style={{ fontSize: 16, fontWeight: 600 }}>
                <i className="fas fa-calendar" style={{ marginRight: 8 }}></i>
                {new Date(offer.startDate).toLocaleDateString("th-TH")} - {new Date(offer.endDate).toLocaleDateString("th-TH")}
              </p>
            </div>
            <div>
              <h5 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-muted)", marginBottom: 8 }}>เวลาทำงาน</h5>
              <p style={{ fontSize: 16, fontWeight: 600 }}>
                <i className="fas fa-clock" style={{ marginRight: 8 }}></i>
                {offer.workingHours}
              </p>
            </div>
            <div>
              <h5 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-muted)", marginBottom: 8 }}>สถานที่</h5>
              <p style={{ fontSize: 16, fontWeight: 600 }}>
                <i className="fas fa-location-dot" style={{ marginRight: 8 }}></i>
                {offer.location}
              </p>
            </div>
          </div>

          {/* Benefits */}
          <div style={{ marginBottom: 24 }}>
            <h5 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-muted)", marginBottom: 12 }}>สวัสดิการ</h5>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {offer.benefits.map((benefit, index) => (
                <div key={index} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <i className="fas fa-check-circle" style={{ color: "var(--success)", fontSize: 12 }}></i>
                  <span style={{ fontSize: 14 }}>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div style={{ marginBottom: 24 }}>
            <h5 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-muted)", marginBottom: 12 }}>ข้อมูลติดต่อ</h5>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <p style={{ fontSize: 14, marginBottom: 4 }}>
                  <i className="fas fa-user" style={{ marginRight: 8, color: "var(--text-muted)" }}></i>
                  <strong>ผู้ดูแล:</strong> {offer.supervisor}
                </p>
              </div>
              <div>
                <p style={{ fontSize: 14, marginBottom: 4 }}>
                  <i className="fas fa-envelope" style={{ marginRight: 8, color: "var(--text-muted)" }}></i>
                  <strong>อีเมล:</strong> {offer.contactEmail}
                </p>
              </div>
              <div>
                <p style={{ fontSize: 14 }}>
                  <i className="fas fa-phone" style={{ marginRight: 8, color: "var(--text-muted)" }}></i>
                  <strong>โทรศัพท์:</strong> {offer.contactPhone}
                </p>
              </div>
            </div>
          </div>

          {/* Terms */}
          <div>
            <h5 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-muted)", marginBottom: 12 }}>เงื่อนไขและข้อตกลง</h5>
            <ul style={{ paddingLeft: 20, margin: 0 }}>
              {offer.terms.map((term, index) => (
                <li key={index} style={{ fontSize: 14, marginBottom: 8, color: "var(--text-secondary)" }}>
                  {term}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Response Form */}
        <div className="card" style={{ padding: 24, height: "fit-content" }}>
          <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>
            <i className="fas fa-reply" style={{ marginRight: 12 }}></i>
            การตอบรับ
          </h3>

          <form onSubmit={handleSubmit}>
            {/* Response Options */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, display: "block" }}>
                การตัดสินใจ *
              </label>
              
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer", padding: 12, border: "2px solid var(--border)", borderRadius: 8, background: response === "ACCEPT" ? "var(--success-50)" : "transparent", borderColor: response === "ACCEPT" ? "var(--success)" : "var(--border)" }}>
                  <input
                    type="radio"
                    name="response"
                    value="ACCEPT"
                    checked={response === "ACCEPT"}
                    onChange={(e) => setResponse(e.target.value)}
                    disabled={isExpired || submitting}
                  />
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "var(--success)", marginBottom: 4 }}>
                      <i className="fas fa-check-circle" style={{ marginRight: 8 }}></i>
                      ตอบรับข้อเสนองาน
                    </p>
                    <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
                      ยืนยันการเข้าร่วมโครงการฝึกงาน
                    </p>
                  </div>
                </label>

                <label style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer", padding: 12, border: "2px solid var(--border)", borderRadius: 8, background: response === "REJECT" ? "var(--error-50)" : "transparent", borderColor: response === "REJECT" ? "var(--error)" : "var(--border)" }}>
                  <input
                    type="radio"
                    name="response"
                    value="REJECT"
                    checked={response === "REJECT"}
                    onChange={(e) => setResponse(e.target.value)}
                    disabled={isExpired || submitting}
                  />
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "var(--error)", marginBottom: 4 }}>
                      <i className="fas fa-times-circle" style={{ marginRight: 8 }}></i>
                      ปฏิเสธข้อเสนองาน
                    </p>
                    <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
                      ไม่สามารถเข้าร่วมได้
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Rejection Reason */}
            {response === "REJECT" && (
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, display: "block" }}>
                  เหตุผลในการปฏิเสธ *
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="กรุณาระบุเหตุผลในการปฏิเสธข้อเสนองาน..."
                  rows={4}
                  style={{ width: "100%", padding: 12, border: "1px solid var(--border)", borderRadius: 8, fontSize: 14, resize: "vertical" }}
                  disabled={submitting}
                />
              </div>
            )}

            {/* Submit Buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <button
                type="submit"
                className={`btn ${response === "ACCEPT" ? "btn-success" : "btn-error"} btn-lg`}
                disabled={!response || submitting || isExpired}
                style={{ width: "100%" }}
              >
                {submitting ? (
                  <>
                    <i className="fas fa-spinner fa-spin" style={{ marginRight: 8 }}></i>
                    กำลังส่ง...
                  </>
                ) : response === "ACCEPT" ? (
                  <>
                    <i className="fas fa-check" style={{ marginRight: 8 }}></i>
                    ยืนยันตอบรับ
                  </>
                ) : response === "REJECT" ? (
                  <>
                    <i className="fas fa-times" style={{ marginRight: 8 }}></i>
                    ยืนยันปฏิเสธ
                  </>
                ) : (
                  "เลือกการตัดสินใจ"
                )}
              </button>

              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => router.push("/student/offers")}
                disabled={submitting}
                style={{ width: "100%" }}
              >
                <i className="fas fa-arrow-left" style={{ marginRight: 8 }}></i>
                กลับไปหน้าข้อเสนองาน
              </button>
            </div>
          </form>

          {/* Expiry Info */}
          {!isExpired && (
            <div style={{ marginTop: 20, padding: 12, background: "var(--warning-50)", borderRadius: 8, border: "1px solid var(--warning-200)" }}>
              <p style={{ fontSize: 12, color: "var(--warning)", margin: 0 }}>
                <i className="fas fa-info-circle" style={{ marginRight: 6 }}></i>
                ข้อเสนองานนี้จะหมดอายุในวันที่ {new Date(offer.expiryDate).toLocaleDateString("th-TH")}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}