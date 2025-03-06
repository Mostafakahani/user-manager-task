// app/dashboard/users/page.tsx
import { fetchUsers } from "@/lib/api";
import UserList from "@/components/users/user-list";
import { Metadata } from "next";
import Link from "next/link";
import { Input } from "@/components/ui/input";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Users Management",
  description: "Manage users in the admin dashboard",
};

export default async function UsersPage() {
  let initialUsers: any = { data: [] };

  try {
    initialUsers = await fetchUsers();
  } catch (error) {
    console.error("Error fetching users:", error);
    // در صورت خطا، با آرایه خالی ادامه می‌دهیم
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Users</h1>
          <Link
            href="/dashboard/users/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full sm:w-auto justify-center"
          >
            Add User
          </Link>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-4">
            <div className="flex flex-col gap-4">
              <div className="w-full">
                <label htmlFor="search" className="sr-only">
                  Search users
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <Input
                    type="search"
                    name="search"
                    id="search"
                    autoComplete="false"
                    className="!focus:ring-0 !ring-0 block w-full pl-10 sm:text-sm rounded-md !border-none !shadow-none"
                    placeholder="Search users... (Fake)"
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
                <select className="block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md w-full sm:w-auto">
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <button
                  type="button"
                  className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full sm:w-auto"
                >
                  <svg
                    className="-ml-1 mr-2 h-5 w-5 text-gray-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Filter
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* User List */}
        <div className="bg-white rounded-lg shadow">
          <UserList initialUsers={initialUsers} />
        </div>
      </div>
    </div>
  );
}
