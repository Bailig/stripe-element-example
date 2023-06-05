import {
  LinkAuthenticationElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { type Stripe } from "@stripe/stripe-js";
import { useMutation, useQuery } from "@tanstack/react-query";
import { type FormEvent } from "react";

const paymentIntentMessageMap = {
  succeeded: "Payment succeeded!",
  processing: "Your payment is processing.",
  requires_payment_method: "Your payment was not successful, please try again.",
};

const getPaymentIntentMessage = async (
  clientSecret?: string,
  stripe?: Stripe
) => {
  if (clientSecret && stripe) {
    const res = await stripe.retrievePaymentIntent(clientSecret);
    if (!res.paymentIntent) {
      throw new Error("Payment intent not found");
    }
    if (res.paymentIntent.status in paymentIntentMessageMap) {
      return paymentIntentMessageMap[
        res.paymentIntent.status as keyof typeof paymentIntentMessageMap
      ];
    }
    return "Something went wrong";
  }
};

export const CheckoutForm = () => {
  const stripe = useStripe() ?? undefined;
  const elements = useElements();

  const clientSecret =
    new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    ) ?? undefined;

  const paymentIntentMessageQuery = useQuery(
    ["paymentMessage", clientSecret],
    () => getPaymentIntentMessage(clientSecret, stripe),
    {
      enabled: Boolean(clientSecret) && Boolean(stripe),
    }
  );

  const confirmPaymentMutation = useMutation(() => {
    if (!stripe || !elements) {
      throw new Error("Stripe.js has not loaded yet");
    }
    return stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/purchase-result`,
      },
    });
  });

  const message =
    confirmPaymentMutation.data?.error?.message ??
    paymentIntentMessageQuery.data;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!stripe || !elements) {
      return;
    }
    confirmPaymentMutation.mutate();
  };

  return (
    <form className="grid gap-3" onSubmit={handleSubmit}>
      <LinkAuthenticationElement onChange={(e) => console.log(e.value)} />
      <PaymentElement />
      {message && (
        <div className="alert">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="h-6 w-6 shrink-0 stroke-info"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <span>{message}</span>
        </div>
      )}
      <button
        type="submit"
        className="btn-primary btn mt-4 w-full"
        disabled={confirmPaymentMutation.isLoading || !stripe || !elements}
      >
        <span id="button-text">
          {confirmPaymentMutation.isLoading ? "Loading..." : "Pay now"}
        </span>
      </button>
    </form>
  );
};
