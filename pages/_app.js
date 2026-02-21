import "../styles/globals.css";
import { Fira_Code } from "@next/font/google";

const fira = Fira_Code({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export default function App({ Component, pageProps }) {
  return (
    <main className={fira.className}>
      <Component {...pageProps} />
    </main>
  );
}
