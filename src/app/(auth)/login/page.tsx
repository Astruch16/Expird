'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Lock, Mail, Loader2 } from 'lucide-react';
import { LogoAnimated } from '@/components/ui/logo';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push('/app/dashboard');
    router.refresh();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyber-blue/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyber-purple/20 rounded-full blur-3xl" />

      {/* Logo section - outside the card */}
      <div className="w-full max-w-md relative z-10 flex flex-col items-center">
        <div className="mb-6 flex flex-col items-center">
          <div className="relative">
            {/* Subtle glow behind logo */}
            <div className="absolute inset-0 bg-white/5 rounded-full blur-xl scale-150" />
            <LogoAnimated size="xl" />
          </div>
          <h1 className="mt-4 text-2xl font-bold bg-gradient-to-r from-cyber-blue to-cyber-purple bg-clip-text text-transparent tracking-widest">
            EXPIRD
          </h1>
          <p className="mt-1 text-muted-foreground text-sm">
            Track and manage expired MLS listings
          </p>
        </div>

        <Card className="w-full border-border/50 bg-card/80 backdrop-blur-xl">
          <CardContent className="pt-6">
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-input border-border focus:border-cyber-blue"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-input border-border focus:border-cyber-blue"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full btn-glow"
              disabled={loading}
            >
              <span className="relative z-10 flex items-center justify-center">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </span>
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-cyber-blue hover:underline font-medium cursor-pointer">
              Sign up
            </Link>
          </div>
        </CardContent>
        </Card>
      </div>
    </div>
  );
}
