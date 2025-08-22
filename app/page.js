"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, ArrowRight } from "lucide-react";
import { PricingTable, SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Navbar */}
      <header className="flex justify-between items-center px-6 md:px-10 py-6">
        <div className="flex items-center gap-2">
          {/* Zyvera Logo */}
          <img src="/logo.svg" alt="Zyvera logo" className="h-10 md:h-12 w-auto" />
        </div>
        <nav className="hidden md:flex items-center gap-6 text-muted-foreground">
          <a href="#features" className="hover:text-foreground">Features</a>
          <a href="#pricing" className="hover:text-foreground">Pricing</a>

        </nav>
        <div className="flex items-center gap-3">
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="outline" className="hidden sm:inline-flex">Login</Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button>Sign Up</Button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <Button className="hidden sm:inline-flex" onClick={() => (window.location.href = "/workspace")}>Open Workspace</Button>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center text-center justify-center px-6">
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight">
          Learn Smarter with
          {" "}
          <span className="text-primary">
            AI
          </span>
        </h1>
        <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-2xl">
          Zyvera helps you master new skills faster with personalized AI-powered courses and interactive practice.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Button onClick={() => (window.location.href = "/workspace")}>
            Get Started Free
            <ArrowRight className="size-4" />
          </Button>
        </div>

        {/* Hero Illustration */}
        <div className="mt-12 max-w-3xl w-full">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 400" fill="none">
            <rect width="1200" height="400" rx="20" fill="url(#bg)" />
            <defs>
              <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="var(--muted)" />
                <stop offset="100%" stopColor="var(--background)" />
              </linearGradient>
              <linearGradient id="wave" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="var(--primary)" />
                <stop offset="100%" stopColor="var(--ring)" />
              </linearGradient>
            </defs>
            <path
              d="M0 250 Q300 150 600 250 T1200 250 V400 H0 Z"
              fill="url(#wave)"
              opacity="0.8"
            />
            <path
              d="M0 200 Q300 100 600 200 T1200 200 V400 H0 Z"
              fill="url(#wave)"
              opacity="0.4"
            />
          </svg>
        </div>

        {/* Features */}
        <section id="features" className="w-full max-w-5xl mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {["Personalized Paths", "Interactive Practice", "Real-time Feedback"].map((title, i) => (
            <Card key={title}>
              <CardContent className="py-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="text-primary mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-lg">{title}</h3>
                    <p className="text-muted-foreground text-sm mt-1">
                      {i === 0 && "AI curates content to your goals and skill level."}
                      {i === 1 && "Hands-on exercises and quizzes to retain knowledge."}
                      {i === 2 && "Instant insights so you learn faster and stay motivated."}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* Pricing */}
        <section id="pricing" className="w-full max-w-6xl mt-24 mb-20">
          <h2 className="font-bold text-3xl p-5 text-center">Select Plan</h2>
          <div className="mt-2">
            {process.env.NEXT_PUBLIC_STRIPE_PRICING_TABLE_ID && process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? (
              <PricingTable
                pricingTableId={process.env.NEXT_PUBLIC_STRIPE_PRICING_TABLE_ID}
                publishableKey={process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}
              />
            ) : (
              <PricingTable />
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="px-6 md:px-10 py-8 border-t border-border text-muted-foreground text-sm text-center">
        © {new Date().getFullYear()} Zyvera. All rights reserved.
      </footer>
    </div>
  );
}

export default Home;
