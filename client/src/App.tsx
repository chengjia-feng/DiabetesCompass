import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import InsightReport from "@/components/report/insight-report";

// Report page component
const ReportPage = ({ params }: { params: { id: string } }) => {
  return (
    <div className="flex flex-col min-h-screen bg-[#F1F2FA]">
      <Navbar />
      <main className="flex-grow">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-[#322459]">COMPASS Insight Report</h2>
            <p className="mt-2 text-lg text-gray-600">Data-driven insights for your startup</p>
          </div>
          <InsightReport reportId={params.id} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/report/:id" component={ReportPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
