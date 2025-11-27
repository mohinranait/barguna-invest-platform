import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Users, TrendingUp, Lock, Zap } from "lucide-react";
import Logo from "@/components/shared/Logo";

export default function Home() {
  return (
    <div className="min-h-screen from-background to-muted">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto">
        <Logo />
        <div className="flex gap-8 items-center">
          <Link
            href="#features"
            className="text-foreground hover:text-primary transition"
          >
            Features
          </Link>
          <Link
            href="/login"
            className="text-foreground hover:text-primary transition"
          >
            Login
          </Link>
          <Link href="/register">
            <Button className="bg-primary hover:bg-primary/90">Join Now</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 text-balance">
          Invest Together,
          <br />
          Grow Together
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          A transparent community platform where members pool investments, earn
          proportional profits, and build wealth collectively
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/auth/register">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Start Investing <ArrowRight className="ml-2" size={20} />
            </Button>
          </Link>
          <Button size="lg" variant="outline">
            Learn More
          </Button>
        </div>
      </div>

      {/* Features */}
      <div id="features" className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-center mb-16">
          Why Choose Barguna?
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 hover:shadow-lg transition">
            <Users className="text-primary mb-4" size={32} />
            <h3 className="text-lg font-semibold mb-2">Community Driven</h3>
            <p className="text-muted-foreground">
              Join up to 500 members in a trusted investment group
            </p>
          </Card>
          <Card className="p-6 hover:shadow-lg transition">
            <TrendingUp className="text-secondary mb-4" size={32} />
            <h3 className="text-lg font-semibold mb-2">Proportional Returns</h3>
            <p className="text-muted-foreground">
              Earn profits based on your investment ratio
            </p>
          </Card>
          <Card className="p-6 hover:shadow-lg transition">
            <Lock className="text-primary mb-4" size={32} />
            <h3 className="text-lg font-semibold mb-2">Transparent & Secure</h3>
            <p className="text-muted-foreground">
              Full KYC verification and real-time tracking
            </p>
          </Card>
          <Card className="p-6 hover:shadow-lg transition">
            <Zap className="text-secondary mb-4" size={32} />
            <h3 className="text-lg font-semibold mb-2">Easy Management</h3>
            <p className="text-muted-foreground">
              Simple deposits, withdrawals, and statements
            </p>
          </Card>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-primary/10 py-16">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-primary">500+</div>
            <p className="text-muted-foreground mt-2">Community Members</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-secondary">৳ 10M+</div>
            <p className="text-muted-foreground mt-2">Total Pooled Capital</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary">25%</div>
            <p className="text-muted-foreground mt-2">Average Annual Return</p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <Card className="p-12 bg-primary/5">
          <h3 className="text-3xl font-bold mb-4">Ready to Join?</h3>
          <p className="text-muted-foreground mb-8">
            Complete your profile and start investing within minutes
          </p>
          <Link href="/auth/register">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Register Now <ArrowRight className="ml-2" size={20} />
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
