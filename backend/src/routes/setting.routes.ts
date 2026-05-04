// src/routes/setting.routes.ts

import { Router } from 'express';
import { settingController } from '../controllers/setting.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { roleMiddleware } from '../middleware/role.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/', settingController.getAll);
router.get('/group/:group', settingController.getByGroup);

// Only Admin can update settings
router.post('/', roleMiddleware('ADMIN'), settingController.update);
router.post('/bulk', roleMiddleware('ADMIN'), settingController.updateBulk);

export default router;
