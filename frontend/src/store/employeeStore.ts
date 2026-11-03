import { create } from "zustand";
import {
  addEmployee,
  deleteEmployee,
  getEmployees,
  updateEmployee,
} from "../lib/api";
import type { Employee, EmployeeInput } from "../types/employee";

type EmployeeStore = {
  employees: Employee[];

  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  loadEmployees: () => Promise<void>;
  addEmployee: (input: EmployeeInput) => Promise<boolean>;
  updateEmployee: (id: string, input: EmployeeInput) => Promise<boolean>;
  deleteEmployee: (id: string) => Promise<boolean>;
  clearEmployees: () => void;
};

const useEmployeeStore = create<EmployeeStore>((set) => ({
  employees: [],
  isLoading: false,
  isSaving: false,

  error: null,

  loadEmployees: async () => {
    set({ isLoading: true, error: null });
    try {
      const employees = await getEmployees();
      set({ employees });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Could not load employees",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  addEmployee: async (input) => {
    set({ isSaving: true, error: null });
    try {
      const employee = await addEmployee(input);
      set((state) => ({ employees: [employee, ...state.employees] }));
      return true;
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Could not add employee",
      });
      return false;
    } finally {
      set({ isSaving: false });
    }
  },

  updateEmployee: async (id, input) => {
    set({ isSaving: true, error: null });
    try {
      const employee = await updateEmployee(id, input);
      set((state) => ({
        employees: state.employees.map((item) =>
          item.id === id ? employee : item,
        ),
      }));
      return true;
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Could not update employee",
      });
      return false;
    } finally {
      set({ isSaving: false });
    }
  },

  deleteEmployee: async (id) => {
    set({ isSaving: true, error: null });
    try {
      await deleteEmployee(id);
      set((state) => ({
        employees: state.employees.filter((item) => item.id !== id),
      }));
      return true;
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Could not delete employee",
      });
      return false;
    } finally {
      set({ isSaving: false });
    }
  },

  clearEmployees: () => {
    set({ employees: [], error: null, isLoading: false, isSaving: false });
  },
}));

export { useEmployeeStore };
