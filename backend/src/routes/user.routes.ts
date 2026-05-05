// src/routes/user.routes.ts

import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { roleMiddleware } from '../middleware/role.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/', (req, res, next) => userController.findAll(req, res, next));
router.get('/:id', (req, res, next) => userController.findById(req, res, next));
router.post('/', roleMiddleware('ADMIN'), (req, res, next) => userController.create(req, res, next));
router.put('/:id', roleMiddleware('ADMIN'), (req, res, next) => userController.update(req, res, next));
router.delete('/:id', roleMiddleware('ADMIN'), (req, res, next) => userController.delete(req, res, next));

export default router;
