"use client";

import React from "react";
import Barcode from "react-barcode";

interface BarcodeProps {
  value: string;
  format?:
    | "CODE39"
    | "CODE128"
    | "CODE128A"
    | "CODE128B"
    | "CODE128C"
    | "EAN13"
    | "EAN8"
    | "EAN5"
    | "EAN2"
    | "UPC"
    | "UPCE"
    | "ITF14"
    | "ITF"
    | "MSI"
    | "MSI10"
    | "MSI11"
    | "MSI1010"
    | "MSI1110"
    | "pharmacode"
    | "codabar"
    | "GenericBarcode";

  width?: number;
  height?: number;
  displayValue?: boolean;
  fontSize?: number;
  margin?: number;
}

export default function BarcodeR({
  value,
  format = "CODE128",
  width = 2,
  height = 100,
  displayValue = true,
  fontSize = 14,
  margin = 10,
}: BarcodeProps) {
  return (
    <div style={{ padding: margin }}>
      <Barcode
        value={value}
        format={format}
        width={width}
        height={height}
        displayValue={displayValue}
        fontSize={fontSize}
        margin={0}
      />
    </div>
  );
}
