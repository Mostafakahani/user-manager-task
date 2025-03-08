// components/users/user-card.tsx
import Image from "next/image";
import Link from "next/link";
import { User } from "@/types/user";

interface UserCardProps {
  user: User;
  onDelete: (id: number) => void;
}

export default function UserCard({ user, onDelete }: UserCardProps) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="relative flex-shrink-0 h-16 w-16">
            <Image
              src={user.avatar || ""}
              alt={`${user.first_name} ${user.last_name}`}
              fill
              className="rounded-full object-cover"
              sizes="64px"
            />
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900">
              {user.first_name} {user.last_name}
            </h3>
            <p className="text-sm text-gray-600">{user.email}</p>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-200 bg-gray-50 px-5 py-3 flex justify-between">
        <div>
          <Link
            href={`/dashboard/users/${user.id}`}
            className="text-sm font-medium text-blue-600 hover:text-blue-500 mr-4"
          >
            View
          </Link>
          <Link
            href={`/dashboard/users/${user.id}/edit`}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            Edit
          </Link>
        </div>
        <button
          onClick={() => onDelete(user.id)}
          className="text-sm font-medium text-red-600 hover:text-red-500"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
