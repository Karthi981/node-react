"use client";

import { useState } from "react";
import { useAuthStore } from "../store/authStore";

type LoginFormProps = {
  onSignUp: () => void;
};

const LoginForm = ({ onSignUp }: LoginFormProps) => {
  const { login, error } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(event.currentTarget);
    try {
      await login(
        String(formData.get("email")).trim(),
        String(formData.get("password")),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="w-full max-w-sm p-6">
      <form className="space-y-4" onSubmit={onSubmit}>
        <div>
          <h1 className="text-xl font-semibold">Sign in</h1>
          <p>Sign in to manage your employees.</p>
        </div>

        {error && <p role="alert">{error}</p>}

        <label className="block">
          Email
          <input
            className="mt-1 block w-full rounded border px-3 py-2"
            type="email"
            name="email"
            autoComplete="email"
            required
          />
        </label>
        <label className="block">
          Password
          <input
            className="mt-1 block w-full rounded border px-3 py-2"
            type="password"
            name="password"
            autoComplete="current-password"
            required
          />
        </label>
        <button
          className="w-full rounded border px-4 py-2"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Signing in..." : "Sign in"}
        </button>
        <button
          className="w-full px-4 py-2 underline"
          type="button"
          onClick={onSignUp}
        >
          Create an account
        </button>
      </form>
    </section>
  );
};

export default LoginForm;
