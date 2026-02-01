// lib/dashboard-actions.ts
'use server';

import { getCollections } from '@/lib/mongodb'; // ✅ Fixed path

type DashboardStats = {
  activeVoiceAgents: number;
  activeVoiceAgentsPreview: Array<{
    agent_id: string;
    agent_name: string;
  }>;
};

export async function fetchVoiceAgents(userId: string) {
  try {
    const { voiceAgents } = await getCollections();

    // ✅ COUNT ALL voice agents for this user (no is_published filter)
    const totalAgentsCount = await voiceAgents.countDocuments({ userId });
    
    // ✅ Get preview of first 5 agents (ALL agents, not just published)
    const agentPreview = await voiceAgents
      .find({ userId })  // ✅ Only filter by userId
      .limit(5)
      .project({ agent_id: 1, agent_name: 1 })  // ✅ Efficient field selection
      .toArray();

    const sanitizedPreview = agentPreview.map(agent => ({
      agent_id: agent.agent_id,
      agent_name: agent.agent_name || 'Unnamed Agent',
    }));

    return {
      activeVoiceAgents: totalAgentsCount,  // ✅ Uses efficient countDocuments
      activeVoiceAgentsPreview: sanitizedPreview
    } as DashboardStats;
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return {
      activeVoiceAgents: 0,
      activeVoiceAgentsPreview: []
    } as DashboardStats;
  }
}
