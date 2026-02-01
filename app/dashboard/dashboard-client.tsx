"use client";
import { signOut } from "@/lib/actions/auth-actions";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createNewVoiceAgent } from "@/lib/actions/voice-actions";
import { useState, useEffect } from "react";
import { 
  BarChart3, 
  Users, 
  Zap, 
  DollarSign, 
  Clock, 
  Play, 
  Settings,
  Mic,
  Bot
} from 'lucide-react';

type Session = typeof auth.$Infer.Session;

// ACTIVE VOICE AGENT ANALYTICS
type DashboardStats = {
  activeVoiceAgents: number;
  activeVoiceAgentsPreview: Array<{
    agent_id: string;
    agent_name: string;
  }>;
};

type Props = {
  session: Session;
  stats: DashboardStats;
  userId: string;
};

export default function DashboardClientPage({ session, stats, userId }: Props) {
  const router = useRouter();
  const user = session.user;

  // 🔹 form state - UNCHANGED
  const [agentName, setAgentName] = useState("");
  const [llmId, setLlmId] = useState("");

  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const fetchClients = async () => {
  //     setLoading(true);
      
  //     const url = '/api/clients';
  //     const res = await fetch(url);
  //     const data = await res.json();
  //     setCount(data.count || data.length);
  //     setLoading(false);
  //   };

  //   fetchClients();
  // }, [userId]);

  const handleSignOut = async () => {
    await signOut();
    alert("Signed out");
    router.push("/auth");
  };

  // 🔹 UNCHANGED agent creation functions
  const createVA = async (agentName: string, llm_id: string) => {
    try {
      await createNewVoiceAgent(agentName, {
        type: "retell-llm",
        llm_id: llm_id
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
    await createVA(agentName, llmId);
  };

  // Mock data for AI agency dashboard
  const statsData = [
    { name: 'Voice Agents', value: stats.activeVoiceAgents.toString(), change: '+4', icon: Mic, color: 'bg-blue-500' },
    { name: 'Automations Today', value: 'N/A', change: '+12%', icon: Play, color: 'bg-green-500' },
    // { name: `Client Calls (${userId.slice(0, 8)}...)`, value: count.toString(), change: '+23%', icon: Users, color: 'bg-purple-500' },
  ];

  return (
    <div className="min-h-screen from-slate-50 to-blue-50">
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 pt-20">
        {/* Header with User Info - Enhanced */}
        <div className="mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              AI Automation Dashboard
            </h1>
            <p className="text-xl">Welcome back, {user.name}</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3 p-3 rounded-xl shadow-sm border">
              <img
                className="h-12 w-12 rounded-full"
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
                alt={user.name}
              />
              <div>
                <p className="font-semibold text-sm">{user.name}</p>
                <p className="text-xs text-slate-500">{user.email}</p>
              </div>
            </div>
            <Button onClick={handleSignOut} variant="outline" size="sm">
              Sign Out
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Stats Cards */}
          {stats && statsData.map((statsData, index) => {
            const Icon = statsData.icon;
            return (
              <Card key={index} className="hover:shadow-xl transition-all border-0 bg-gradient-to-br hover:from-white">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold">{statsData.name}</CardTitle>
                    <Icon className={`h-8 w-8 ${statsData.color} text-white p-2 rounded-lg`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text">{statsData.value}</div>
                  <p className="text-sm text-slate-500 mt-1">{statsData.change}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">

          {/* Active Voice Agents - MAPPING OVER stats.activeVoiceAgentsPreview */}
          <Card className="xl:col-span-2">
            <CardHeader>
              <CardTitle>Active Voice Agents</CardTitle>
              <CardDescription>Your deployed AI voice agents</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="border rounded-md overflow-hidden">
                {/* Sticky Header */}
                <div className="bg-background/95 backdrop-blur border-b sticky top-0 z-10">
                  <div className="grid grid-cols-[200px_1fr_120px] px-6 py-4">
                    <div className="font-semibold">Agent Name</div>
                    <div className="font-semibold">Agent ID</div>
                    <div className="font-semibold text-center">Status</div>
                  </div>
                </div>
                
                {/* Scrollable Body */}
                <div className="max-h-[320px] overflow-y-auto">
                  <div className="divide-y divide-border">
                    {stats.activeVoiceAgentsPreview.map((agent, index) => (
                      <div 
                        key={agent.agent_id || index}
                        className="grid grid-cols-[200px_1fr_120px] px-6 py-4 hover:bg-slate-50 transition-colors group"
                      >
                        <div className="font-medium truncate">{agent.agent_name}</div>
                        <div className="truncate text-sm text-slate-600 break-all">{agent.agent_id}</div>
                        <div className="flex justify-center">
                          <Badge variant="default" className="text-xs">
                            ACTIVE
                          </Badge>
                        </div>
                      </div>
                    ))}
                    {stats.activeVoiceAgentsPreview.length === 0 && (
                      <div className="grid grid-cols-[200px_1fr_120px] px-6 py-12 text-center text-slate-500">
                        <div></div>
                        <div>No active voice agents yet</div>
                        <div></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Create Voice Agent - YOUR ORIGINAL FORM ENHANCED */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                Create Voice Agent
              </CardTitle>
              <CardDescription>Deploy new AI voice automation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="agentName">Agent Name</Label>
                  <Input
                    id="agentName"
                    value={agentName}
                    onChange={(e) => setAgentName(e.target.value)}
                    placeholder="e.g., Sales Assistant"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="llmId">LLM ID</Label>
                  <Input
                    id="llmId"
                    value={llmId}
                    onChange={(e) => setLlmId(e.target.value)}
                    placeholder="retell-llm-xxxx"
                  />
                </div>
                <Button type="submit" className="w-full">
                  <Zap className="mr-2 h-4 w-4" />
                  Deploy Agent
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your AI automations</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <Button variant="ghost" className="justify-start h-auto p-6">
              <BarChart3 className="h-6 w-6 mr-3" />
              <div>
                <div className="font-medium">View Analytics</div>
                <div className="text-xs text-slate-500">Call metrics & performance</div>
              </div>
            </Button>
            <Button variant="ghost" className="justify-start h-auto p-6">
              <Users className="h-6 w-6 mr-3" />
              <div>
                <div className="font-medium">Manage Clients</div>
                <div className="text-xs text-slate-500">Client settings & billing</div>
              </div>
            </Button>
            <Button variant="ghost" className="justify-start h-auto p-6">
              <Settings className="h-6 w-6 mr-3" />
              <div>
                <div className="font-medium">Agent Settings</div>
                <div className="text-xs text-slate-500">Configure voice agents</div>
              </div>
            </Button>
          </CardContent>
        </Card>

        {/* Navigation - UNCHANGED */}
        <div className="mt-12 pt-8 border-t border-slate-200">
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/" className="px-6 py-3 border border-slate-300 text-sm font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 transition-colors">
              ← Back to Home
            </Link>
            <Link href="/auth" className="px-6 py-3 bg-blue-600 text-sm font-medium rounded-lg text-white hover:bg-blue-700 transition-colors">
              Manage Account
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
