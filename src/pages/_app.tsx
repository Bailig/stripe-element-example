import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import "@stripe/stripe-js";
import "~/utils/stripe";

const MyApp: AppType = ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};

export default api.withTRPC(MyApp);
