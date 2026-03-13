"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function SettingsPageShell({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <main className="min-h-screen bg-[#F8FBFD] px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[#0F172A] transition-colors hover:text-[#0891B2]"
        >
          <ArrowLeft size={16} />
          Back to workspace
        </Link>

        <section className="mt-5">
          <div className="border-b border-[#CFE8EF] pb-4">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#0891B2]">Settings</p>
            <h1 className="mt-2 text-[22px] font-medium text-[#10243E]">{title}</h1>
          </div>
          <div className="mt-5">{children}</div>
        </section>
      </div>
    </main>
  )
}
