
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Shield } from "lucide-react";
import { toast } from "sonner";

const ADMIN_PASSWORD = "lovemelikeyoudo";

const AdminLogin = () => {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simple password check
    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        // Store authentication in session storage (cleared when browser is closed)
        sessionStorage.setItem("adminAuthenticated", "true");
        toast.success("Login successful!");
        navigate("/admin");
      } else {
        toast.error("Incorrect password. Please try again.");
      }
      setIsLoading(false);
    }, 800); // Small delay to simulate verification
  };

  return (
    <div className="container py-12 animate-fade-in flex flex-col items-center justify-center min-h-[80vh]">
      <Card className="w-full max-w-md p-6">
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Admin Access</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Enter the password to access the admin dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Verifying..." : "Login"}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default AdminLogin;
