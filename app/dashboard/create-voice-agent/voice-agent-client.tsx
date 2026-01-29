'use client';

import { signOut } from "@/lib/actions/auth-actions";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { createNewVoiceAgent } from "@/lib/actions/voice-actions";
import { useState } from "react";


type Session = typeof auth.$Infer.Session;


export default function VAClientPage({session}: {session: Session}) {

const router = useRouter();
  const user = session.user;


  // 🔹 form state
  const [agentName, setAgentName] = useState("");
  const [llmId, setLlmId] = useState("");

  
  const handleSignOut = async () => {
    await signOut();
    alert("Signed out");
    router.push("/auth");
  };



  const testAgent = async (agentName: string, llm_id: string) => {
    try {
      await createNewVoiceAgent(agentName, {
        type: "retell-llm",
        llm_id: llm_id  // Replace with your LLM ID
      });
      alert("✅ Agent created!");
    } catch (error: any) {
      alert("❌ " + error.message);
    }
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agentName || !llmId) {
      alert("Please fill in both fields");
      return;
    }

    await testAgent(agentName, llmId);
  };


//   HTML RENDERING 
  return (


    <div className="">
      <h1>Dashboard - {user.email}</h1>
      
      <form onSubmit={handleSubmit}>
        <div>
          <label>Agent Name</label>
          <input value={agentName} onChange={ (e) => setAgentName(e.target.value) } />
        </div>

        <div>
          <label>LLM ID</label>
          <input value={llmId} onChange={ (e) => setLlmId(e.target.value) } />
        </div>

        <button type="submit"></button>
      </form>
      

      <button onClick={handleSignOut}>Sign Out</button>
      {/* <Table>

      </Table> */}
    </div>


  );


}