"use client"

import { useEffect } from "react"
import { addToHistory } from "@/lib/history"

export default function HistoryTracker({ id }: { id: string }) {
  useEffect(() => { addToHistory(id) }, [id])
  return null
}
