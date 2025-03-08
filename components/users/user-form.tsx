"use client";
import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, UserFormData } from "@/types/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createUserApi, updateUserApi } from "@/lib/api";
import { validateUserForm } from "@/lib/form-validation";
import {
  FormError,
  FormGlobalError,
  FormSuccess,
} from "@/components/ui/form-error";

interface UserFormProps {
  user?: User;
  isEditing?: boolean;
}

export default function UserForm({ user, isEditing = false }: UserFormProps) {
  const [formData, setFormData] = useState<UserFormData>({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    email: user?.email || "",
    avatar: user?.avatar || "",
    password: user?.password || "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        avatar: user.avatar || "",
        password: user.password,
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccess("");
    setErrors({});

    const validationResult = validateUserForm(formData);

    if (!validationResult.success) {
      setErrors(validationResult.errors || {});
      return;
    }

    setIsLoading(true);

    try {
      if (isEditing && user) {
        const response = await updateUserApi(
          user.id.toString(),
          validationResult.data!
        );
        if (response) {
          setSuccess("User updated successfully");
          router.refresh();
        }
      } else {
        const response = await createUserApi(validationResult.data!);
        if (response) {
          setSuccess("User created successfully");
          setFormData({
            first_name: "",
            last_name: "",
            email: "",
            avatar: "",
            password: "",
          });
          router.refresh();
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrors({ form: "Error submitting form. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">
          {isEditing ? "Edit User" : "Create New User"}
        </h2>

        <FormSuccess message={success} />
        <FormGlobalError error={errors.form} />

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-6 gap-6">
            <div className="col-span-6 sm:col-span-3">
              <label
                htmlFor="first_name"
                className="block text-sm font-medium text-gray-700"
              >
                First Name
              </label>
              <Input
                type="text"
                name="first_name"
                id="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
                className={`mt-1 ${errors.first_name ? "border-red-500" : ""}`}
              />
              <FormError error={errors.first_name} />
            </div>

            <div className="col-span-6 sm:col-span-3">
              <label
                htmlFor="last_name"
                className="block text-sm font-medium text-gray-700"
              >
                Last Name
              </label>
              <Input
                type="text"
                name="last_name"
                id="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
                className={`mt-1 ${errors.last_name ? "border-red-500" : ""}`}
              />
              <FormError error={errors.last_name} />
            </div>

            <div className="col-span-6 sm:col-span-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <Input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={`mt-1 ${errors.email ? "border-red-500" : ""}`}
              />
              <FormError error={errors.email} />
            </div>

            <div className="col-span-6 sm:col-span-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <Input
                type="password"
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                required={!isEditing}
                className={`mt-1 ${errors.password ? "border-red-500" : ""}`}
              />
              <FormError error={errors.password} />
            </div>

            <div className="col-span-6">
              <label
                htmlFor="avatar"
                className="block text-sm font-medium text-gray-700"
              >
                Profile Picture URL
              </label>
              <Input
                type="url"
                name="avatar"
                id="avatar"
                value={formData.avatar || ""}
                onChange={handleChange}
                placeholder="https://example.com/avatar.jpg"
                className={`mt-1 ${errors.avatar ? "border-red-500" : ""}`}
              />
              <FormError error={errors.avatar} />
              <p className="mt-1 text-sm text-gray-500">
                If left empty, a default image will be used
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              type="button"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="mr-3">
              {isLoading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              ) : isEditing ? (
                "Update User"
              ) : (
                "Create User"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
