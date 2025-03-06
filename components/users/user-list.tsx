// components/users/user-list.tsx
"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { User } from "@/types/user";
import { fetchUsers, deleteUser } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface UserListProps {
  initialUsers: {
    data: User[];
    page: number;
    total_pages: number;
    per_page: number;
    total: number;
  };
}

export default function UserList({ initialUsers }: UserListProps) {
  const { data: session } = useSession();
  const [users, setUsers] = useState(initialUsers.data);
  const [page, setPage] = useState(initialUsers.page);
  const [totalPages, setTotalPages] = useState(initialUsers.total_pages);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedViewUser, setSelectedViewUser] = useState<User | null>(null);
  const router = useRouter();

  const loadUsers = async (pageNum: number) => {
    setIsLoading(true);
    try {
      const data = await fetchUsers(pageNum, (session as any)?.accessToken);
      setUsers(data.data);
      setPage(data.page);
      setTotalPages(data.total_pages);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      loadUsers(newPage);
    }
  };

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedUser) return;

    try {
      await deleteUser(
        selectedUser.id.toString(),
        (session as any)?.accessToken
      );
      setUsers(users.filter((user) => user.id !== selectedUser.id));
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleView = (user: User) => {
    setSelectedViewUser(user);
    setIsViewModalOpen(true);
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="relative">
        <div className="overflow-x-auto -mx-4 sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full align-middle px-4 sm:px-6 lg:px-8">
            <div className="overflow-hidden">
              {/* Desktop View */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              <Image
                                className="h-10 w-10 rounded-full"
                                src={user.avatar || "/default-avatar.png"}
                                alt={`${user.first_name} ${user.last_name}`}
                                width={40}
                                height={40}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="font-medium text-gray-900">
                                {user.first_name} {user.last_name}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleView(user)}
                            >
                              View
                            </Button>
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() =>
                                router.push(`/dashboard/users/${user.id}/edit`)
                              }
                            >
                              Edit
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete(user)}
                            >
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile View */}
              <div className="md:hidden space-y-4">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="bg-white p-4 rounded-lg shadow space-y-3"
                  >
                    <div className="flex items-center space-x-3">
                      <Image
                        className="h-10 w-10 rounded-full"
                        src={user.avatar || "/default-avatar.png"}
                        alt={`${user.first_name} ${user.last_name}`}
                        width={40}
                        height={40}
                      />
                      <div>
                        <div className="font-medium text-gray-900">
                          {user.first_name} {user.last_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleView(user)}
                      >
                        View
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() =>
                          router.push(`/dashboard/users/${user.id}/edit`)
                        }
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(user)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
        <div className="flex flex-1 justify-between sm:hidden">
          <Button
            variant="outline"
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1 || isLoading}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages || isLoading}
          >
            Next
          </Button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{users.length}</span> users
              of <span className="font-medium">{initialUsers.total}</span>{" "}
              results
            </p>
          </div>
          <div className="flex space-x-2">
            {[...Array(totalPages)].map((_, i) => (
              <Button
                key={i + 1}
                variant={page === i + 1 ? "default" : "outline"}
                onClick={() => handlePageChange(i + 1)}
                disabled={isLoading}
              >
                {i + 1}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Delete User
              </h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete {selectedUser?.first_name}{" "}
                  {selectedUser?.last_name}? This action cannot be undone.
                </p>
              </div>
              <div className="flex justify-center space-x-4 mt-4">
                <Button
                  variant="destructive"
                  onClick={confirmDelete}
                  disabled={isLoading}
                >
                  Delete
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsDeleteModalOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View User Dialog */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              <VisuallyHidden>User Details</VisuallyHidden>
              User Details
            </DialogTitle>
            <DialogDescription>
              Detailed information about the user
            </DialogDescription>
          </DialogHeader>
          {selectedViewUser && (
            <div className="grid gap-4 py-4">
              <div className="flex justify-center">
                <div className="h-24 w-24 relative">
                  <Image
                    src={selectedViewUser.avatar || "/default-avatar.png"}
                    alt={`${selectedViewUser.first_name} ${selectedViewUser.last_name}`}
                    className="rounded-full"
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-medium">First Name:</span>
                <span className="col-span-3">
                  {selectedViewUser.first_name}
                </span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-medium">Last Name:</span>
                <span className="col-span-3">{selectedViewUser.last_name}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-medium">Email:</span>
                <span className="col-span-3">{selectedViewUser.email}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-medium">User ID:</span>
                <span className="col-span-3">{selectedViewUser.id}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
