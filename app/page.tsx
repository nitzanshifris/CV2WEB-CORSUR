import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, CheckCircle, FileText, Layout, Settings, Users } from "lucide-react";
import Link from "next/link";
import { CVForm } from "@/components/cv-form";
import { CVTemplates } from "@/components/cv-templates";
import { PublishOptions } from "@/components/publish-options";
import { WebsiteHosting } from "@/components/website-hosting";
import { ResumeUpload } from "@/components/resume-upload";
import { ParsedResume } from "@/utils/resume-parser";
import { useState } from "react";

export default function Home() {
  const [parsedResume, setParsedResume] = useState<ParsedResume | null>(null);

  const handleResumeParsed = (resume: ParsedResume) => {
    setParsedResume(resume);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
          צור אתר קורות חיים מקצועי בקלות
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mb-8">
          בנה אתר קורות חיים מרשים תוך דקות, ללא צורך בידע טכני. בחר תבנית, הוסף את התוכן שלך ופרסם.
        </p>
        <div className="flex gap-4">
          <Button size="lg" asChild>
            <Link href="/auth/signup">
              התחל עכשיו
              <ArrowRight className="mr-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/templates">
              צפה בתבניות
            </Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">למה לבחור בנו?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Layout className="h-12 w-12 text-primary mb-4" />
                <CardTitle>תבניות מוכנות</CardTitle>
                <CardDescription>
                  בחר מתוך מגוון תבניות מקצועיות ומותאמות אישית
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Settings className="h-12 w-12 text-primary mb-4" />
                <CardTitle>התאמה אישית קלה</CardTitle>
                <CardDescription>
                  ערוך את התוכן והעיצוב בקלות באמצעות ממשק ידידותי
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <FileText className="h-12 w-12 text-primary mb-4" />
                <CardTitle>ייצוא PDF</CardTitle>
                <CardDescription>
                  ייצא את קורות החיים שלך כקובץ PDF באיכות גבוהה
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">מוכן להתחיל?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            הצטרף עכשיו והתחל לבנות את אתר קורות החיים שלך
          </p>
          <Button size="lg" asChild>
            <Link href="/auth/signup">
              התחל עכשיו בחינם
              <ArrowRight className="mr-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      <ResumeUpload onResumeParsed={handleResumeParsed} />
      <CVForm initialData={parsedResume} />
      <CVTemplates />
      <PublishOptions />
      <WebsiteHosting />
    </div>
  );
} 