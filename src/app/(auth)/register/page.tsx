"use client";

import { useState } from "react";

import type React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User, Mail, Phone, Lock, ArrowRight, ArrowLeft } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (step === 1) {
      if (!formData.fullName || !formData.email || !formData.phone) {
        setError("Please fill in all fields");
        return;
      }
      setStep(2);
    } else {
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      if (formData.password.length < 8) {
        setError("Password must be at least 8 characters");
        return;
      }

      try {
        setLoading(true);
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            fullName: formData.fullName,
            phone: formData.phone,
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          setError(data.error || "Registration failed");
          return;
        }

        const data = await res.json();
        localStorage.setItem("token", data.token);
        router.push("/dashboard");
      } catch (err) {
        console.error("Register error:", err);
        setError("An error occurred during registration");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen  from-background to-muted flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 gap-0 shadow-lg">
        <h1 className="text-3xl font-bold ">Create Account</h1>
        <p className="text-muted-foreground mb-8">Step {step} of 2</p>

        {/* Progress Bar */}
        <div className="flex gap-2 mb-8">
          <div
            className={`h-1 flex-1 rounded-full ${
              step >= 1 ? "bg-primary" : "bg-border"
            }`}
          ></div>
          <div
            className={`h-1 flex-1 rounded-full ${
              step >= 2 ? "bg-primary" : "bg-border"
            }`}
          ></div>
        </div>

        {error && (
          <Alert className="border-red-200 bg-red-50 mb-4">
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          {step === 1 ? (
            <>
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User
                    className="absolute left-3 top-3 text-muted-foreground"
                    size={20}
                  />
                  <Input
                    placeholder="John Doe"
                    className="pl-10 h-11"
                    value={formData.fullName}
                    onChange={(e) =>
                      handleInputChange("fullName", e.target.value)
                    }
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-3 text-muted-foreground"
                    size={20}
                  />
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    className="pl-10 h-11"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone
                    className="absolute left-3 top-3 text-muted-foreground"
                    size={20}
                  />
                  <Input
                    placeholder="+880 1XXXXXXXXX"
                    className="pl-10 h-11"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Password */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-3 text-muted-foreground"
                    size={20}
                  />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="pl-10 h-11"
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-3 text-muted-foreground"
                    size={20}
                  />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="pl-10 h-11"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleInputChange("confirmPassword", e.target.value)
                    }
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="bg-primary/10 p-4 rounded-lg text-sm text-foreground">
                <p className="font-medium mb-2">Password requirements:</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>✓ At least 8 characters</li>
                  <li>✓ Mix of letters, numbers, and symbols</li>
                </ul>
              </div>
            </>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-3">
            {step === 2 && (
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="flex-1 bg-transparent"
                onClick={() => setStep(1)}
                disabled={loading}
              >
                <ArrowLeft className="mr-2" size={20} /> Back
              </Button>
            )}
            <Button
              type="submit"
              size="lg"
              className={`flex-1 bg-primary hover:bg-primary/90 ${
                step === 1 ? "col-span-2" : ""
              }`}
              disabled={loading}
            >
              {step === 1 ? "Next" : loading ? "Creating..." : "Create Account"}
              <ArrowRight className="ml-2" size={20} />
            </Button>
          </div>
        </form>

        {/* Login Link */}
        <div className="relative mt-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-card text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary">
                Sign In
              </Link>
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}
