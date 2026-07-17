"use client";

import * as React from "react";
import { Check, Loader2 } from "lucide-react";

import { PageHeader, Panel } from "@/components/dashboard/widgets";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { roleLabel, type Role } from "@/lib/nav-config";
import { useAuthStore } from "@/lib/store/auth-store";

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const role = (user?.role ?? "teacher") as Role;

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [avatarUrl, setAvatarUrl] = React.useState<string | null>(null);
  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  React.useEffect(() => {
    return () => {
      if (avatarUrl) URL.revokeObjectURL(avatarUrl);
    };
  }, [avatarUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (avatarUrl) URL.revokeObjectURL(avatarUrl);
    setAvatarUrl(URL.createObjectURL(file));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    // No backend yet — simulate the round trip.
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }, 700);
  };

  return (
    <div>
      <PageHeader title="Profile & Settings" subtitle="Manage your personal information and preferences." />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Panel title="My Profile" className="lg:col-span-2">
          <div className="flex items-center gap-4">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarUrl}
                alt="Profile"
                className="h-16 w-16 rounded-full object-cover"
              />
            ) : (
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
                {user ? `${user.firstName[0]}${user.lastName[0]}` : "?"}
              </span>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              Update photo
            </Button>
          </div>

          <form onSubmit={handleSave}>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="firstName">First name</Label>
                <Input id="firstName" defaultValue={user?.firstName} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lastName">Last name</Label>
                <Input id="lastName" defaultValue={user?.lastName} />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue={user?.email} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" placeholder="+234 800 123 4567" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="role">Role</Label>
                <Input id="role" value={roleLabel[role]} disabled />
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                Save changes
              </Button>
              {saved && (
                <span className="flex items-center gap-1.5 text-sm text-success">
                  <Check className="h-4 w-4" />
                  Saved
                </span>
              )}
            </div>
          </form>
        </Panel>

        <Panel title="Quick Stats">
          <dl className="space-y-4 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Member since</dt>
              <dd className="font-medium text-foreground">Jan 10, 2024</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Last login</dt>
              <dd className="font-medium text-foreground">Today, 9:40 AM</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Account status</dt>
              <dd className="font-medium text-success">Active</dd>
            </div>
          </dl>
        </Panel>
      </div>
    </div>
  );
}
