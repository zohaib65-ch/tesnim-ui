import { Suspense } from "react";
import { AppRouter } from "./routes/app-router";

export default function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AppRouter />
    </Suspense>
  );
}
