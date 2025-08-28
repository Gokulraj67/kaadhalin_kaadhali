import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Header } from "@/components/Header";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import RequestQuote from "./pages/RequestQuote";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import { Footer } from "@/components/Footer";
import { ContactForm } from "@/components/ContactForm";


const queryClient = new QueryClient();


function AppContent() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/request-quote" element={<RequestQuote />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!isAdminPage && <ContactForm />}
      <Footer />
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
