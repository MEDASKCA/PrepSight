"use client"

import { Globe, Moon, Sun } from "lucide-react"
import { useState } from "react"
import SettingsPageShell from "@/components/SettingsPageShell"
import {
  applyUserPreferences,
  type LanguagePreference,
  readUserPreferences,
  saveUserPreferences,
  type UserPreferences,
} from "@/lib/user-preferences"

const LANGUAGE_OPTIONS: Array<{ value: LanguagePreference; label: string; detail: string }> = [
  { value: "en", label: "English", detail: "Default workspace language." },
  { value: "es", label: "Spanish", detail: "Ready for future translation wiring." },
  { value: "fr", label: "French", detail: "Prepared for later API-based translation." },
  { value: "de", label: "German", detail: "Stored locally for future language routing." },
  { value: "pt", label: "Portuguese", detail: "Stored locally for future language routing." },
]

export default function AccessSettingsPage() {
  const [preferences, setPreferences] = useState<UserPreferences>(() => readUserPreferences())

  function updatePreferences(updater: (current: UserPreferences) => UserPreferences) {
    setPreferences((current) => {
      const next = updater(current)
      saveUserPreferences(next)
      applyUserPreferences(next)
      return next
    })
  }

  return (
    <SettingsPageShell
      title="Permissions & Access"
    >
      <div className="grid gap-3">
        <div className="rounded-[18px] border border-[#E5EEF7] bg-[#F8FBFE] p-3.5">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-[14px] bg-white text-[#0F172A] shadow-[0_8px_18px_rgba(148,163,184,0.18)]">
              {preferences.access.appearance === "dark" ? <Moon size={18} /> : <Sun size={18} />}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#213547]">Appearance</p>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() =>
                updatePreferences((current) => ({
                  ...current,
                  access: { ...current.access, appearance: "light" },
                }))
              }
              className={`rounded-[16px] border px-3 py-2.5 text-sm font-semibold transition-colors ${
                preferences.access.appearance === "light"
                  ? "border-[#7DD3FC] bg-[#E0F2FE] text-[#0C4A6E]"
                  : "border-[#D8E6F2] bg-white text-[#475569]"
              }`}
            >
              <span className="inline-flex items-center gap-2">
                <Sun size={16} />
                Light theme
              </span>
            </button>
            <button
              type="button"
              onClick={() =>
                updatePreferences((current) => ({
                  ...current,
                  access: { ...current.access, appearance: "dark" },
                }))
              }
              className={`rounded-[16px] border px-3 py-2.5 text-sm font-semibold transition-colors ${
                preferences.access.appearance === "dark"
                  ? "border-[#1E293B] bg-[#0F172A] text-[#E2E8F0]"
                  : "border-[#D8E6F2] bg-white text-[#475569]"
              }`}
            >
              <span className="inline-flex items-center gap-2">
                <Moon size={16} />
                Dark theme
              </span>
            </button>
          </div>
        </div>

        <div className="rounded-[18px] border border-[#E5EEF7] bg-[#F8FBFE] p-3.5">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-[14px] bg-white text-[#0F172A] shadow-[0_8px_18px_rgba(148,163,184,0.18)]">
              <Globe size={18} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#213547]">Language settings</p>
            </div>
          </div>
          <label className="mt-3 grid gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#64748B]">Preferred language</span>
            <select
              value={preferences.access.language}
              onChange={(event) =>
                updatePreferences((current) => ({
                  ...current,
                  access: {
                    ...current.access,
                    language: event.target.value as LanguagePreference,
                  },
                }))
              }
              className="rounded-[16px] border border-[#D8E6F2] bg-white px-3 py-2.5 text-sm text-[#10243E] outline-none transition-colors focus:border-[#7DD3FC]"
            >
              {LANGUAGE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
    </SettingsPageShell>
  )
}
