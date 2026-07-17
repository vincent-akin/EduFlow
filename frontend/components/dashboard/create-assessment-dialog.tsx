"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";

import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Alert } from "@/components/ui/alert";
import { ApiError } from "@/lib/api/client";
import { useCreateAssessment } from "@/lib/api/use-assessments";

export function CreateAssessmentDialog({
  open,
  onClose,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}) {
  const createAssessment = useCreateAssessment();
  const [title, setTitle] = React.useState("");
  const [type, setType] = React.useState("test");
  const [deliveryMode, setDeliveryMode] = React.useState("cbt");
  const [classId, setClassId] = React.useState("");
  const [subjectId, setSubjectId] = React.useState("");
  const [sessionId, setSessionId] = React.useState("");
  const [termId, setTermId] = React.useState("");
  const [durationMinutes, setDurationMinutes] = React.useState(30);
  const [passMark, setPassMark] = React.useState(40);
  const [startTime, setStartTime] = React.useState("");
  const [endTime, setEndTime] = React.useState("");

  const reset = () => {
    setTitle("");
    setType("test");
    setDeliveryMode("cbt");
    setClassId("");
    setSubjectId("");
    setSessionId("");
    setTermId("");
    setDurationMinutes(30);
    setPassMark(40);
    setStartTime("");
    setEndTime("");
    createAssessment.reset();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createAssessment.mutate(
      {
        title,
        type: type as never,
        deliveryMode: deliveryMode as never,
        classId,
        subjectId,
        sessionId,
        termId,
        durationMinutes,
        passMark,
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
      },
      {
        onSuccess: () => {
          reset();
          onClose();
          onSuccess?.();
        },
      }
    );
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        onClose();
        reset();
      }}
      title="Create assessment"
      description="Posts to POST /assessments as a draft."
      className="max-w-xl"
    >
      {createAssessment.isError && (
        <Alert className="mb-4">
          {createAssessment.error instanceof ApiError
            ? createAssessment.error.message
            : "Something went wrong. Please try again."}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="new-title">Title</Label>
          <Input
            id="new-title"
            placeholder="e.g. Mid-term Mathematics Test"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="new-type">Type</Label>
            <Select id="new-type" value={type} onChange={(e) => setType(e.target.value)}>
              <option value="test">Test</option>
              <option value="exam">Exam</option>
              <option value="assignment">Assignment</option>
              <option value="quiz">Quiz</option>
              <option value="practical">Practical</option>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="new-mode">Delivery mode</Label>
            <Select
              id="new-mode"
              value={deliveryMode}
              onChange={(e) => setDeliveryMode(e.target.value)}
            >
              <option value="cbt">CBT</option>
              <option value="printable">Printable</option>
            </Select>
          </div>
        </div>

        {/* classId/subjectId/sessionId/termId are plain ID inputs for now —
            swap these for real <Select> pickers once /classes, /subjects,
            and /academic-sessions are wired up (see lib/api for the pattern). */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="new-class">Class ID</Label>
            <Input
              id="new-class"
              placeholder="65f8a1b2c3d4e5f6a7b8c9d0"
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="new-subject">Subject ID</Label>
            <Input
              id="new-subject"
              placeholder="65f8a1b2c3d4e5f6a7b8c9d0"
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="new-session">Session ID</Label>
            <Input
              id="new-session"
              placeholder="65f8a1b2c3d4e5f6a7b8c9d0"
              value={sessionId}
              onChange={(e) => setSessionId(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="new-term">Term ID</Label>
            <Input
              id="new-term"
              placeholder="65f8a1b2c3d4e5f6a7b8c9d0"
              value={termId}
              onChange={(e) => setTermId(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="new-duration">Duration (minutes)</Label>
            <Input
              id="new-duration"
              type="number"
              min={1}
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="new-passmark">Pass mark</Label>
            <Input
              id="new-passmark"
              type="number"
              min={0}
              max={100}
              value={passMark}
              onChange={(e) => setPassMark(Number(e.target.value))}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="new-start">Start time</Label>
            <Input
              id="new-start"
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="new-end">End time</Label>
            <Input
              id="new-end"
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={createAssessment.isPending}>
          {createAssessment.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          Create assessment
        </Button>
      </form>
    </Dialog>
  );
}
