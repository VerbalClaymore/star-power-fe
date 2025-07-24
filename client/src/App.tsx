import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import Profile from "@/pages/profile";
import Saved from "@/pages/saved";
import Search from "@/pages/search";
import NotFound from "@/pages/not-found";
import ArticlePage from "@/pages/article";
import BottomNavigation from "@/components/BottomNavigation";

function Router() {
  return (
    <Switch>
      <Route path="/article/:id">
        <ArticlePage />
      </Route>
      <Route>
        <div className="mobile-container">
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/profile" component={Profile} />
            <Route path="/saved" component={Saved} />
            <Route path="/search" component={Search} />
            <Route component={NotFound} />
          </Switch>
          <BottomNavigation />
        </div>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
