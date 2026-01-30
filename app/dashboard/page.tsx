import { auth } from "@/lib/auth";
import DashboardClientPage from "./dashboard-client";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getDashboardStats } from "@/lib/actions/dashboard-actions";

// ✅ ADD THIS TYPE (copy from dashboard-actions.ts)
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
    
    const stats: DashboardStats = await getDashboardStats(session.user.id); // ✅ Typed!
        
  return <DashboardClientPage session={session} stats={stats}/>;
}