import ErrorPage from "@/components/error-page/ErrorPage";
import LoadingPage from "@/components/loading-page/LoadingPage";
import { ChakraProvider, createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";
import { ThemeProvider } from "next-themes";
import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { ErrorBoundary } from "react-error-boundary";
import App from "./App";

const config = defineConfig({
  globalCss: {
    "html, body, #root": {
      width: "100%",
      height: "100%",
      margin: 0,
      padding: 0,
    },
    body: {
      fontSize: "12px",
    },
  },
});

export const system = createSystem(defaultConfig, config);

const root = createRoot(document.getElementById("root")!);
root.render(
  <StrictMode>
    <ChakraProvider value={system}>
      <ThemeProvider attribute="class" disableTransitionOnChange>
        <ErrorBoundary FallbackComponent={ErrorPage}>
          <Suspense fallback={<LoadingPage />}>
            <App />
          </Suspense>
        </ErrorBoundary>
      </ThemeProvider>
    </ChakraProvider>
  </StrictMode>,
);
