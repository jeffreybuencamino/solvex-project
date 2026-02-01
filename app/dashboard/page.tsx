import { auth } from "@/lib/auth";
import DashboardClientPage from "./dashboard-client";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { fetchVoiceAgents } from "@/lib/actions/dashboard-actions";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Solvex Automations - Dashboard",
  description: "Solvex's intuitive dashboard, tracking automation analytics and voice calling metrics."
}
// ✅ ADD THIS TYPE (copy from dashboard-actions.ts)
// Type check for fetching voice agents from mongodb
type DashboardStats = {
  activeVoiceAgents: number;
  activeVoiceAgentsPreview: Array<{
    agent_id: string;
    agent_name: string;
  }>;
};

export default async function DashboardPage() {

    const session = await auth.api.getSession({
          headers: await headers(),
        });
    
        if (!session) {
          redirect("/auth");
        }

        const currentUserId = session.user.id!; // mongodb userId
    
    const stats: DashboardStats = await fetchVoiceAgents(session.user.id); // Grabs voice agents for 
        
  return <DashboardClientPage session={session} stats={stats} userId={currentUserId}/>;
}