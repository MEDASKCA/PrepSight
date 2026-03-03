const HISTORY_KEY = "prepsight_history"
const MAX_HISTORY = 5

export function addToHistory(procedureId: string): void {
  if (typeof window === "undefined") return
  try {
    const current = getHistory()
    const updated = [procedureId, ...current.filter((id) => id !== procedureId)].slice(0, MAX_HISTORY)
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated))
  } catch {
    // ignore
  }
}

export function getHistory(): string[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    return raw ? (JSON.parse(raw) as string[]) : []
  } catch {
    return []
  }
}
