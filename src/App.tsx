import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "@/store";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ItineraryListPage from "./pages/ItineraryListPage";
import ItineraryCreatePage from "./pages/ItineraryCreatePage";
import ItineraryDetailsPage from "./pages/ItineraryDetailsPage";
import ItineraryEditPage from "./pages/ItineraryEditPage";
import DashboardPage from "./pages/DashboardPage";
import NotAuthorizedPage from "./pages/NotAuthorizedPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/not-authorized" element={<NotAuthorizedPage />} />

            {/* Protected Routes - All authenticated users */}
            <Route
              path="/itineraries"
              element={
                <ProtectedRoute>
                  <ItineraryListPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/itineraries/new"
              element={
                <ProtectedRoute>
                  <ItineraryCreatePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/itineraries/:id"
              element={
                <ProtectedRoute>
                  <ItineraryDetailsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/itineraries/:id/edit"
              element={
                <ProtectedRoute>
                  <ItineraryEditPage />
                </ProtectedRoute>
              }
            />

            {/* Admin Only Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </Provider>
);

export default App;
