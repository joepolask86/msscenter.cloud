'use client';

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Codesandbox, Loader2, Lock } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(username, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <h1 className="text-2xl font-bold text-center flex items-center justify-center gap-2">
        <Codesandbox className="!size-6 text-orange-600" />
        MSSCenter
      </h1>
      <Card className="text-center">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-xl">Welcome Back!</CardTitle>
          <CardDescription>
            Enter your username and password to access MSSCenter
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup className="gap-4">
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                  {error}
                </div>
              )}
              <Field>
                <FieldLabel htmlFor="username">Email Address/Username</FieldLabel>
                <Input
                  id="username"
                  type="text"
                  placeholder="admin or admin@example.com"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={loading}
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </Field>
              <Field>
                <Button type="submit" disabled={loading} className="w-full">
                  <Lock />
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {loading ? "Logging in..." : "Login"}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <p className="text-sm text-center mt-4 text-gray-500">
        Made with ❤️ by <a href="https://www.codelabgh.com" className="text-primary">Codelabgh</a>
      </p>
    </div>
  )
}