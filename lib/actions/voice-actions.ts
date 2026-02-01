'use server';

import { auth } from "@/lib/auth";
import { getCollections } from "@/lib/mongodb";
import { headers } from "next/headers";
import { createRetellClient } from "../retell-client";

type ResponseEngine = {
  type: "retell-llm"
  llm_id: string
}


// FUNCTIONS
// CREATES NEW VOICE AGENT WITH RETELL LLM ID AND STORES IN MONGODB FOR THE USER BASED ON THE SESSION.
export async function createNewVoiceAgent(
    agent_name: string,
    response_engine: ResponseEngine
) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) throw new Error("UNAUTHORIZED")


    // THIS CREATES RETELL VOICE AGENT
    const retell = createRetellClient();
    const retellAgent = await retell.agent.create(
        {
            agent_name,
            response_engine,
            language: "en-US",
            voice_id: "11labs-Cimo",
            voice_temperature: 1.24,
            voice_speed: 1.16,
            volume: 1,
            interruption_sensitivity: 0.3,
            ambient_sound: "call-center",
            ambient_sound_volume: 0.67,
            end_call_after_silence_ms: 118000,
            max_call_duration_ms: 3600000,
            data_storage_setting: "everything",
            post_call_analysis_model: "gpt-4.1-mini",
            pii_config: { mode: "post_call", categories: [] },
            allow_user_dtmf: true

        }
    )

    //THIS STORES NEW VA INFO IN MONGODB

    const { voiceAgents } = await getCollections();

    await voiceAgents.insertOne({
    agent_id: retellAgent.agent_id,
    response_engine: retellAgent.response_engine,
    last_modification_timestamp: retellAgent.last_modification_timestamp,
    agent_name: retellAgent.agent_name,
    userId: session.user.id,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

}

    // Clean, minimal Prisma create
//   const voiceAgent = await prisma.voiceAgent.create({
//     data: {
//       agent_id: retellAgent.agent_id,
//       last_modification_timestamp: BigInt(retellAgent.last_modification_timestamp),
//       agent_name: retellAgent.agent_name,
//       version: Number((retellAgent as any).version ?? 0),
//       is_published: Boolean((retellAgent as any).is_published ?? false),
//       userId: session.user.id
//     }
//   });




