export type Employee = {
  id: string;
  name: string;
  email: string;
  designation: string;
  joiningDate: string;
};

export type EmployeeInput = Omit<Employee, "id">;
