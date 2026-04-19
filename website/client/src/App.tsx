import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import Glossary from "./pages/Glossary";
import Sections from "./pages/Sections";
import DocOracle from "./pages/DocOracle";
import DocOracleJob from "./pages/DocOracleJob";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/chat" component={Chat} />
      <Route path="/glossary" component={Glossary} />
      <Route path="/sections" component={Sections} />
      <Route path="/doc-oracle" component={DocOracle} />
      <Route path="/doc-oracle/job/:jobId" component={DocOracleJob} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark" switchable>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
