"use client"

import type { ReactNode } from "react"
import { usePathname } from "next/navigation"
import Sidebar from "./Sidebar"
import Topbar from "./Topbar"
import PwaRegister from "./PwaRegister"
import CloudAutoSync from "./CloudAutoSync"
import ResumeLocation from "./ResumeLocation"

/** The science academy has its own navigation. Both areas share the same account. */
export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isPolicy = pathname?.startsWith("/legal/")
  const isJunior = pathname === "/junior" || pathname.startsWith("/junior/")

  if (isPolicy) return <>{children}</>

  return (
    <>
      <PwaRegister />
      <CloudAutoSync />
      <ResumeLocation />
      {isJunior ? (
        <div className="juniorStandalone">{children}</div>
      ) : (
        <div className="shell">
          <Sidebar />
          <div className="main">
            <Topbar />
            <main className="content">{children}</main>
          </div>
        </div>
      )}
    </>
  )
}
