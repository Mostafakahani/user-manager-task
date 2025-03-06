"use client";

import { Button } from "@/components/ui/button";
import { User } from "@/types/user";
import { useRouter } from "next/navigation";

interface UserActionsProps {
  user: User;
  onDelete?: (user: User) => void;
}

export function UserActions({ user, onDelete }: UserActionsProps) {
  const router = useRouter();

  return (
    <div className="flex space-x-2">
      <Button
        variant="secondary"
        size="sm"
        onClick={() => router.push(`/dashboard/users/${user.id}`)}
      >
        View
      </Button>
      <Button
        variant="default"
        size="sm"
        onClick={() => router.push(`/dashboard/users/${user.id}/edit`)}
      >
        Edit
      </Button>
      <Button variant="destructive" size="sm" onClick={() => onDelete?.(user)}>
        Delete
      </Button>
    </div>
  );
}
