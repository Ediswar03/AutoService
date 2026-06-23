// src/routes/customer.routes.ts

import { Router } from 'express';
import { customerController } from '../controllers/customer.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { roleMiddleware } from '../middleware/role.middleware';

const router = Router();

router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Customers
 *   description: Manajemen data pelanggan
 *
 * /customers:
 *   get:
 *     summary: Ambil semua pelanggan
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Cari berdasarkan nama, email, atau telepon
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [PRIBADI, KORPORAT]
 *     responses:
 *       200:
 *         description: Daftar pelanggan berhasil diambil
 */
router.get('/', (req, res, next) =>
  customerController.findAll(req, res, next)
);

/**
 * @swagger
 * /customers/{id}:
 *   get:
 *     summary: Ambil pelanggan berdasarkan ID
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *         example: "550e8400-e29b-41d4-a716-446655440000"
 *     responses:
 *       200:
 *         description: Data pelanggan berhasil diambil
 *       404:
 *         description: Pelanggan tidak ditemukan
 */
router.get('/:id', (req, res, next) =>
  customerController.findById(req, res, next)
);

/**
 * @swagger
 * /customers:
 *   post:
 *     summary: Buat pelanggan baru (Admin/Mekanik)
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, phone, type]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Budi Santoso
 *               phone:
 *                 type: string
 *                 example: "081234567890"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: budi@example.com
 *               address:
 *                 type: string
 *                 example: Jl. Merdeka No. 10, Jakarta
 *               type:
 *                 type: string
 *                 enum: [PRIBADI, KORPORAT]
 *                 example: PRIBADI
 *               companyName:
 *                 type: string
 *                 description: Wajib jika type = KORPORAT
 *               taxId:
 *                 type: string
 *                 description: NPWP perusahaan
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Pelanggan berhasil dibuat
 *       400:
 *         description: Validasi gagal
 */
router.post(
  '/',
  roleMiddleware('ADMIN', 'MEKANIK'),
  (req, res, next) => customerController.create(req, res, next)
);

/**
 * @swagger
 * /customers/{id}:
 *   put:
 *     summary: Update data pelanggan (Admin/Mekanik)
 *     tags: [Customers]
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
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               address:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [PRIBADI, KORPORAT]
 *               notes:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Pelanggan berhasil diupdate
 *       404:
 *         description: Pelanggan tidak ditemukan
 */
router.put(
  '/:id',
  roleMiddleware('ADMIN', 'MEKANIK'),
  (req, res, next) => customerController.update(req, res, next)
);

/**
 * @swagger
 * /customers/{id}:
 *   delete:
 *     summary: Hapus pelanggan (Admin only)
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Pelanggan berhasil dihapus
 *       404:
 *         description: Pelanggan tidak ditemukan
 */
router.delete(
  '/:id',
  roleMiddleware('ADMIN'),
  (req, res, next) => customerController.delete(req, res, next)
);

/**
 * @swagger
 * /customers/{id}/vehicles:
 *   get:
 *     summary: Ambil daftar kendaraan milik pelanggan
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Daftar kendaraan berhasil diambil
 *       404:
 *         description: Pelanggan tidak ditemukan
 */
router.get('/:id/vehicles', (req, res, next) =>
  customerController.getVehicles(req, res, next)
);

/**
 * @swagger
 * /customers/{id}/history:
 *   get:
 *     summary: Ambil riwayat servis pelanggan
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Riwayat servis berhasil diambil
 */
router.get('/:id/history', (req, res, next) =>
  customerController.getHistory(req, res, next)
);

export default router;
