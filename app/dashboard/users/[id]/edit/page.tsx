import UserForm from "@/components/users/user-form";
import { fetchUser } from "@/lib/api";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Edit User",
  description: "Edit user information",
};
interface Params {
  id: string;
}

interface PageProps {
  params: Promise<Params>;
}
export default async function EditUserPage({ params }: PageProps) {
  const { id } = await params;
  if (!id) {
    return <div>User not found</div>;
  }
  const user = await fetchUser(String(id));

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">
            Edit User: {user.data.first_name} {user.data.last_name}
          </h1>
          <Link
            href="/dashboard/users"
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Back to Users
          </Link>
        </div>

        <div className="mt-4">
          <UserForm user={user.data} isEditing={true} />
        </div>
      </div>
    </div>
  );
}
