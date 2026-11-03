import mongoose from 'mongoose';
import Employee from '../models/Employee.js';

const getEmployeeInput = (body) => {
  const name = typeof body?.name === 'string' ? body.name.trim() : '';
  const email =
    typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
  const designation =
    typeof body?.designation === 'string' ? body.designation.trim() : '';
  const joiningDate =
    typeof body?.joiningDate === 'string' ? body.joiningDate : '';
  const parsedDate = new Date(`${joiningDate}T00:00:00.000Z`);

  if (
    !name ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    !designation ||
    !/^\d{4}-\d{2}-\d{2}$/.test(joiningDate) ||
    Number.isNaN(parsedDate.getTime()) ||
    parsedDate.toISOString().slice(0, 10) !== joiningDate
  ) {
    return null;
  }

  return { name, email, designation, joiningDate: parsedDate };
};

const serializeEmployee = (employee) => ({
  id: employee.id,
  name: employee.name,
  email: employee.email,
  designation: employee.designation,
  joiningDate: employee.joiningDate.toISOString().slice(0, 10),
});

const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({ createdBy: req.auth.userId }).sort({
      createdAt: -1,
    });

    return res.status(200).json({ employees: employees.map(serializeEmployee) });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const createEmployee = async (req, res) => {
  const employeeInput = getEmployeeInput(req.body);

  if (!employeeInput) {
    return res.status(400).json({ message: 'Invalid employee details' });
  }

  try {
    const employee = await Employee.create({
      ...employeeInput,
      createdBy: req.auth.userId,
    });

    return res.status(201).json({ employee: serializeEmployee(employee) });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({ message: 'Employee email already exists' });
    }

    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const updateEmployee = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: 'Invalid employee ID' });
  }

  const employeeInput = getEmployeeInput(req.body);

  if (!employeeInput) {
    return res.status(400).json({ message: 'Invalid employee details' });
  }

  try {
    const employee = await Employee.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.auth.userId },
      employeeInput,
      { new: true, runValidators: true }
    );

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    return res.status(200).json({ employee: serializeEmployee(employee) });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({ message: 'Employee email already exists' });
    }

    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteEmployee = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: 'Invalid employee ID' });
  }

  try {
    const employee = await Employee.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.auth.userId,
    });

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    return res.status(201).json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export { createEmployee, deleteEmployee, getEmployees, updateEmployee };
