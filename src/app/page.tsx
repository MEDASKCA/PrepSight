import { procedures, getProceduresBySettingAndSpecialty } from "@/lib/data"
import { ClinicalSetting } from "@/lib/types"
import ProcedureCard from "@/components/ProcedureCard"
import SearchBar from "@/components/SearchBar"
import ProfileButton from "@/components/ProfileButton"
import OnboardingGate from "@/components/OnboardingGate"

interface Props {
  searchParams: Promise<{ setting?: string; specialty?: string }>
}

export default async function HomePage({ searchParams }: Props) {
  const { setting, specialty } = await searchParams

  const bySettingAndSpecialty = getProceduresBySettingAndSpecialty()

  // Filter procedures for display
  let filteredProcedures = procedures
  let activeSetting: ClinicalSetting | undefined
  let activeSpecialty: string | undefined

  if (setting) {
    activeSetting = setting as ClinicalSetting
    filteredProcedures = procedures.filter((p) => p.setting === activeSetting)
    if (specialty) {
      activeSpecialty = specialty
      filteredProcedures = filteredProcedures.filter((p) => p.specialty === specialty)
    }
  }

  return (
    <OnboardingGate>
      <div className="min-h-screen bg-[#F4F7FA]">
        <header className="bg-white border-b border-[#D5DCE3] sticky top-0 z-30 lg:hidden">
          <div className="max-w-4xl mx-auto px-4 py-3">
            <div className="flex items-center mb-3">
              <div className="flex-1" />
              <h1 className="text-xl font-bold text-[#3F4752]">PrepSight</h1>
              <div className="flex-1 flex justify-end">
                <ProfileButton />
              </div>
            </div>
            <SearchBar procedures={procedures} />
          </div>
        </header>

        {/* Desktop header (sidebar is present, so no hamburger) */}
        <header className="bg-white border-b border-[#D5DCE3] sticky top-0 z-30 hidden lg:block">
          <div className="px-6 py-3">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <SearchBar procedures={procedures} />
              </div>
              <ProfileButton />
            </div>
          </div>
        </header>

        <main className="px-4 lg:px-6 py-5 space-y-6 max-w-5xl">

          {/* Breadcrumb when filtered */}
          {activeSetting && (
            <div className="flex items-center gap-2 text-sm text-[#64748b]">
              <a href="/" className="hover:text-[#2F8EF7] transition-colors">All settings</a>
              <span>/</span>
              <span className="text-[#3F4752] font-medium">{activeSetting}</span>
              {activeSpecialty && (
                <>
                  <span>/</span>
                  <span className="text-[#3F4752] font-medium">{activeSpecialty}</span>
                </>
              )}
            </div>
          )}

          {/* Setting + specialty filtered: flat grid */}
          {activeSetting && activeSpecialty && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredProcedures.map((p) => (
                <ProcedureCard key={p.id} procedure={p} />
              ))}
              {filteredProcedures.length === 0 && (
                <p className="text-sm text-[#94a3b8] col-span-full">No procedures in this specialty yet.</p>
              )}
            </div>
          )}

          {/* Setting filtered: show specialties within setting */}
          {activeSetting && !activeSpecialty && (() => {
            const specialtyMap = bySettingAndSpecialty.get(activeSetting)
            if (!specialtyMap) return <p className="text-sm text-[#94a3b8]">No procedures in this setting yet.</p>
            return Array.from(specialtyMap.entries()).map(([spec, procs]) => (
              <section key={spec}>
                <h2 className="text-sm font-bold uppercase tracking-widest text-[#64748b] mb-2">{spec}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {procs.map((p) => <ProcedureCard key={p.id} procedure={p} />)}
                </div>
              </section>
            ))
          })()}

          {/* No filter: all settings as collapsible groups */}
          {!activeSetting && Array.from(bySettingAndSpecialty.entries()).map(([s, specialtyMap]) => (
            <section key={s}>
              <h2 className="text-base font-bold text-[#3F4752] mb-3 pb-2 border-b border-[#D5DCE3]">{s}</h2>
              <div className="space-y-5">
                {Array.from(specialtyMap.entries()).map(([spec, procs]) => (
                  <div key={spec}>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-[#64748b] mb-2">{spec}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {procs.map((p) => <ProcedureCard key={p.id} procedure={p} />)}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}

        </main>
      </div>
    </OnboardingGate>
  )
}
