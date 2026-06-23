// src/routes/inventory.routes.ts

import { Router } from 'express';
import { inventoryController } from '../controllers/inventory.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { roleMiddleware } from '../middleware/role.middleware';

const router = Router();

router.use(authMiddleware);

// ─── SPAREPARTS ────────────────────────────────────────────────────────────────

/**
 * @swagger
 * tags:
 *   name: Inventory - Spareparts
 *   description: Manajemen stok sparepart
 *
 * /inventory/spareparts:
 *   get:
 *     summary: Ambil semua sparepart
 *     tags: [Inventory - Spareparts]
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
 *         description: Cari berdasarkan nama, kode, atau merek
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [OLI_PELUMAS, FILTER, BRAKE, SUSPENSION, ENGINE, TRANSMISSION, ELECTRICAL, BODY, AC, TIRE_WHEEL, ACCESSORIES, CONSUMABLE, LAINNYA]
 *     responses:
 *       200:
 *         description: Daftar sparepart berhasil diambil
 */
router.get('/spareparts', (req, res, next) =>
  inventoryController.findAllSpareparts(req, res, next)
);

/**
 * @swagger
 * /inventory/spareparts/low-stock:
 *   get:
 *     summary: Ambil sparepart dengan stok rendah (di bawah minimum)
 *     tags: [Inventory - Spareparts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar sparepart stok rendah berhasil diambil
 */
router.get('/spareparts/low-stock', (req, res, next) =>
  inventoryController.getLowStock(req, res, next)
);

/**
 * @swagger
 * /inventory/spareparts/{id}:
 *   get:
 *     summary: Ambil sparepart berdasarkan ID
 *     tags: [Inventory - Spareparts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Data sparepart berhasil diambil
 *       404:
 *         description: Sparepart tidak ditemukan
 */
router.get('/spareparts/:id', (req, res, next) =>
  inventoryController.findSparepartById(req, res, next)
);

/**
 * @swagger
 * /inventory/spareparts:
 *   post:
 *     summary: Buat sparepart baru (Admin/Gudang)
 *     tags: [Inventory - Spareparts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [code, name, category, unit, buyPrice, sellPrice]
 *             properties:
 *               code:
 *                 type: string
 *                 example: SPR-001
 *               name:
 *                 type: string
 *                 example: Filter Oli Mesin
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *                 enum: [OLI_PELUMAS, FILTER, BRAKE, SUSPENSION, ENGINE, TRANSMISSION, ELECTRICAL, BODY, AC, TIRE_WHEEL, ACCESSORIES, CONSUMABLE, LAINNYA]
 *                 example: FILTER
 *               brand:
 *                 type: string
 *                 example: ACDelco
 *               unit:
 *                 type: string
 *                 example: PCS
 *               buyPrice:
 *                 type: number
 *                 example: 45000
 *               sellPrice:
 *                 type: number
 *                 example: 75000
 *               stockQuantity:
 *                 type: integer
 *                 default: 0
 *                 example: 50
 *               minStock:
 *                 type: integer
 *                 default: 5
 *                 example: 10
 *               maxStock:
 *                 type: integer
 *                 example: 100
 *               location:
 *                 type: string
 *                 example: Rak A-3
 *               supplierId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       201:
 *         description: Sparepart berhasil dibuat
 *       400:
 *         description: Validasi gagal atau kode sudah digunakan
 */
router.post(
  '/spareparts',
  roleMiddleware('ADMIN', 'GUDANG'),
  (req, res, next) => inventoryController.createSparepart(req, res, next)
);

/**
 * @swagger
 * /inventory/spareparts/{id}:
 *   put:
 *     summary: Update sparepart (Admin/Gudang)
 *     tags: [Inventory - Spareparts]
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
 *               sellPrice:
 *                 type: number
 *               minStock:
 *                 type: integer
 *               location:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Sparepart berhasil diupdate
 *       404:
 *         description: Sparepart tidak ditemukan
 */
router.put(
  '/spareparts/:id',
  roleMiddleware('ADMIN', 'GUDANG'),
  (req, res, next) => inventoryController.updateSparepart(req, res, next)
);

/**
 * @swagger
 * /inventory/spareparts/{id}:
 *   delete:
 *     summary: Hapus sparepart (Admin only)
 *     tags: [Inventory - Spareparts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Sparepart berhasil dihapus
 *       404:
 *         description: Sparepart tidak ditemukan
 */
router.delete(
  '/spareparts/:id',
  roleMiddleware('ADMIN'),
  (req, res, next) => inventoryController.deleteSparepart(req, res, next)
);

/**
 * @swagger
 * /inventory/spareparts/{id}/adjust:
 *   post:
 *     summary: Adjust stok sparepart (Admin/Gudang)
 *     tags: [Inventory - Spareparts]
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
 *             required: [type, quantity]
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [PURCHASE, ADJUSTMENT_IN, ADJUSTMENT_OUT, RETURN_SUPPLIER, INITIAL]
 *                 example: ADJUSTMENT_IN
 *               quantity:
 *                 type: integer
 *                 example: 20
 *               notes:
 *                 type: string
 *                 example: Restock dari supplier
 *               unitCost:
 *                 type: number
 *                 description: Harga beli per unit (untuk tipe PURCHASE)
 *     responses:
 *       200:
 *         description: Stok berhasil disesuaikan
 *       400:
 *         description: Stok tidak mencukupi (untuk ADJUSTMENT_OUT)
 */
router.post(
  '/spareparts/:id/adjust',
  roleMiddleware('ADMIN', 'GUDANG'),
  (req, res, next) => inventoryController.adjustStock(req, res, next)
);

/**
 * @swagger
 * /inventory/spareparts/{id}/movements:
 *   get:
 *     summary: Ambil riwayat pergerakan stok sparepart
 *     tags: [Inventory - Spareparts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *     responses:
 *       200:
 *         description: Riwayat pergerakan stok berhasil diambil
 */
router.get('/spareparts/:id/movements', (req, res, next) =>
  inventoryController.getStockMovements(req, res, next)
);

/**
 * @swagger
 * /inventory/stock-movements:
 *   get:
 *     summary: Ambil semua riwayat pergerakan stok
 *     tags: [Inventory - Spareparts]
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
 *         name: type
 *         schema:
 *           type: string
 *           enum: [PURCHASE, SALE, ADJUSTMENT_IN, ADJUSTMENT_OUT, RETURN_SUPPLIER, RETURN_CUSTOMER, TRANSFER, INITIAL]
 *     responses:
 *       200:
 *         description: Semua riwayat pergerakan stok berhasil diambil
 */
router.get('/stock-movements', (req, res, next) =>
  inventoryController.getAllStockMovements(req, res, next)
);

// ─── SUPPLIERS ─────────────────────────────────────────────────────────────────

/**
 * @swagger
 * tags:
 *   name: Inventory - Suppliers
 *   description: Manajemen data supplier sparepart
 *
 * /inventory/suppliers:
 *   get:
 *     summary: Ambil semua supplier
 *     tags: [Inventory - Suppliers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Cari berdasarkan nama atau kode
 *     responses:
 *       200:
 *         description: Daftar supplier berhasil diambil
 */
router.get('/suppliers', (req, res, next) =>
  inventoryController.findAllSuppliers(req, res, next)
);

/**
 * @swagger
 * /inventory/suppliers/{id}:
 *   get:
 *     summary: Ambil supplier berdasarkan ID
 *     tags: [Inventory - Suppliers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Data supplier berhasil diambil
 *       404:
 *         description: Supplier tidak ditemukan
 */
router.get('/suppliers/:id', (req, res, next) =>
  inventoryController.findSupplierById(req, res, next)
);

/**
 * @swagger
 * /inventory/suppliers:
 *   post:
 *     summary: Buat supplier baru (Admin/Gudang)
 *     tags: [Inventory - Suppliers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [code, name]
 *             properties:
 *               code:
 *                 type: string
 *                 example: SUP-002
 *               name:
 *                 type: string
 *                 example: PT. Sparepart Jaya
 *               contactPerson:
 *                 type: string
 *                 example: Pak Joko
 *               phone:
 *                 type: string
 *                 example: "021-12345678"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: joko@sparepartjaya.com
 *               address:
 *                 type: string
 *               city:
 *                 type: string
 *                 example: Jakarta Barat
 *               paymentTerms:
 *                 type: integer
 *                 description: Jangka waktu pembayaran dalam hari
 *                 default: 30
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Supplier berhasil dibuat
 */
router.post(
  '/suppliers',
  roleMiddleware('ADMIN', 'GUDANG'),
  (req, res, next) => inventoryController.createSupplier(req, res, next)
);

/**
 * @swagger
 * /inventory/suppliers/{id}:
 *   put:
 *     summary: Update supplier (Admin/Gudang)
 *     tags: [Inventory - Suppliers]
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
 *               contactPerson:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Supplier berhasil diupdate
 *       404:
 *         description: Supplier tidak ditemukan
 */
router.put(
  '/suppliers/:id',
  roleMiddleware('ADMIN', 'GUDANG'),
  (req, res, next) => inventoryController.updateSupplier(req, res, next)
);

/**
 * @swagger
 * /inventory/suppliers/{id}:
 *   delete:
 *     summary: Hapus supplier (Admin only)
 *     tags: [Inventory - Suppliers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Supplier berhasil dihapus
 *       404:
 *         description: Supplier tidak ditemukan
 */
router.delete(
  '/suppliers/:id',
  roleMiddleware('ADMIN'),
  (req, res, next) => inventoryController.deleteSupplier(req, res, next)
);

export default router;
