// src/routes/vehicle.routes.ts

import { Router } from 'express';
import { vehicleController } from '../controllers/vehicle.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { roleMiddleware } from '../middleware/role.middleware';

const router = Router();

router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Vehicles
 *   description: Manajemen data kendaraan pelanggan
 *
 * /vehicles:
 *   get:
 *     summary: Ambil semua kendaraan
 *     tags: [Vehicles]
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
 *         description: Cari berdasarkan plat nomor, merek, atau model
 *       - in: query
 *         name: customerId
 *         schema: { type: string, format: uuid }
 *         description: Filter berdasarkan ID pelanggan
 *     responses:
 *       200:
 *         description: Daftar kendaraan berhasil diambil
 */
router.get('/', (req, res, next) =>
  vehicleController.findAll(req, res, next)
);

/**
 * @swagger
 * /vehicles/{id}:
 *   get:
 *     summary: Ambil kendaraan berdasarkan ID
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Data kendaraan berhasil diambil
 *       404:
 *         description: Kendaraan tidak ditemukan
 */
router.get('/:id', (req, res, next) =>
  vehicleController.findById(req, res, next)
);

/**
 * @swagger
 * /vehicles:
 *   post:
 *     summary: Buat kendaraan baru (Admin/Mekanik)
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [customerId, licensePlate, brand, model]
 *             properties:
 *               customerId:
 *                 type: string
 *                 format: uuid
 *                 example: "550e8400-e29b-41d4-a716-446655440000"
 *               licensePlate:
 *                 type: string
 *                 example: "B 1234 ABC"
 *               brand:
 *                 type: string
 *                 example: Toyota
 *               model:
 *                 type: string
 *                 example: Avanza
 *               vehicleType:
 *                 type: string
 *                 enum: [MOBIL, MOTOR, TRUCK, BUS, LAINNYA]
 *                 example: MOBIL
 *               year:
 *                 type: integer
 *                 example: 2022
 *               color:
 *                 type: string
 *                 example: Putih
 *               engineNumber:
 *                 type: string
 *                 example: EN123456
 *               vin:
 *                 type: string
 *                 example: VIN789012
 *               transmission:
 *                 type: string
 *                 example: Automatic
 *               fuelType:
 *                 type: string
 *                 example: Bensin
 *               lastOdometer:
 *                 type: integer
 *                 example: 50000
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Kendaraan berhasil dibuat
 *       400:
 *         description: Validasi gagal atau plat nomor sudah terdaftar
 */
router.post(
  '/',
  roleMiddleware('ADMIN', 'MEKANIK'),
  (req, res, next) => vehicleController.create(req, res, next)
);

/**
 * @swagger
 * /vehicles/{id}:
 *   put:
 *     summary: Update data kendaraan (Admin/Mekanik)
 *     tags: [Vehicles]
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
 *               brand:
 *                 type: string
 *               model:
 *                 type: string
 *               year:
 *                 type: integer
 *               color:
 *                 type: string
 *               lastOdometer:
 *                 type: integer
 *               notes:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Kendaraan berhasil diupdate
 *       404:
 *         description: Kendaraan tidak ditemukan
 */
router.put(
  '/:id',
  roleMiddleware('ADMIN', 'MEKANIK'),
  (req, res, next) => vehicleController.update(req, res, next)
);

/**
 * @swagger
 * /vehicles/{id}:
 *   delete:
 *     summary: Hapus kendaraan (Admin only)
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Kendaraan berhasil dihapus
 *       404:
 *         description: Kendaraan tidak ditemukan
 */
router.delete(
  '/:id',
  roleMiddleware('ADMIN'),
  (req, res, next) => vehicleController.delete(req, res, next)
);

/**
 * @swagger
 * /vehicles/{id}/history:
 *   get:
 *     summary: Ambil riwayat servis kendaraan
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Riwayat servis kendaraan berhasil diambil
 */
router.get('/:id/history', (req, res, next) =>
  vehicleController.getHistory(req, res, next)
);

export default router;
