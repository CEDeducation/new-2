"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { getActiveLabSession, labSessionEvent } from "@/lib/lab-session"
import { storage } from "@/lib/storage"
import type { WorkspaceState } from "@/lib/types"
import { BookIcon, DnaIcon, FlaskIcon, SparkIcon, WorkflowIcon } from "./Icons"
import { dnaLength } from "@/lib/sequence"

const applications = [
  { href: "/bioresearch", label: "Bioresearch", detail: "Assays and experimental data", icon: DnaIcon },
  { href: "/bioprocess", label: "Bioprocess", detail: "Recipes, runs and process insights", icon: WorkflowIcon },
  { href: "/automation", label: "Automation", detail: "Visual lab workflows", icon: SparkIcon },
  { href: "/invivo", label: "In Vivo", detail: "Studies, cohorts and observations", icon: FlaskIcon },
]

type RecentItem = { id: string; title: string; detail: string; href: string; kind: "Experiment" | "Sequence" }

export default function Dashboard() {
  const [state, setState] = useState<WorkspaceState | null>(null)
  const [profileName, setProfileName] = useState("Researcher")
  const [workspaceName, setWorkspaceName] = useState("OpenLab")

  useEffect(() => {
    const refresh = () => {
      setState(storage.getState())
      const session = getActiveLabSession()
      if (session) {
        setProfileName(session.profile.displayName)
        setWorkspaceName(session.workspaceName)
      }
    }
    refresh()
    window.addEventListener(storage.eventName, refresh)
    window.addEventListener(labSessionEvent, refresh)
    return () => {
      window.removeEventListener(storage.eventName, refresh)
      window.removeEventListener(labSessionEvent, refresh)
    }
  }, [])

  const recent = useMemo<RecentItem[]>(() => {
    if (!state) return []
    const experiments = state.notebook.map(item => ({
      id: `experiment-${item.id}`,
      title: item.title,
      detail: `${item.status} · updated ${new Date(item.updatedAt).toLocaleDateString()}`,
      href: "/notebook",
      kind: "Experiment" as const,
      updatedAt: item.updatedAt,
    }))
    const sequences = state.sequences.map(item => ({
      id: `sequence-${item.id}`,
      title: item.name,
      detail: `${dnaLength(item.sequence).toLocaleString()} bp · ${item.topology}`,
      href: "/plasmids",
      kind: "Sequence" as const,
      updatedAt: item.updatedAt,
    }))
    return [...experiments, ...sequences]
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      .slice(0, 4)
      .map(({ updatedAt: _updatedAt, ...item }) => item)
  }, [state])

  return (
    <div className="dashboardPage minimalDashboard">
      <section className="minimalHero">
        <div>
          <span className="sectionEyebrow">{workspaceName.toUpperCase()}</span>
          <h1>Welcome back, {profileName}.</h1>
          <p>Pick up where you left off or start a new experiment.</p>
        </div>
        <div className="minimalHeroActions">
          <Link href="/notebook" className="primaryButton linkButton">+ New experiment</Link>
          <Link href="/plasmids" className="ghostButton linkButton">Molecular biology</Link>
          <Link href="/billing" className="ghostButton linkButton">Plans & reports</Link>
          <Link href="/junior" className="juniorHeroLaunch">Open OpenLab Jr. <span aria-hidden="true">↗</span></Link>
        </div>
      </section>

      <Link href="/junior" className="juniorFeatureBanner" aria-label="Open OpenLab Junior interactive learning academy">
        <div className="juniorFeatureCopy">
          <span className="juniorFeatureEyebrow">✦ OPENLAB LEARNING ACADEMY</span>
          <h2>Meet OpenLab Jr.</h2>
          <p>Interactive Chemistry, Biology and Physics labs, plus Class 9–12 Chemistry and Biology theory, visual study cards and chapter quizzes.</p>
          <span className="juniorFeatureAction">Open Junior Science Studio <span aria-hidden="true">↗</span></span>
        </div>
        <div className="juniorFeatureArt" aria-hidden="true">
          <svg viewBox="0 0 270 190" role="presentation" focusable="false">
            <defs><linearGradient id="olJuniorOrb" x1="0" x2="1" y1="0" y2="1"><stop stopColor="#a8ffdf"/><stop offset="1" stopColor="#a9aaff"/></linearGradient></defs>
            <circle cx="139" cy="93" r="65" fill="none" stroke="#ffffff36" strokeWidth="1.6"/>
            <ellipse cx="139" cy="93" rx="98" ry="36" fill="none" stroke="#abffe4" strokeWidth="2.4" transform="rotate(-33 139 93)"/>
            <ellipse cx="139" cy="93" rx="97" ry="33" fill="none" stroke="#b9aeff" strokeWidth="2.4" transform="rotate(39 139 93)"/>
            <circle cx="139" cy="93" r="29" fill="url(#olJuniorOrb)"/>
            <circle cx="66" cy="130" r="10" fill="#d9c5ff"/><circle cx="225" cy="85" r="9" fill="#a7ffe0"/><circle cx="147" cy="27" r="7" fill="#ffd6a6"/>
            <path d="M20 31h34m-17-17v34M220 143h32m-16-16v32" stroke="#abffe4" strokeWidth="2" strokeLinecap="round" opacity=".62"/>
          </svg>
        </div>
      </Link>
      <div className="minimalHomeGrid">
        <section className="surfaceCard minimalPanel">
          <div className="minimalPanelHead">
            <div><span className="sectionEyebrow">CONTINUE</span><h2>Recent work</h2></div>
          </div>
          <div className="minimalRecentList">
            {recent.length ? recent.map(item => (
              <Link href={item.href} className="minimalRecentRow" key={item.id}>
                <span className="minimalRecentIcon">{item.kind === "Experiment" ? <BookIcon size={18}/> : <DnaIcon size={18}/>}</span>
                <div><strong>{item.title}</strong><small>{item.detail}</small></div>
                <b>→</b>
              </Link>
            )) : (
              <div className="quietEmpty minimalEmpty">No research yet. Create your first experiment or import a sequence.</div>
            )}
          </div>
        </section>

        <section className="surfaceCard minimalPanel">
          <div className="minimalPanelHead">
            <div><span className="sectionEyebrow">APPLICATIONS</span><h2>Open a workspace</h2></div>
          </div>
          <div className="minimalAppList">
            {applications.map(({ href, label, detail, icon: Icon }) => (
              <Link href={href} className="minimalAppRow" key={href}>
                <span className="minimalAppIcon"><Icon size={18}/></span>
                <div><strong>{label}</strong><small>{detail}</small></div>
                <b>→</b>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
