import Link from "next/link";
import {
  BookOpen,
  Sparkles,
  BarChart3,
  ClipboardCheck,
  Wrench,
  ArrowRight,
  FileQuestion,
  CheckCircle2,
} from "lucide-react";

import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { Button } from "@/components/ui/button";

const stats = [
  { value: "1,200+", label: "Schools" },
  { value: "50,000+", label: "Teachers" },
  { value: "450,000+", label: "Students" },
  { value: "2M+", label: "Assessments" },
];

const quickFeatures = [
  { icon: BookOpen, label: "Question Bank", description: "Thousands of curriculum-aligned questions" },
  { icon: Sparkles, label: "AI Assessments", description: "Generate tests and quizzes in seconds" },
  { icon: BarChart3, label: "Results & Analytics", description: "Track performance and get insights" },
  { icon: ClipboardCheck, label: "Lesson Plans", description: "AI-powered lesson plans and guides" },
  { icon: Wrench, label: "More Tools", description: "An all-in-one academic platform" },
];

const featureSections = [
  {
    title: "Build assessments in minutes, not hours",
    description:
      "Draw from a shared question bank to assemble CBT or printable assessments, then publish to the right class in one step.",
    icon: ClipboardCheck,
  },
  {
    title: "Let AI handle the first draft",
    description:
      "Generate questions, lesson plans, and marking schemes with AI — teachers always review and edit before anything goes live.",
    icon: Sparkles,
  },
  {
    title: "See performance the moment results publish",
    description:
      "Class, subject, and question-level analytics update automatically, so you catch learning gaps early.",
    icon: BarChart3,
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 pb-16 pt-16 sm:pt-20">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              AI-powered assessment platform
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl">
              Empower learning.{" "}
              <span className="text-primary">Inspire excellence.</span>
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
              AI-powered assessment and academic productivity platform for
              modern schools — from question creation to academic insight.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/register">Get Started Free</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="#features">Watch Demo</Link>
              </Button>
            </div>

            <dl className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd className="font-display text-xl font-bold text-foreground">
                    {stat.value}
                  </dd>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative">
            <div className="absolute -inset-8 -z-10 rounded-full bg-primary/10 blur-3xl" />
            <div className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between rounded-xl bg-secondary/60 px-4 py-3">
                <span className="flex items-center gap-2.5 text-sm font-medium text-foreground">
                  <FileQuestion className="h-4 w-4 text-primary" />
                  Photosynthesis MCQ (10 Questions)
                </span>
                <CheckCircle2 className="h-4 w-4 text-success" />
              </div>
              <div className="flex items-center justify-between rounded-xl bg-secondary/60 px-4 py-3">
                <span className="flex items-center gap-2.5 text-sm font-medium text-foreground">
                  <ClipboardCheck className="h-4 w-4 text-primary" />
                  SS 2A Mathematics Test — Published
                </span>
                <CheckCircle2 className="h-4 w-4 text-success" />
              </div>
              <div className="rounded-xl bg-primary/5 p-4">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Class average</span>
                  <span className="font-semibold text-foreground">78.4%</span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <div className="h-full w-[78%] rounded-full bg-primary" />
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-dashed border-border p-4">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Sparkles className="h-4 w-4" />
                </span>
                <p className="text-xs text-muted-foreground">
                  AI suggests reviewing <span className="font-medium text-foreground">Quadratic Equations</span> — 34% of SS 2A scored below 60%.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick feature strip */}
      <section id="features" className="border-y border-border bg-secondary/20 py-14">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-center text-sm font-medium text-muted-foreground">
            Everything you need to streamline assessments and improve learning outcomes
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {quickFeatures.map((f) => (
              <div
                key={f.label}
                className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-5 text-center"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <f.icon className="h-5 w-5" />
                </span>
                <p className="text-sm font-semibold text-foreground">{f.label}</p>
                <p className="text-xs text-muted-foreground">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature sections */}
      <section id="solutions" className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {featureSections.map((section) => (
            <div key={section.title}>
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <section.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold text-foreground">
                {section.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {section.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section id="pricing" className="mx-auto max-w-7xl px-6 pb-20">
        <div className="flex flex-col items-center gap-6 rounded-2xl bg-primary px-8 py-14 text-center text-primary-foreground sm:px-16">
          <h2 className="font-display text-3xl font-bold tracking-tight">
            Ready to transform assessment at your school?
          </h2>
          <p className="max-w-xl text-sm text-primary-foreground/80">
            Join over 1,200 schools already saving hours every week with
            EduFlow.
          </p>
          <Button asChild size="lg" variant="secondary">
            <Link href="/register">
              Get Started Free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
