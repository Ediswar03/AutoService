// src/routes/part-request.routes.ts

import { Router } from 'express';
import { partRequestController } from '../controllers/part-request.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { roleMiddleware } from '../middleware/role.middleware';

const router = Router();

router.use(authMiddleware);

// Get all part requests
router.get('/', (req, res, next) => 
  partRequestController.findAll(req, res, next)
);

// Create part request
router.post('/',
  roleMiddleware('ADMIN', 'MEKANIK'),
  (req, res, next) => partRequestController.create(req, res, next)
);

// Get single part request
router.get('/:id', (req, res, next) => 
  partRequestController.findById(req, res, next)
);

// Approve part request
router.post('/:id/approve', 
  roleMiddleware('ADMIN', 'GUDANG'),
  (req, res, next) => partRequestController.approve(req, res, next)
);

// Reject part request
router.post('/:id/reject', 
  roleMiddleware('ADMIN', 'GUDANG'),
  (req, res, next) => partRequestController.reject(req, res, next)
);

export default router;
