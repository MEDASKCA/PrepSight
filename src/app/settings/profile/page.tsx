"use client"

import Link from "next/link"
import { useMemo } from "react"
import { getProfile } from "@/lib/profile"
import { USER_ROLE_LABEL } from "@/lib/types"
import SettingsPageShell from "@/components/SettingsPageShell"

export default function ProfileSettingsPage() {
  const profile = useMemo(() => getProfile(), [])

  return (
    <SettingsPageShell
      title="Profile settings"
    >
      <div className="grid gap-5">
        <div className="grid gap-4 border-b border-[#E2EDF2] pb-5 text-sm text-[#526579] sm:grid-cols-2">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#64748B]">Hospital</p>
              <p className="mt-1">{profile?.hospital || "Not set"}</p>
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#64748B]">Role</p>
              <p className="mt-1">{profile ? USER_ROLE_LABEL[profile.role] : "Not set"}</p>
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#64748B]">Departments</p>
              <p className="mt-1">{profile?.departments.join(", ") || "Not set"}</p>
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#64748B]">Specialties</p>
              <p className="mt-1">{profile?.specialtiesOfInterest.join(", ") || "Not set"}</p>
            </div>
        </div>

        <div>
          <Link
            href="/onboarding"
            className="inline-flex rounded-[10px] bg-[#06B6D4] px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#0891B2]"
          >
            Open onboarding
          </Link>
        </div>
      </div>
    </SettingsPageShell>
  )
}
