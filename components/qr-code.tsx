"use client";

import React from "react";
import { QRCodeSVG } from "qrcode.react";

interface QRCodeProps {
  value: string;
  size?: number;
  fgColor?: string;
  bgColor?: string;
  logo?: string;
  className?: string;
}

export default function CodeQR({
  value,
  size = 128,
  fgColor = "#000000",
  bgColor = "#ffffff",
  logo,
  className = "",
}: QRCodeProps) {
  return (
    <div
      className={`flex items-center justify-center p-2 rounded-lg ${className}`}
      style={{ backgroundColor: bgColor, width: size, height: size }}
    >
      {logo ? (
        <QRCodeSVG
          value={value}
          size={size - 16}
          fgColor={fgColor}
          bgColor={bgColor}
          imageSettings={{
            src: logo,
            height: size * 0.2,
            width: size * 0.2,
            excavate: true,
          }}
        />
      ) : (
        <QRCodeSVG
          value={value}
          size={size - 16}
          fgColor={fgColor}
          bgColor={bgColor}
        />
      )}
    </div>
  );
}
