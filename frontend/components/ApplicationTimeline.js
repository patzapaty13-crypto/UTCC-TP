"use client";

const TIMELINE_STEPS = [
  { key: "PENDING", label: "ส่งใบสมัคร", icon: "paper-plane", color: "var(--primary)" },
  { key: "REVIEWING", label: "กำลังพิจารณา", icon: "eye", color: "var(--warning)" },
  { key: "INTERVIEW_SCHEDULED", label: "นัดสัมภาษณ์", icon: "calendar-check", color: "var(--purple)" },
  { key: "OFFER_EXTENDED", label: "ได้รับข้อเสนองาน", icon: "file-signature", color: "var(--success)" },
  { key: "ACCEPTED", label: "ตอบรับแล้ว", icon: "check-circle", color: "var(--success)" },
];

const REJECTED_STEP = { key: "REJECTED", label: "ปฏิเสธ", icon: "times-circle", color: "var(--error)" };

export default function ApplicationTimeline({ application }) {
  const currentStatus = application.status;
  const isRejected = currentStatus === "REJECTED";
  
  const steps = isRejected ? [...TIMELINE_STEPS.slice(0, 2), REJECTED_STEP] : TIMELINE_STEPS;
  const currentStepIndex = steps.findIndex(step => step.key === currentStatus);
  
  const getNextStep = () => {
    if (isRejected || currentStepIndex === -1) return null;
    if (currentStepIndex < steps.length - 1) {
      return steps[currentStepIndex + 1];
    }
    return null;
  };

  const nextStep = getNextStep();

  return (
    <div style={{ padding: 24, background: "var(--n-50)", borderRadius: 16, border: "1px solid var(--n-200)" }}>
      <h4 style={{ fontSize: 16, fontWeight: 800, marginBottom: 20 }}>
        <i className="fas fa-route" style={{ marginRight: 8, color: "var(--primary)" }}></i>
        ขั้นตอนการสมัคร
      </h4>

      {/* Timeline */}
      <div style={{ position: "relative", paddingLeft: 40 }}>
        {/* Vertical Line */}
        <div style={{
          position: "absolute",
          left: 15,
          top: 0,
          bottom: 0,
          width: 2,
          background: "var(--n-200)"
        }}></div>

        {steps.map((step, index) => {
          const isCompleted = index < currentStepIndex || (index === currentStepIndex && currentStatus !== "PENDING");
          const isCurrent = index === currentStepIndex;
          const isPending = index > currentStepIndex;

          return (
            <div key={step.key} style={{ position: "relative", paddingBottom: index === steps.length - 1 ? 0 : 24 }}>
              {/* Circle */}
              <div style={{
                position: "absolute",
                left: -25,
                top: 2,
                width: 20,
                height: 20,
                borderRadius: "50%",
                background: isCompleted || isCurrent ? step.color : "var(--n-300)",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 10,
                fontWeight: 900,
                border: isCurrent ? `3px solid ${step.color}40` : "none",
                boxShadow: isCurrent ? `0 0 0 6px ${step.color}20` : "none"
              }}>
                <i className={`fas fa-${step.icon}`}></i>
              </div>

              {/* Content */}
              <div>
                <p style={{ 
                  fontSize: 14, 
                  fontWeight: 700, 
                  color: isCompleted || isCurrent ? step.color : "var(--text-muted)",
                  marginBottom: 4
                }}>
                  {step.label}
                  {isCurrent && (
                    <span style={{ 
                      marginLeft: 8, 
                      fontSize: 11, 
                      padding: "2px 8px", 
                      background: step.color + "20", 
                      color: step.color,
                      borderRadius: 12,
                      fontWeight: 600
                    }}>
                      ปัจจุบัน
                    </span>
                  )}
                </p>
                
                {/* Status Details */}
                {isCurrent && (
                  <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8 }}>
                    {currentStatus === "PENDING" && "รอบริษัทพิจารณาใบสมัคร"}
                    {currentStatus === "REVIEWING" && "บริษัทกำลังพิจารณาใบสมัครของคุณ"}
                    {currentStatus === "INTERVIEW_SCHEDULED" && "รอการสัมภาษณ์"}
                    {currentStatus === "OFFER_EXTENDED" && "ได้รับข้อเสนองาน รอการตอบรับ"}
                    {currentStatus === "ACCEPTED" && "ตอบรับข้อเสนองานแล้ว"}
                    {currentStatus === "REJECTED" && "ใบสมัครถูกปฏิเสธ"}
                  </div>
                )}

                {/* Interview Details */}
                {isCurrent && currentStatus === "INTERVIEW_SCHEDULED" && application.interviewDate && (
                  <div style={{ 
                    padding: 12, 
                    background: "var(--purple-50)", 
                    borderRadius: 8, 
                    border: "1px solid var(--purple-200)",
                    marginTop: 8
                  }}>
                    <p style={{ fontSize: 12, fontWeight: 700, color: "var(--purple)", marginBottom: 4 }}>
                      <i className="fas fa-calendar" style={{ marginRight: 6 }}></i>
                      นัดสัมภาษณ์
                    </p>
                    <p style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                      {new Date(application.interviewDate).toLocaleDateString("th-TH", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </p>
                    {application.interviewLocation && (
                      <p style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 4 }}>
                        <i className="fas fa-location-dot" style={{ marginRight: 6 }}></i>
                        {application.interviewLocation}
                      </p>
                    )}
                  </div>
                )}

                {/* Offer Details */}
                {isCurrent && currentStatus === "OFFER_EXTENDED" && (
                  <div style={{ 
                    padding: 12, 
                    background: "var(--success-50)", 
                    borderRadius: 8, 
                    border: "1px solid var(--success-200)",
                    marginTop: 8
                  }}>
                    <p style={{ fontSize: 12, fontWeight: 700, color: "var(--success)", marginBottom: 4 }}>
                      <i className="fas fa-file-signature" style={{ marginRight: 6 }}></i>
                      ข้อเสนองาน
                    </p>
                    <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                      <button 
                        className="btn btn-success btn-sm"
                        onClick={() => window.location.href = `/student/offers/${application.offerId}/respond`}
                      >
                        <i className="fas fa-eye" style={{ marginRight: 6 }}></i>
                        ดูรายละเอียด
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Next Step */}
      {nextStep && !isRejected && (
        <div style={{ 
          marginTop: 20, 
          padding: 16, 
          background: "var(--primary-50)", 
          borderRadius: 12, 
          border: "1px solid var(--primary-200)" 
        }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "var(--primary)", marginBottom: 6 }}>
            <i className="fas fa-arrow-right" style={{ marginRight: 6 }}></i>
            ขั้นตอนถัดไป
          </p>
          <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>
            {nextStep.label}
          </p>
          <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>
            {nextStep.key === "REVIEWING" && "รอบริษัทพิจารณาใบสมัคร"}
            {nextStep.key === "INTERVIEW_SCHEDULED" && "รอบริษัทนัดสัมภาษณ์"}
            {nextStep.key === "OFFER_EXTENDED" && "รอรับข้อเสนองาน"}
            {nextStep.key === "ACCEPTED" && "ตอบรับข้อเสนองาน"}
          </p>
        </div>
      )}

      {/* Rejected Message */}
      {isRejected && (
        <div style={{ 
          marginTop: 20, 
          padding: 16, 
          background: "var(--error-50)", 
          borderRadius: 12, 
          border: "1px solid var(--error-200)" 
        }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "var(--error)", marginBottom: 6 }}>
            <i className="fas fa-info-circle" style={{ marginRight: 6 }}></i>
            ใบสมัครถูกปฏิเสธ
          </p>
          <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
            คุณสามารถสมัครตำแหน่งอื่นได้ หรือปรับปรุงใบสมัครและลองใหม่
          </p>
          <div style={{ marginTop: 12 }}>
            <button 
              className="btn btn-primary btn-sm"
              onClick={() => window.location.href = "/internships"}
            >
              <i className="fas fa-search" style={{ marginRight: 6 }}></i>
              หางานอื่น
            </button>
          </div>
        </div>
      )}
    </div>
  );
}