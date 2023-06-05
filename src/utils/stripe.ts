import { loadStripe } from "@stripe/stripe-js";

// This is a public sample test API key.
// Don’t submit any personally identifiable information in requests made with this key.
// Sign in to see your own test API key embedded in code samples.
const stripePromise = loadStripe("pk_test_TYooMQauvdEDq54NiTphI7jx");

export const getStripePromise = () => {
  return stripePromise;
};
