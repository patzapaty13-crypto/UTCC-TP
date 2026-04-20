package org.example.utcctp.notification;

public final class EmailTemplates {
    private EmailTemplates() {}

    private static String wrap(String title, String bodyHtml) {
        return """
            <!DOCTYPE html>
            <html lang="th"><body style="margin:0;padding:0;background:#F1F5F9;font-family:'Plus Jakarta Sans',Arial,sans-serif;">
              <div style="max-width:560px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.06);">
                <div style="background:#0B0F1A;color:#fff;padding:20px 28px;">
                  <p style="margin:0;font-size:11px;letter-spacing:.1em;color:rgba(255,255,255,.4);text-transform:uppercase;">UTCC Trip &amp; Internship Platform</p>
                  <h1 style="margin:6px 0 0;font-size:20px;font-weight:800;">%s</h1>
                </div>
                <div style="padding:28px;color:#0F172A;font-size:14px;line-height:1.7;">
                  %s
                  <hr style="border:none;border-top:1px solid #E2E8F0;margin:28px 0 16px;">
                  <p style="font-size:11.5px;color:#94A3B8;">อีเมลฉบับนี้ส่งอัตโนมัติ กรุณาอย่าตอบกลับ</p>
                </div>
              </div>
            </body></html>
            """.formatted(escape(title), bodyHtml);
    }

    public static String statusChange(String studentName, String oldStatus, String newStatus,
                                      String positionTitle, String note) {
        String body = """
            <p>เรียน %s</p>
            <p>สถานะใบสมัครของคุณสำหรับ <strong>%s</strong> ได้รับการอัปเดตเรียบร้อยแล้ว</p>
            <table style="width:100%%;border-collapse:collapse;margin:12px 0 20px;">
              <tr><td style="padding:8px 0;color:#64748B;">สถานะเดิม</td><td style="padding:8px 0;font-weight:700;">%s</td></tr>
              <tr><td style="padding:8px 0;color:#64748B;">สถานะใหม่</td><td style="padding:8px 0;font-weight:700;color:#2563EB;">%s</td></tr>
              %s
            </table>
            <p>เข้าสู่ระบบเพื่อดูรายละเอียดเพิ่มเติม</p>
            """.formatted(
                escape(studentName),
                escape(positionTitle),
                escape(oldStatus),
                escape(newStatus),
                note == null || note.isBlank() ? "" :
                        "<tr><td style=\"padding:8px 0;color:#64748B;\">หมายเหตุ</td><td style=\"padding:8px 0;\">" + escape(note) + "</td></tr>"
        );
        return wrap("อัปเดตสถานะใบสมัคร", body);
    }

    public static String otp(String code, int minutesValid) {
        String body = """
            <p>รหัสยืนยันของคุณสำหรับการสมัครสมาชิกคือ</p>
            <div style="font-size:32px;font-weight:900;letter-spacing:8px;color:#2563EB;text-align:center;padding:18px;background:#EFF6FF;border-radius:12px;margin:18px 0;">%s</div>
            <p>รหัสนี้จะหมดอายุใน <strong>%d นาที</strong></p>
            <p style="color:#64748B;font-size:12.5px;">หากคุณไม่ได้เป็นผู้ร้องขอ สามารถเพิกเฉยต่ออีเมลฉบับนี้ได้</p>
            """.formatted(escape(code), minutesValid);
        return wrap("ยืนยันอีเมลของคุณ", body);
    }

    private static String escape(String s) {
        if (s == null) return "";
        return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;");
    }
}
