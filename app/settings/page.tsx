import type { Metadata } from "next"
import { SettingsDashboard } from "./settings-dashboard"

export const metadata: Metadata = {
  title: "Settings | MSSCenter.Cloud",
  description: "Manage your MSSCenter account and application settings.",
}

export default function SettingsPage() {
  return <SettingsDashboard />
}
