import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createCheckoutSession } from "@/lib/actions/billing-actions";

export default async function BillingPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/auth");

  return (
    <div>
      <h1>Billing</h1>
      <form action={createCheckoutSession}>
        <input type="hidden" name="priceId" value="price_123yourproplan" />
        <button type="submit">Upgrade to Pro</button>
      </form>
    </div>
  );
}
