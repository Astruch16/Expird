import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Sidebar } from '@/components/layout/Sidebar';
import { Toaster } from '@/components/ui/sonner';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return (
    <div className="dark min-h-screen bg-background">
      <Sidebar
        user={{
          email: user.email || '',
          full_name: profile?.full_name,
        }}
      />
      <main className="pl-64 min-h-screen transition-all duration-300">
        <div className="p-6">
          {children}
        </div>
      </main>
      <Toaster />
    </div>
  );
}
