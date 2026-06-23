// src/routes/notification.routes.ts

import { Router } from 'express';
import { notificationController } from '../controllers/notification.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: Notifikasi untuk user yang sedang login
 *
 * /notifications:
 *   get:
 *     summary: Ambil notifikasi milik user yang sedang login
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *       - in: query
 *         name: isRead
 *         schema: { type: boolean }
 *         description: Filter berdasarkan status baca (true = sudah dibaca, false = belum dibaca)
 *     responses:
 *       200:
 *         description: Daftar notifikasi berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                       type:
 *                         type: string
 *                         enum: [SERVICE_REMINDER, WORK_ORDER_UPDATE, PAYMENT_RECEIVED, LOW_STOCK, SYSTEM]
 *                       title:
 *                         type: string
 *                       message:
 *                         type: string
 *                       isRead:
 *                         type: boolean
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 */
router.get('/', notificationController.getMyNotifications);

/**
 * @swagger
 * /notifications/{id}/read:
 *   patch:
 *     summary: Tandai notifikasi sebagai sudah dibaca
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *         description: ID notifikasi yang akan ditandai sudah dibaca
 *     responses:
 *       200:
 *         description: Notifikasi berhasil ditandai sudah dibaca
 *       404:
 *         description: Notifikasi tidak ditemukan
 *       403:
 *         description: Notifikasi bukan milik user yang sedang login
 */
router.patch('/:id/read', notificationController.markAsRead);

export default router;
