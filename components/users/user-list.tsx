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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export interface UserListProps {
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

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const data = await fetchUsers((session as any)?.accessToken);
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
      loadUsers();
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

      // Remove user from the local state
      setUsers(users.filter((user) => user.id !== selectedUser.id));
      setIsDeleteModalOpen(false);
      setSelectedUser(null);

      // Reload users to update pagination info
      loadUsers();
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
              <div className="md:hidden">
                <ul className="divide-y divide-gray-200">
                  {users.map((user) => (
                    <li key={user.id} className="py-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <Image
                            className="h-10 w-10 rounded-full"
                            src={user.avatar || "/default-avatar.png"}
                            alt={`${user.first_name} ${user.last_name}`}
                            width={40}
                            height={40}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {user.first_name} {user.last_name}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {user.email}
                          </p>
                        </div>
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
                            onClick={() => handleDelete(user)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6">
        <div className="flex flex-1 justify-between sm:hidden">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1 || isLoading}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages || isLoading}
          >
            Next
          </Button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing page <span className="font-medium">{page}</span> of{" "}
              <span className="font-medium">{totalPages}</span>
            </p>
          </div>
          <div>
            <nav
              className="isolate inline-flex -space-x-px rounded-md shadow-sm"
              aria-label="Pagination"
            >
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1 || isLoading}
              >
                Previous
              </Button>
              <div className="flex items-center px-4">
                <span className="text-sm text-gray-700">
                  {page} / {totalPages}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages || isLoading}
              >
                Next
              </Button>
            </nav>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تایید حذف کاربر</DialogTitle>
            <DialogDescription>
              آیا مطمئن هستید که می‌خواهید این کاربر را حذف کنید؟ این عمل قابل
              بازگشت نیست.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              لغو
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              حذف
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View User Dialog */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>اطلاعات کاربر</DialogTitle>
          </DialogHeader>
          {selectedViewUser && (
            <div className="grid gap-4 py-4">
              <div className="flex justify-center">
                <Image
                  className="h-24 w-24 rounded-full"
                  src={selectedViewUser.avatar || "/default-avatar.png"}
                  alt={`${selectedViewUser.first_name} ${selectedViewUser.last_name}`}
                  width={96}
                  height={96}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">نام</p>
                  <p className="text-sm text-gray-900">
                    {selectedViewUser.first_name}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    نام خانوادگی
                  </p>
                  <p className="text-sm text-gray-900">
                    {selectedViewUser.last_name}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium text-gray-500">ایمیل</p>
                  <p className="text-sm text-gray-900">
                    {selectedViewUser.email}
                  </p>
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
              بستن
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
