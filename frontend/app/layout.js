import "./globals.css";

export const metadata = {
  title: "UTCC-TP | ระบบบริหารทริปและฝึกงาน",
  description: "แพลตฟอร์มบริหารจัดการทริปศึกษาดูงาน การสมัครฝึกงาน และการติดตามรายงานสำหรับมหาวิทยาลัยหอการค้าไทย",
  keywords: "UTCC, ทริป, ฝึกงาน, นักศึกษา, มหาวิทยาลัยหอการค้าไทย",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="th" suppressHydrationWarning>
      <head>
        {/* Font Awesome 6 */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          crossOrigin="anonymous"
        />
        {/* Preconnect for Google Fonts (already in globals.css import) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
