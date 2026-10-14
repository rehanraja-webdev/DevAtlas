import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuthStore } from "./stores/authStore.js";

// Layout & Route Guards
import { AppLayout } from "./components/layout/AppLayout.jsx";
import { PublicLayout } from "./components/public/PublicLayout.jsx";
import { ProtectedRoute } from "./components/auth/ProtectedRoute.jsx";
import { PublicRoute } from "./components/auth/PublicRoute.jsx";

// Public Marketing & Help Pages
import { LandingPage } from "./pages/public/LandingPage.jsx";
import { FeaturesPage } from "./pages/public/FeaturesPage.jsx";
import { PublicRoadmapsPage } from "./pages/public/PublicRoadmapsPage.jsx";
import { AboutPage } from "./pages/public/AboutPage.jsx";
import { HelpPage } from "./pages/public/HelpPage.jsx";

// Auth Pages
import { LoginPage } from "./pages/auth/LoginPage.jsx";
import { RegisterPage } from "./pages/auth/RegisterPage.jsx";

// Authenticated Workspace Pages
import { DashboardPage } from "./pages/dashboard/DashboardPage.jsx";
import { DSAPage } from "./pages/dsa/DSAPage.jsx";
import { RoadmapPage } from "./pages/roadmap/RoadmapPage.jsx";
import { SkillsPage } from "./pages/skills/SkillsPage.jsx";
import { ProjectsPage } from "./pages/projects/ProjectsPage.jsx";
import { MentorPage } from "./pages/mentor/MentorPage.jsx";
import { InterviewPage } from "./pages/interview/InterviewPage.jsx";
import { EnglishPracticePage } from "./pages/english/EnglishPracticePage.jsx";
import { ActivityPage } from "./pages/activity/ActivityPage.jsx";
import { SettingsPage } from "./pages/settings/SettingsPage.jsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public Website & Information Pages */}
          <Route
            path="/"
            element={
              <PublicLayout>
                <LandingPage />
              </PublicLayout>
            }
          />
          <Route
            path="/features"
            element={
              <PublicLayout>
                <FeaturesPage />
              </PublicLayout>
            }
          />
          <Route
            path="/roadmaps"
            element={
              <PublicLayout>
                <PublicRoadmapsPage />
              </PublicLayout>
            }
          />
          <Route
            path="/about"
            element={
              <PublicLayout>
                <AboutPage />
              </PublicLayout>
            }
          />
          <Route
            path="/help"
            element={
              <PublicLayout>
                <HelpPage />
              </PublicLayout>
            }
          />

          {/* Public Auth Routes */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            }
          />

          {/* Protected Application Workspace Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <DashboardPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/dsa"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <DSAPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/roadmap"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <RoadmapPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/skills"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <SkillsPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/projects"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <ProjectsPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/mentor"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <MentorPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/interview"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <InterviewPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/practice-english"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <EnglishPracticePage />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/activity"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <ActivityPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <SettingsPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          {/* Fallback Navigation */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
