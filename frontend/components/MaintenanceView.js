"use client";

import React from 'react';

export default function MaintenanceView() {
  return (
    <div style={{
      height: '100vh',
      width: '100vw',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#020617',
      color: 'white',
      fontFamily: 'system-ui, sans-serif',
      padding: '20px',
      textAlign: 'center'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '500px',
        padding: '40px',
        background: 'rgba(255,255,255,0.03)',
        borderRadius: '32px',
        border: '1px solid rgba(255,255,255,0.1)',
        backdropFilter: 'blur(20px)'
      }}>
        <div style={{
          fontSize: '64px',
          marginBottom: '24px'
        }}>
          🚧
        </div>
        <h1 style={{ fontSize: '28px', marginBottom: '16px', fontWeight: '800' }}>
          ระบบอยู่ระหว่างการซ่อมบำรุง
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', lineHeight: '1.6', marginBottom: '32px' }}>
          ขณะนี้เจ้าหน้าที่กำลังอัปเดตระบบเพื่อให้คุณใช้งานได้ดียิ่งขึ้น 
          ขออภัยในความไม่สะดวก และกรุณาลองใหม่อีกครั้งในภายหลัง
        </p>
        <button 
          onClick={() => window.location.reload()}
          style={{
            padding: '12px 32px',
            background: '#3B82F6',
            border: 'none',
            borderRadius: '12px',
            color: 'white',
            fontWeight: '700',
            cursor: 'pointer'
          }}
        >
          ลองใหม่อีกครั้ง
        </button>
      </div>
      <p style={{ marginTop: '32px', fontSize: '12px', color: 'rgba(255,255,255,0.2)' }}>
        UTCC Administrative Lockdown Mode
      </p>
    </div>
  );
}
