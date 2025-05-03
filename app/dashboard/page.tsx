import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CVForm } from "@/components/cv-form";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push("/auth");
          return;
        }
        setUser(user);
      } catch (error) {
        console.error("Error fetching user:", error);
        router.push("/auth");
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [router, supabase.auth]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push("/auth");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">טוען...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">CV2Web</h1>
            </div>
            <div className="flex items-center">
              <Button variant="outline" onClick={handleSignOut}>
                התנתק
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <Card>
            <CardHeader>
              <CardTitle>יצירת קורות חיים</CardTitle>
              <CardDescription>
                מלא את הפרטים שלך כדי ליצור אתר קורות חיים אישי
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CVForm />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
} 