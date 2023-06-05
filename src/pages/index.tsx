import { type NextPage } from "next";
import { api } from "~/utils/api";
import React, { useEffect } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { getStripePromise } from "~/utils/stripe";
import { CheckoutForm } from "~/components/checkout-form";
import { type Appearance } from "@stripe/stripe-js";
import { getCssVariableHexColor } from "~/utils/css-variable";

const Home: NextPage = () => {
  const paymentIntentMutation = api.payment.createPaymentIntent.useMutation();

  useEffect(() => {
    paymentIntentMutation.mutate();
    // adding paymentIntentMutation will cause infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentIntentMutation.mutate]);

  const clientSecret = paymentIntentMutation.data?.clientSecret;

  const appearance: Appearance =
    typeof window !== "undefined"
      ? {
        theme: "flat",
        labels: "above",
        variables: {
          colorPrimary: getCssVariableHexColor("--p"),
          colorBackground: getCssVariableHexColor("--b1"),
          borderRadius: ".5rem",
          colorText: getCssVariableHexColor("--bc"),
          colorDanger: getCssVariableHexColor("--er"),
          colorLogo: "dark",
        },
      }
      : {};

  return (
    <main className="grid min-h-screen place-content-center bg-base-100">
      <div className="card min-h-[498px] w-96 bg-neutral text-neutral-content">
        <div className="card-body">
          <h1 className="card-title mb-4">Checkout</h1>
          {paymentIntentMutation.error && (
            <div className="alert alert-error">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 shrink-0 stroke-current"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{paymentIntentMutation.error.message}</span>
            </div>
          )}

          {!clientSecret && <div>Loading...</div>}
          {clientSecret && (
            <Elements
              stripe={getStripePromise()}
              options={{ clientSecret, appearance }}
            >
              <CheckoutForm />
            </Elements>
          )}
        </div>
      </div>
    </main>
  );
};

export default Home;
