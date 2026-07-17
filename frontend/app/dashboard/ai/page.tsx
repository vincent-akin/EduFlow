"use client";

import * as React from "react";
import {
  Sparkles,
  FileQuestion,
  NotebookPen,
  ClipboardCheck,
  Ruler,
  FileBarChart,
  Wand2,
  Loader2,
} from "lucide-react";

import { PageHeader, Panel } from "@/components/dashboard/widgets";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { aiTools, recentGenerations } from "@/lib/mock/data";

const toolIcons: Record<string, typeof FileQuestion> = {
  "question-generator": FileQuestion,
  "lesson-plan": NotebookPen,
  "marking-scheme": ClipboardCheck,
  "rubric-generator": Ruler,
  "report-generator": FileBarChart,
  "content-simplifier": Wand2,
};

export default function AiToolsPage() {
  const [selectedTool, setSelectedTool] = React.useState(aiTools[0].id);
  const [generating, setGenerating] = React.useState(false);
  const [result, setResult] = React.useState<string | null>(null);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    setResult(null);
    setTimeout(() => {
      setGenerating(false);
      setResult(
        "Generated content will appear here once the AI service is connected. Every generation is logged for teacher review before publishing."
      );
    }, 1200);
  };

  return (
    <div>
      <PageHeader
        title="AI Tools"
        subtitle="Generate questions, lesson plans, and more — you stay in control before anything publishes."
      />

      <Panel title="Choose a tool">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {aiTools.map((tool) => {
            const Icon = toolIcons[tool.id] ?? Sparkles;
            const isActive = selectedTool === tool.id;
            return (
              <button
                key={tool.id}
                onClick={() => setSelectedTool(tool.id)}
                className={cn(
                  "flex flex-col items-start gap-2 rounded-xl border p-4 text-left transition-colors",
                  isActive
                    ? "border-primary bg-primary/5"
                    : "border-border hover:bg-accent"
                )}
              >
                <span
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-lg",
                    isActive ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <p className="text-sm font-medium text-foreground">{tool.title}</p>
                <p className="text-xs text-muted-foreground">{tool.description}</p>
              </button>
            );
          })}
        </div>
      </Panel>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Panel title="Generate" className="lg:col-span-2">
          <form onSubmit={handleGenerate} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="subject">Subject</Label>
                <Select id="subject" defaultValue="mathematics">
                  <option value="mathematics">Mathematics</option>
                  <option value="english">English Language</option>
                  <option value="biology">Biology</option>
                  <option value="chemistry">Chemistry</option>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="class">Class</Label>
                <Select id="class" defaultValue="ss2">
                  <option value="jss1">JSS 1</option>
                  <option value="jss2">JSS 2</option>
                  <option value="ss1">SS 1</option>
                  <option value="ss2">SS 2</option>
                </Select>
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="topic">Topic / Chapter</Label>
                <Input id="topic" placeholder="e.g. Quadratic Equations" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="difficulty">Difficulty level</Label>
                <Select id="difficulty" defaultValue="medium">
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="count">Number of questions</Label>
                <Input id="count" type="number" min={1} max={50} defaultValue={10} />
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={generating}>
              {generating && <Loader2 className="h-4 w-4 animate-spin" />}
              Generate
            </Button>
          </form>

          {result && (
            <div className="mt-5 rounded-xl border border-border bg-secondary/40 p-4 text-sm text-foreground">
              {result}
            </div>
          )}
        </Panel>

        <Panel title="Recent Generations">
          <ul className="space-y-3">
            {recentGenerations.map((item) => (
              <li key={item.id} className="text-sm">
                <p className="text-foreground">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.time}</p>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
