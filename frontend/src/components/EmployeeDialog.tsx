"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import type { Employee, EmployeeInput } from "../types/employee";

type EmployeeDialogProps = {
  open: boolean;
  employee: Employee | null;
  isSaving: boolean;
  onClose: () => void;
  onSave: (employee: EmployeeInput) => Promise<boolean>;
};

const EmployeeDialog = ({
  open,
  employee,
  isSaving,
  onClose,
  onSave,
}: EmployeeDialogProps) => {
  const [values, setValues] = useState<EmployeeInput>(() => ({
    name: employee?.name ?? "",
    email: employee?.email ?? "",
    designation: employee?.designation ?? "",
    joiningDate: employee?.joiningDate ?? "",
  }));

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const saved = await onSave(values);
    if (saved) {
      onClose();
    }
  };

  const changeValue = (event: ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{employee ? "Edit employee" : "Add employee"}</DialogTitle>
      <form onSubmit={submit}>
        <DialogContent className="space-y-4">
          <label className="block">
            Name
            <input
              className="mt-1 block w-full  border px-3 py-2"
              name="name"
              value={values.name}
              onChange={changeValue}
              required
            />
          </label>
          <label className="block">
            Email
            <input
              className="mt-1 block w-full  border px-3 py-2"
              type="email"
              name="email"
              value={values.email}
              onChange={changeValue}
              required
            />
          </label>
          <label className="block">
            Designation
            <input
              className="mt-1 block w-full  border px-3 py-2"
              name="designation"
              value={values.designation}
              onChange={changeValue}
              required
            />
          </label>
          <label className="block">
            Joining date
            <input
              className="mt-1 block w-full  border px-3 py-2"
              type="date"
              name="joiningDate"
              value={values.joiningDate}
              onChange={changeValue}
              required
            />
          </label>
        </DialogContent>
        <DialogActions className="px-6 pb-4">
          <button
            className="border px-4 py-2 cursor-pointer"
            onClick={onClose}
            disabled={isSaving}
            type="button"
          >
            Cancel
          </button>
          <button
            className="border px-4 py-2 bg-blue-500 text-white cursor-pointer"
            type="submit"
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EmployeeDialog;
