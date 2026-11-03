"use client";

import { useState } from "react";
import { useAuthStore } from "../store/authStore";

type SignUpFormProps = {
  onSignIn: () => void;
};

const SignUpForm = ({ onSignIn }: SignUpFormProps) => {
  const { signUp, error } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [formError, setFormError] = useState("");

  const onSubmit = async (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setIsRegistered(false);
    setFormError("");
    const formData = new FormData(event.currentTarget);
    const password = String(formData.get("password"));
    if (password !== formData.get("confirmPassword")) {
      setFormError("Passwords do not match");
      setIsSubmitting(false);
      return;
    }

    try {
      const succeeded = await signUp(
        String(formData.get("name")).trim(),
        String(formData.get("email")).trim(),
        password,
      );
      setIsRegistered(succeeded);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="w-full max-w-sm p-6">
      <form className="space-y-4" onSubmit={onSubmit}>
        <div>
          <h1 className="text-xl font-semibold">Create account</h1>
        </div>

        {error && <p className="text-red-500">{error}</p>}
        {formError && (
          <p className="text-red-500" role="alert">
            {formError}
          </p>
        )}
        {isRegistered && (
          <p className="text-green-500">
            Account created. You can now sign in.
          </p>
        )}

        <label className="block">
          Name
          <input
            className="mt-1 block w-full rounded border px-3 py-2"
            name="name"
            autoComplete="name"
            required
          />
        </label>
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
            autoComplete="new-password"
            minLength={8}
            required
          />
        </label>
        <label className="block">
          Confirm password
          <input
            className="mt-1 block w-full rounded border px-3 py-2"
            type="password"
            name="confirmPassword"
            autoComplete="new-password"
            required
          />
        </label>
        <button
          className="w-full bg-blue-400 text-white px-4 py-2"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating account..." : "Create account"}
        </button>
        <button className="w-full px-4 py-2" type="button" onClick={onSignIn}>
          Already have an account? Sign in
        </button>
      </form>
    </section>
  );
};

export default SignUpForm;
