import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import HomePage from "./pages/HomePage";
import SubjectPage from "./pages/SubjectPage";
import DocumentViewer from "./pages/DocumentViewer";
import VideoPage from "./pages/VideoPage";
import TestPage from "./pages/TestPage";
import AdminPage from "./pages/AdminPage";
import AdminLogin from "./pages/AdminLogin";
import UploadTest from "./pages/UploadTest";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/subjects/:subjectId" element={<SubjectPage />} />
            <Route path="/subjects/:subjectId/document/:documentId" element={<DocumentViewer />} />
            <Route path="/subjects/:subjectId/video/:videoId" element={<VideoPage />} />
            <Route path="/subjects/:subjectId/test/:testId" element={<TestPage />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <AdminPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/upload-test" 
              element={
                <ProtectedRoute>
                  <UploadTest />
                </ProtectedRoute>
              } 
            />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
