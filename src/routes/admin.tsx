import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, useIsAdmin } from "@/hooks/useAuth";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — White Coffee House" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { isAdmin, checking } = useIsAdmin(user?.id);

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user && isAdmin) {
      navigate({ to: "/menu" });
    }
  }, [user, isAdmin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        toast.success("Account created. Ask an existing admin to grant you the admin role.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Signed in.");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out.");
  };

  if (loading || (user && checking)) {
    return (
      <Layout>
        <div className="mx-auto max-w-md px-6 py-24 text-center text-muted-foreground">Loading…</div>
      </Layout>
    );
  }

  if (user && !isAdmin) {
    return (
      <Layout>
        <section className="mx-auto max-w-md px-6 py-24 text-center">
          <h1 className="font-display text-3xl text-primary">Signed in</h1>
          <p className="mt-3 text-muted-foreground">
            Your account ({user.email}) doesn't have the admin role yet. Ask an existing admin to grant it
            from the Cloud dashboard.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button asChild variant="outline">
              <Link to="/menu">Back to menu</Link>
            </Button>
            <Button onClick={handleSignOut}>Sign out</Button>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="mx-auto max-w-md px-6 py-20">
        <h1 className="font-display text-3xl text-primary">{mode === "signin" ? "Admin sign in" : "Create admin account"}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage your menu categories and items.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" disabled={busy} className="w-full">
            {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          {mode === "signin" ? (
            <>
              First admin?{" "}
              <button type="button" onClick={() => setMode("signup")} className="font-medium text-primary hover:underline">
                Create an account
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button type="button" onClick={() => setMode("signin")} className="font-medium text-primary hover:underline">
                Sign in
              </button>
            </>
          )}
        </div>
      </section>
    </Layout>
  );
}
