import { procedures, getProceduresBySettingAndSpecialty } from "@/lib/data"
import { ClinicalSetting } from "@/lib/types"
import ProcedureCard from "@/components/ProcedureCard"
import ProfileButton from "@/components/ProfileButton"
import SearchBar from "@/components/SearchBar"
import HomeHero from "@/components/HomeHero"

interface Props {
  searchParams: Promise<{ setting?: string; specialty?: string }>
}

export default async function HomePage({ searchParams }: Props) {
  const { setting, specialty } = await searchParams

  const bySettingAndSpecialty = getProceduresBySettingAndSpecialty()

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

  // ── No filter: show home hero ─────────────────────────────────────────────
  if (!activeSetting) {
    return <HomeHero />
  }

  // ── Filtered view: header + breadcrumb + grid ─────────────────────────────
  return (
    <div className="min-h-screen bg-[#F4F7FA]">
      {/* Mobile header */}
      <header className="bg-white border-b border-[#D5DCE3] sticky top-0 z-30 lg:hidden">
        <div className="px-4 py-3">
          <SearchBar procedures={procedures} />
        </div>
      </header>

      {/* Desktop header */}
      <header className="bg-white border-b border-[#D5DCE3] sticky top-0 z-30 hidden lg:block">
        <div className="px-6 py-3 flex items-center gap-4">
          <div className="flex-1">
            <SearchBar procedures={procedures} />
          </div>
          <ProfileButton />
        </div>
      </header>

      <main className="px-4 lg:px-6 py-5 space-y-6 max-w-5xl">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-[#64748b]">
          <a href="/" className="hover:text-[#2F8EF7] transition-colors">Home</a>
          <span>/</span>
          <span className="text-[#3F4752] font-medium">{activeSetting}</span>
          {activeSpecialty && (
            <>
              <span>/</span>
              <span className="text-[#3F4752] font-medium">{activeSpecialty}</span>
            </>
          )}
        </div>

        {/* Setting + specialty: flat grid */}
        {activeSpecialty && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredProcedures.map((p) => <ProcedureCard key={p.id} procedure={p} />)}
            {filteredProcedures.length === 0 && (
              <p className="text-sm text-[#94a3b8] col-span-full">No procedures in this specialty yet.</p>
            )}
          </div>
        )}

        {/* Setting only: specialties within setting */}
        {!activeSpecialty && (() => {
          const specialtyMap = bySettingAndSpecialty.get(activeSetting!)
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

      </main>
    </div>
  )
}
