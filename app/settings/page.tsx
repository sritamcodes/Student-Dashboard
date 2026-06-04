"use client";

import { useState } from "react";
import { Bell } from "lucide-react";

export default function SettingsPage() {
  const [name, setName] = useState("Suresh Kumar");
  const [email, setEmail] = useState("suresh@nexus.edu");
  const [notifications, setNotifications] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ name, email, notifications });
    alert("Settings saved (mock)");
  };

  return (
    <main className="min-h-screen p-6 bg-[#050508] text-[#f4f4f7]">
      <section className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold mb-4">Settings</h1>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="flex flex-col">
            <label className="mb-1 text-sm">Name</label>
            <input
              className="rounded-md bg-[#1a1a1c] border border-[#333] p-2 text-[#f4f4f7] focus:outline-none focus:ring-2 focus:ring-accent-primary"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-1 text-sm">Email</label>
            <input
              type="email"
              className="rounded-md bg-[#1a1a1c] border border-[#333] p-2 text-[#f4f4f7] focus:outline-none focus:ring-2 focus:ring-accent-primary"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="notifications"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
              className="w-4 h-4 text-accent-primary bg-[#1a1a1c] border-[#333] rounded focus:ring-accent-primary"
            />
            <label htmlFor="notifications" className="ml-2 text-sm flex items-center">
              <Bell className="h-4 w-4 mr-1" />
              Enable email notifications
            </label>
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-accent-primary py-2 font-medium text-black transition-colors hover:bg-accent-primary/80"
          >
            Save Changes
          </button>
        </form>
      </section>
    </main>
  );
}
