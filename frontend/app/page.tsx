import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Link from 'next/link'

const queryClient = new QueryClient();

export default function Home() {
  return (
    <div>
      <main>
        <h1>Home</h1>
      </main>
    </div>
  );
}
