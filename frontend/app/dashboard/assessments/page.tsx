"use client";

import * as React from "react";
import { Plus, Search, Loader2, RefreshCw } from "lucide-react";

import { PageHeader, Panel, StatusBadge } from "@/components/dashboard/widgets";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Alert } from "@/components/ui/alert";
import { CreateAssessmentDialog } from "@/components/dashboard/create-assessment-dialog";
import { useAuthStore } from "@/lib/store/auth-store";
import { useAssessments } from "@/lib/api/use-assessments";
import { ApiError } from "@/lib/api/client";

function statusLabel(status: string) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export default function AssessmentsPage() {
  const user = useAuthStore((state) => state.user);
  const canCreate = user?.role === "teacher" || user?.role === "school_admin";
  const [query, setQuery] = React.useState("");
  const [type, setType] = React.useState("all");
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const { data, isLoading, isError, error, refetch, isFetching } = useAssessments({
    type: type === "all" ? undefined : type,
  });

  const filtered = (data?.assessments ?? []).filter((a) =>
    a.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <PageHeader
        title="Assessments"
        subtitle="Tests, exams, assignments, and quizzes across your classes."
        action={
          canCreate ? (
            <Button size="sm" onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4" />
              Create New
            </Button>
          ) : undefined
        }
      />

      <Panel>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search assessments..."
              className="h-10 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <Select className="sm:w-44" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="all">All Types</option>
            <option value="test">Test</option>
            <option value="exam">Exam</option>
            <option value="assignment">Assignment</option>
            <option value="quiz">Quiz</option>
            <option value="practical">Practical</option>
          </Select>
          <button
            onClick={() => refetch()}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-input text-muted-foreground hover:bg-accent hover:text-foreground"
            aria-label="Refresh"
          >
            <RefreshCw className={isFetching ? "h-4 w-4 animate-spin" : "h-4 w-4"} />
          </button>
        </div>

        {isError && (
          <Alert className="mb-4">
            {error instanceof ApiError ? error.message : "Couldn't load assessments."}
          </Alert>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th className="pb-3 font-medium">Title</th>
                  <th className="pb-3 font-medium">Type</th>
                  <th className="pb-3 font-medium">Duration</th>
                  <th className="pb-3 font-medium">Pass mark</th>
                  <th className="pb-3 font-medium">Submissions</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((a) => (
                  <tr key={a._id} className="hover:bg-accent/50">
                    <td className="py-3 font-medium text-foreground">{a.title}</td>
                    <td className="py-3 capitalize text-muted-foreground">{a.type}</td>
                    <td className="py-3 text-muted-foreground">{a.durationMinutes} min</td>
                    <td className="py-3 text-muted-foreground">{a.passMark}%</td>
                    <td className="py-3 text-muted-foreground">
                      {a.submissionsCount ?? 0}/{a.totalStudents ?? "—"}
                    </td>
                    <td className="py-3">
                      <StatusBadge status={statusLabel(a.status)} />
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && !isError && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-muted-foreground">
                      No assessments found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      <CreateAssessmentDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </div>
  );
}
