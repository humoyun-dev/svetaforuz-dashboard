"use client";

import React from "react";
import QRCode from "react-qr-code";

interface QRCodeProps {
  value: string;
  size?: number;
  fgColor?: string;
  bgColor?: string;
}

export default function CodeQR({
  value,
  size = 128,
  fgColor = "#000",
  bgColor = "#fff",
}: QRCodeProps) {
  return (
    <div
      style={{
        width: size,
        height: size,
        padding: 8,
        background: bgColor,
      }}
    >
      <QRCode
        value={value}
        size={size - 16}
        fgColor={fgColor}
        bgColor={bgColor}
      />
    </div>
  );
}
