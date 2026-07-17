"use client";

import { PageHeader, Panel } from "@/components/dashboard/widgets";
import { timetable } from "@/lib/mock/data";

export default function TimetablePage() {
  return (
    <div>
      <PageHeader title="My Timetable" subtitle="Week of May 19 – May 24, 2026" />

      <Panel>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-separate border-spacing-2 text-sm">
            <thead>
              <tr>
                <th className="w-24 text-left text-xs font-medium text-muted-foreground">
                  Time
                </th>
                {timetable.days.map((day) => (
                  <th key={day} className="text-left text-xs font-medium text-muted-foreground">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timetable.slots.map((slot) => (
                <tr key={slot.time}>
                  <td className="align-top text-xs text-muted-foreground">{slot.time}</td>
                  {slot.entries.map((entry, i) => (
                    <td key={i} className="align-top">
                      {entry ? (
                        <div className="rounded-lg bg-primary/10 px-3 py-2 text-xs font-medium text-primary">
                          {entry}
                        </div>
                      ) : (
                        <div className="h-9" />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
