"use client";

import { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { useEmployeeStore } from "../store/employeeStore";
import type { Employee } from "../types/employee";

type EmployeeTableProps = {
  onEdit: (employee: Employee) => void;
};

const EmployeeTable = ({ onEdit }: EmployeeTableProps) => {
  const { employees, isLoading, isSaving, error, deleteEmployee } =
    useEmployeeStore();

  const [pendingDelete, setPendingDelete] = useState<Employee | null>(null);

  const confirmDelete = async () => {
    if (pendingDelete) {
      const deleted = await deleteEmployee(pendingDelete.id);

      if (deleted) {
        setPendingDelete(null);
      }
    }
  };

  return (
    <div>
      {error && <p className="mb-4">{error}</p>}
      {isLoading ? (
        <p className="py-8 text-center">Loading employees...</p>
      ) : employees.length === 0 ? (
        <p className="border p-6 text-center">No employees</p>
      ) : (
        <div className="">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Designation</TableCell>
                <TableCell>Joining date</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>{employee.name}</TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>{employee.designation}</TableCell>
                  <TableCell>{employee.joiningDate}</TableCell>
                  <TableCell align="right">
                    <div className="flex justify-end gap-2">
                      <button
                        className="px-3 py-1"
                        onClick={() => onEdit(employee)}
                        disabled={isSaving}
                        type="button"
                      >
                        Edit
                      </button>
                      <button
                        className="rounded border px-3 py-1"
                        onClick={() => setPendingDelete(employee)}
                        disabled={isSaving}
                        type="button"
                      >
                        Delete
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      <Dialog
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
      >
        <DialogTitle>Delete employee?</DialogTitle>
        <DialogContent>Do you want to delete employee</DialogContent>
        <DialogActions>
          <button
            className=" border px-4 py-1"
            onClick={() => setPendingDelete(null)}
            disabled={isSaving}
            type="button"
          >
            Cancel
          </button>
          <button
            className="rounded border px-4 py-1"
            onClick={confirmDelete}
            disabled={isSaving}
            type="button"
          >
            {isSaving ? "Deleting..." : "Delete"}
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default EmployeeTable;
