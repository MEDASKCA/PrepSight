"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { X, Edit, LogOut, Bell, Shield } from "lucide-react"
import { getInitials, avatarColour } from "@/lib/utils"
import { getProfile, clearProfile } from "@/lib/profile"
import { onAuthChange, signOut, type User } from "@/lib/auth"
import { PrepSightProfile } from "@/lib/types"

export default function ProfileButton() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<PrepSightProfile | null>(null)

  useEffect(() => {
    const unsub = onAuthChange((u) => setUser(u))
    return unsub
  }, [])

  useEffect(() => {
    setProfile(getProfile())
  }, [open])

  const displayName = user?.displayName ?? user?.email ?? "You"
  const displayRole = profile?.role ?? "No role set"
  const photoURL    = user?.photoURL

  const initials = getInitials(displayName)
  const colour   = avatarColour(displayName)

  async function handleSignOut() {
    clearProfile()
    await signOut()
    setOpen(false)
    router.push("/login")
  }

  function handleEditProfile() {
    clearProfile()
    setOpen(false)
    router.push("/onboarding")
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Your profile"
        className={`w-9 h-9 rounded-full overflow-hidden shrink-0 shadow-sm ${!photoURL ? `${colour} text-white text-sm font-bold flex items-center justify-center` : ""}`}
      >
        {photoURL
          ? <img src={photoURL} alt={displayName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          : initials
        }
      </button>

      {open && (
        <div
          className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white w-full sm:max-w-sm sm:rounded-2xl rounded-t-2xl shadow-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-[#003366] px-5 pt-6 pb-8 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-14 h-14 rounded-full overflow-hidden shrink-0 ${!photoURL ? `${colour} text-white text-xl font-bold flex items-center justify-center` : ""}`}>
                  {photoURL
                    ? <img src={photoURL} alt={displayName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    : initials
                  }
                </div>
                <div>
                  <p className="text-white font-bold text-lg leading-snug">{displayName}</p>
                  <p className="text-white/70 text-sm">{displayRole}</p>
                  {profile?.hospital && (
                    <p className="text-white/50 text-xs mt-0.5">{profile.hospital}</p>
                  )}
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors mt-0.5"
              >
                <X size={16} />
              </button>
            </div>

            {/* Menu */}
            <div className="divide-y divide-[#F4F7FA]">
              <button
                onClick={handleEditProfile}
                className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-[#f8fafc] transition-colors"
              >
                <div className="w-9 h-9 rounded-full bg-[#e0f2fe] flex items-center justify-center shrink-0">
                  <Edit size={18} className="text-[#2F8EF7]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#3F4752]">Edit profile</p>
                  <p className="text-xs text-[#94a3b8]">Update hospital and preferences</p>
                </div>
              </button>

              <button className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-[#f8fafc] transition-colors">
                <div className="w-9 h-9 rounded-full bg-[#e0f2fe] flex items-center justify-center shrink-0">
                  <Bell size={18} className="text-[#2F8EF7]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#3F4752]">Notifications</p>
                  <p className="text-xs text-[#94a3b8]">Coming soon</p>
                </div>
              </button>

              <button className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-[#f8fafc] transition-colors">
                <div className="w-9 h-9 rounded-full bg-[#e0f2fe] flex items-center justify-center shrink-0">
                  <Shield size={18} className="text-[#2F8EF7]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#3F4752]">Permissions &amp; Access</p>
                  <p className="text-xs text-[#94a3b8]">Coming soon</p>
                </div>
              </button>

              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-[#fff5f5] transition-colors"
              >
                <div className="w-9 h-9 rounded-full bg-[#fee2e2] flex items-center justify-center shrink-0">
                  <LogOut size={18} className="text-red-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-red-600">Sign out</p>
                  <p className="text-xs text-[#94a3b8]">{user?.email}</p>
                </div>
              </button>
            </div>

            <div className="px-5 py-3 bg-[#f8fafc]">
              <p className="text-xs text-[#94a3b8] text-center">PrepSight · v0.2 · No patient data stored</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
