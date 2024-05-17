import { SWRConfig } from "swr";
import Layout from "../components/Layout";
import RouteGuard from "../components/RouteGuard";
import "@/styles/bootstrap.min.css";

function App({ Component, pageProps }) {
  return (
    <SWRConfig
      value={{
        fetcher: async (url) => {
          const res = await fetch(url);

          // If the status code is not in the range 200-299,
          // we still try to parse and throw it.
          if (!res.ok) {
            const error = new Error("An error occurred while fetching the data.");
            // Attach extra info to the error object.
            error.info = await res.json();
            error.status = res.status;
            throw error;
          }
          return res.json();
        },
      }}
    >
      <RouteGuard> 
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </RouteGuard>
    </SWRConfig>
  );
}

export default App;
