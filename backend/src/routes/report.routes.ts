// src/routes/report.routes.ts

import { Router } from 'express';
import { reportController } from '../controllers/report.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { roleMiddleware } from '../middleware/role.middleware';

const router = Router();

router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Reports
 *   description: Laporan dan statistik bisnis
 *
 * /reports/dashboard:
 *   get:
 *     summary: Ambil statistik dashboard utama
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistik dashboard berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalWorkOrders:
 *                       type: integer
 *                     activeWorkOrders:
 *                       type: integer
 *                     completedToday:
 *                       type: integer
 *                     totalRevenue:
 *                       type: number
 *                     lowStockItems:
 *                       type: integer
 */
router.get('/dashboard', (req, res, next) =>
  reportController.getDashboard(req, res, next)
);

/**
 * @swagger
 * /reports/revenue:
 *   get:
 *     summary: Laporan pendapatan (Admin/Pimpinan)
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema: { type: string, format: date }
 *         example: "2026-01-01"
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema: { type: string, format: date }
 *         example: "2026-12-31"
 *     responses:
 *       200:
 *         description: Laporan pendapatan berhasil diambil
 *       403:
 *         description: Forbidden - Hanya Admin dan Pimpinan
 */
router.get(
  '/revenue',
  roleMiddleware('ADMIN', 'PIMPINAN'),
  (req, res, next) => reportController.getRevenue(req, res, next)
);

/**
 * @swagger
 * /reports/revenue-timeseries:
 *   get:
 *     summary: Grafik pendapatan berdasarkan waktu (Admin/Pimpinan)
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [daily, weekly, monthly]
 *           default: monthly
 *         example: monthly
 *       - in: query
 *         name: year
 *         schema: { type: integer }
 *         example: 2026
 *       - in: query
 *         name: startDate
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: endDate
 *         schema: { type: string, format: date }
 *     responses:
 *       200:
 *         description: Data time series pendapatan berhasil diambil
 */
router.get(
  '/revenue-timeseries',
  roleMiddleware('ADMIN', 'PIMPINAN'),
  (req, res, next) => reportController.getRevenueTimeSeries(req, res, next)
);

/**
 * @swagger
 * /reports/mechanics:
 *   get:
 *     summary: Laporan performa mekanik (Admin/Pimpinan)
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema: { type: string, format: date }
 *         example: "2026-01-01"
 *       - in: query
 *         name: endDate
 *         schema: { type: string, format: date }
 *         example: "2026-12-31"
 *     responses:
 *       200:
 *         description: Laporan performa mekanik berhasil diambil
 */
router.get(
  '/mechanics',
  roleMiddleware('ADMIN', 'PIMPINAN'),
  (req, res, next) =>
    reportController.getMechanicPerformance(req, res, next)
);

/**
 * @swagger
 * /reports/work-orders:
 *   get:
 *     summary: Statistik work order (Admin/Pimpinan)
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: endDate
 *         schema: { type: string, format: date }
 *     responses:
 *       200:
 *         description: Statistik work order berhasil diambil
 */
router.get(
  '/work-orders',
  roleMiddleware('ADMIN', 'PIMPINAN'),
  (req, res, next) =>
    reportController.getWorkOrderStats(req, res, next)
);

/**
 * @swagger
 * /reports/export:
 *   get:
 *     summary: Export laporan ke PDF atau Excel (Admin/Pimpinan)
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [revenue, work-orders, mechanics, inventory]
 *         example: revenue
 *       - in: query
 *         name: format
 *         required: true
 *         schema:
 *           type: string
 *           enum: [pdf, excel]
 *         example: pdf
 *       - in: query
 *         name: startDate
 *         schema: { type: string, format: date }
 *         example: "2026-01-01"
 *       - in: query
 *         name: endDate
 *         schema: { type: string, format: date }
 *         example: "2026-12-31"
 *     responses:
 *       200:
 *         description: File laporan berhasil di-generate
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 */
router.get(
  '/export',
  roleMiddleware('ADMIN', 'PIMPINAN'),
  (req, res, next) => reportController.exportReport(req, res, next)
);

export default router;
