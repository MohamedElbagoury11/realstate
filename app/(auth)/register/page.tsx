import { RegisterForm } from '@/components/auth/RegisterForm';
import React from 'react';

export const metadata = { title: 'Register' };

export default function RegisterPage() {
  return (
    <div>
      <h1 className="mb-6 text-center text-2xl font-bold">Create account</h1>
      <RegisterForm />
    </div>
  );
}
