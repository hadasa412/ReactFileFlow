import React from "react";
import "./globals.css";

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <div lang="he" dir="rtl">
      {children}
    </div>
  );
}