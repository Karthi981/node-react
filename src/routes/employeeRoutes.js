import express from 'express';
import {
  createEmployee,
  deleteEmployee,
  getEmployees,
  updateEmployee,
} from '../controllers/employeeController.js';
import requireAuth from '../middleware/requireAuth.js';

const router = express.Router();

router.use(requireAuth);
router.get('/', getEmployees);
router.post('/', createEmployee);
router.patch('/:id', updateEmployee);
router.delete('/:id', deleteEmployee);

export default router;