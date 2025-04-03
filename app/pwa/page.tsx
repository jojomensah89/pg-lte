'use client'

import InstallPrompt from "@/components/install-prompt"
import PushNotificationManager from "@/components/push-notification-manager"

 
export default function Page() {
  return (
    <div>
      <PushNotificationManager />
      <InstallPrompt />
    </div>
  )
}