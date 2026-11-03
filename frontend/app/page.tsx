"use client";

import { useEffect, useState } from "react";
import EmployeeDialog from "../src/components/EmployeeDialog";
import EmployeeTable from "../src/components/EmployeeTable";
import LoginForm from "../src/components/LoginForm";
import SignUpForm from "../src/components/SignUpForm";
import { useAuthStore } from "../src/store/authStore";
import { useEmployeeStore } from "../src/store/employeeStore";
import type { Employee } from "../src/types/employee";

export default function Home() {
  const {
    user,
    isChecking,
    error: authError,
    checkAuth,
    logout,
  } = useAuthStore();
  const {
    addEmployee,
    updateEmployee,
    isSaving,
    clearEmployees,
    loadEmployees,
  } = useEmployeeStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );
  const [showSignUp, setShowSignUp] = useState(false);

  useEffect(() => {
    void checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (user) {
      void loadEmployees();
    } else {
      clearEmployees();
    }
  }, [clearEmployees, loadEmployees, user]);

  const openCreateDialog = () => {
    setSelectedEmployee(null);
    setDialogOpen(true);
  };

  const openEditDialog = (employee: Employee) => {
    setSelectedEmployee(employee);
    setDialogOpen(true);
  };

  const saveEmployee = (input: Omit<Employee, "id">) =>
    selectedEmployee
      ? updateEmployee(selectedEmployee.id, input)
      : addEmployee(input);

  const closeDialog = () => {
    setDialogOpen(false);
    setSelectedEmployee(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch {}
  };

  if (isChecking) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        {showSignUp ? (
          <SignUpForm onSignIn={() => setShowSignUp(false)} />
        ) : (
          <LoginForm onSignUp={() => setShowSignUp(true)} />
        )}
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-8">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4 pb-4">
        <div>
          <h1 className="text-2xl font-semibold">Employees</h1>
        </div>
        <button className="px-4 py-2" onClick={handleLogout} type="button">
          Sign out
        </button>
      </header>

      {authError && <p className="mb-4">{authError}</p>}
      <section>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <button
            className="rounded border px-4 py-2"
            onClick={openCreateDialog}
            type="button"
          >
            Add employee
          </button>
        </div>
        <EmployeeTable onEdit={openEditDialog} />
      </section>
      {dialogOpen && (
        <EmployeeDialog
          open={dialogOpen}
          employee={selectedEmployee}
          isSaving={isSaving}
          onClose={closeDialog}
          onSave={saveEmployee}
        />
      )}
    </main>
  );
}
