"use client";
// import { Metadata } from "next";
import LoginForm from "@/components/auth/login-form";
import Image from "next/image";

// export const metadata: Metadata = {
//   title: "Login | User Management Dashboard",
//   description: "Login to the user management dashboard",
// };

export default function LoginPage() {
  //   const handleLogin = async (credentials: any) => {
  //     const response = await fetch("https://reqres.in/api/login", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         email: "eve.holt@reqres.in",
  //         password: "cityslicka",
  //       }),
  //     });

  //     const data = await response.json();
  //     console.log(data);
  //   };
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-20 h-20 relative">
            <Image
              src="/favicon.ico"
              alt="Dashboard Logo"
              fill
              priority
              className="object-contain"
            />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          User Management Dashboard
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sign in to access your dashboard
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
