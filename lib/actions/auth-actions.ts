"use server";

import { redirect } from "next/navigation";
import { auth } from "../auth";
import { headers } from "next/headers";

export const signUp = async (email: string, password: string, name: string) => {
    return auth.api.signUpEmail({
    body: { email, password, name },
  });
};

export const signIn = async (email: string, password: string) => {
    const result = await auth.api.signInEmail({
        body: {email, password, callbackURL: "/dashboard"}
    });

  return result;
};

export const signInSocial = async (provider: "github" | "google") => {
    const result = await auth.api.signInSocial({
        body: {provider, callbackURL: "/dashboard"}
    });

  if (!result?.url) {
    console.error("OAuth failed:", result);
    throw new Error("OAuth failed");
  }

  redirect(result.url);
};

export const signOut = async () => {
    const result = await auth.api.signOut({ headers: await headers() })

    return result;
}