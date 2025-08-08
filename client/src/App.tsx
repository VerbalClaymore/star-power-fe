import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Home from "@/pages/home";
import Profile from "@/pages/profile";
import Saved from "@/pages/saved";
import Search from "@/pages/search";
import NotFound from "@/pages/not-found";
import ArticlePage from "@/pages/article";
import ActorProfilePage from "@/pages/actor-profile";
import ShipProfilePage from "@/pages/ship-profile";
import HashtagPage from "@/pages/hashtag";
import BottomNavigation from "@/components/BottomNavigation";

function Router() {
  return (
    <Switch>
      <Route path="/article/:id">
        <div className="mobile-container">
          <ArticlePage />
        </div>
      </Route>
      <Route path="/actor/:id/:returnTo?">
        <div className="mobile-container">
          <ActorProfilePage />
        </div>
      </Route>
      <Route path="/ship/:id">
        <div className="mobile-container">
          <ShipProfilePage />
        </div>
      </Route>
      <Route path="/hashtag/:hashtag">
        <div className="mobile-container">
          <HashtagPage />
        </div>
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
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
