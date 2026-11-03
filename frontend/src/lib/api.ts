import type { Employee, EmployeeInput } from "../types/employee";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api"
).replace(/\/+$/, "");

export type AuthUser = {
  id: string;
  name: string;
  email: string;
};

class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

const request = async (path: string, options: RequestInit = {}) => {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const result = (await response.json()) as { message?: string };
    throw new ApiError(
      result.message ?? "The request could not be completed",
      response.status,
    );
  }

  return response;
};

export const getCurrentUser = async () => {
  const response = await request("/users/me");
  const result = (await response.json()) as { user: AuthUser };
  return result.user;
};

export const loginUser = async (email: string, password: string) => {
  const response = await request("/users/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  const result = (await response.json()) as { user: AuthUser };
  return result.user;
};

export const registerUser = async (
  name: string,
  email: string,
  password: string,
) => {
  await request("/users/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
};

export const logoutUser = async () => {
  await request("/users/logout", { method: "POST" });
};

export const getEmployees = async () => {
  const response = await request("/employees");
  const result = (await response.json()) as { employees: Employee[] };
  return result.employees;
};

export const addEmployee = async (employee: EmployeeInput) => {
  const response = await request("/employees", {
    method: "POST",
    body: JSON.stringify(employee),
  });
  const result = (await response.json()) as { employee: Employee };
  return result.employee;
};

export const updateEmployee = async (id: string, employee: EmployeeInput) => {
  const response = await request(`/employees/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(employee),
  });
  const result = (await response.json()) as { employee: Employee };
  return result.employee;
};

export const deleteEmployee = async (id: string) => {
  await request(`/employees/${encodeURIComponent(id)}`, { method: "DELETE" });
};

export { ApiError };
