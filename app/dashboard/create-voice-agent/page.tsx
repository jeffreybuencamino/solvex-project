import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import VAClientPage from "./voice-agent-client";

export default async function createVAPage() {

    const session = await auth.api.getSession({
          headers: await headers(),
        });
    
        if (!session) {
          redirect("/auth");
        }
        
  return <VAClientPage session={session}/>;
}