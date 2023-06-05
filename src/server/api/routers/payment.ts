import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import Stripe from "stripe";

// This is a public sample test API key.
// Don’t submit any personally identifiable information in requests made with this key.
// Sign in to see your own test API key embedded in code samples.
const stripe = new Stripe("sk_test_4eC39HqLyjWDarjtT1zdp7dc", {
  apiVersion: "2022-11-15",
  typescript: true,
});

export const paymentRouter = createTRPCRouter({
  createPaymentIntent: publicProcedure.mutation(async () => {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1000,
      currency: "usd",
    });

    return { clientSecret: paymentIntent.client_secret };
  }),
});
