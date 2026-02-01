'use server';
import { stripe } from '@/lib/stripe';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { getCollections } from '@/lib/mongodb'; // Your existing MongoDB helper
import Stripe from 'stripe';

export async function createCheckoutSession(priceId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error("UNAUTHORIZED");

  const userId = session.user.id;
  
  // Get collections (same pattern as your voice agent)
  const { user } = await getCollections();
  
  // Check if user already has Stripe customer
  const existingUser = await user.findOne({ 
    userId: session.user.id 
  });
  
  let customerId: string;
  
  if (!existingUser?.stripeCustomerId) {
    // Create Stripe customer
    const customer = await stripe.customers.create({
      email: session.user.email!,
      metadata: { userId },
    });
    customerId = customer.id;
    
    // ✅ UPDATE MONGODB USERS COLLECTION
    await user.updateOne(
      { userId: session.user.id },
      { 
        $set: { 
          stripeCustomerId: customerId,
          updatedAt: new Date()
        }
      },
      { upsert: true } // Creates user doc if doesn't exist
    );
  } else {
    customerId = existingUser.stripeCustomerId;
  }

  const params: Stripe.Checkout.SessionCreateParams = {  // ✅ Explicit typing
    customer: customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing?canceled=true`,
  };

  const checkoutSession = await stripe.checkout.sessions.create(params);

  return { url: checkoutSession.url, customerId };
}
