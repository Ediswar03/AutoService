// src/routes/service.routes.ts

import { Router } from 'express';
import { serviceController } from '../controllers/service.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { roleMiddleware } from '../middleware/role.middleware';

const router = Router();

router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Services
 *   description: Manajemen jenis layanan servis
 *
 * /services:
 *   get:
 *     summary: Ambil semua layanan servis
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Cari berdasarkan nama atau kode
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [SERVIS_BERKALA, PERBAIKAN_MESIN, PERBAIKAN_TRANSMISI, KELISTRIKAN, AC_COOLING, BODY_REPAIR, KAKI_KAKI, DETAILING, LAINNYA]
 *     responses:
 *       200:
 *         description: Daftar layanan berhasil diambil
 */
router.get('/', (req, res, next) =>
  serviceController.findAll(req, res, next)
);

/**
 * @swagger
 * /services/categories:
 *   get:
 *     summary: Ambil daftar kategori layanan
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar kategori layanan
 */
router.get('/categories', (req, res, next) =>
  serviceController.getCategories(req, res, next)
);

/**
 * @swagger
 * /services/{id}:
 *   get:
 *     summary: Ambil layanan berdasarkan ID
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Data layanan berhasil diambil
 *       404:
 *         description: Layanan tidak ditemukan
 */
router.get('/:id', (req, res, next) =>
  serviceController.findById(req, res, next)
);

/**
 * @swagger
 * /services:
 *   post:
 *     summary: Buat layanan baru (Admin only)
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [code, name, category, basePrice]
 *             properties:
 *               code:
 *                 type: string
 *                 example: SRV-005
 *               name:
 *                 type: string
 *                 example: Ganti Kampas Rem
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *                 enum: [SERVIS_BERKALA, PERBAIKAN_MESIN, PERBAIKAN_TRANSMISI, KELISTRIKAN, AC_COOLING, BODY_REPAIR, KAKI_KAKI, DETAILING, LAINNYA]
 *                 example: KAKI_KAKI
 *               basePrice:
 *                 type: number
 *                 example: 250000
 *               estimatedDuration:
 *                 type: integer
 *                 description: Estimasi waktu dalam menit
 *                 example: 60
 *     responses:
 *       201:
 *         description: Layanan berhasil dibuat
 *       400:
 *         description: Validasi gagal
 *       403:
 *         description: Forbidden - Hanya Admin
 */
router.post(
  '/',
  roleMiddleware('ADMIN'),
  (req, res, next) => serviceController.create(req, res, next)
);

/**
 * @swagger
 * /services/{id}:
 *   put:
 *     summary: Update layanan (Admin only)
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               basePrice:
 *                 type: number
 *               estimatedDuration:
 *                 type: integer
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Layanan berhasil diupdate
 *       404:
 *         description: Layanan tidak ditemukan
 */
router.put(
  '/:id',
  roleMiddleware('ADMIN'),
  (req, res, next) => serviceController.update(req, res, next)
);

/**
 * @swagger
 * /services/{id}:
 *   delete:
 *     summary: Hapus layanan (Admin only)
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Layanan berhasil dihapus
 *       404:
 *         description: Layanan tidak ditemukan
 */
router.delete(
  '/:id',
  roleMiddleware('ADMIN'),
  (req, res, next) => serviceController.delete(req, res, next)
);

export default router;
