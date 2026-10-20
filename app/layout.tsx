import type { Metadata } from "next"
import "./globals.css"
import AppShell from "@/components/AppShell"
import AuthGate from "@/components/AuthGate"

export const metadata: Metadata = {
  title: "OpenLab | Research & Junior Science Studio",
  description: "OpenLab Research tools and OpenLab Jr. interactive Chemistry, Biology and Physics science education for Classes 9–12.",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><AuthGate><AppShell>{children}</AppShell></AuthGate></body></html>
}
