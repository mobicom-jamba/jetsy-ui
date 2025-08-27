"use client";

import RegisterForm from "@/components/Auth/RegisterForm";
import AuthLayout from "@/components/Layout/AuthLayout";

export default function RegisterPage() {
  return (
    <AuthLayout>
      <RegisterForm />
    </AuthLayout>
  );
}
