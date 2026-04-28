-- CreateTable
CREATE TABLE `part_requests` (
    `id` VARCHAR(191) NOT NULL,
    `order_number` VARCHAR(191) NOT NULL,
    `work_order_id` VARCHAR(191) NULL,
    `status` ENUM('PENDING', 'APPROVED', 'REJECTED', 'FULFILLED') NOT NULL DEFAULT 'PENDING',
    `requested_by` VARCHAR(191) NOT NULL,
    `approved_by` VARCHAR(191) NULL,
    `reject_reason` VARCHAR(191) NULL,
    `notes` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `part_requests_order_number_key`(`order_number`),
    INDEX `part_requests_work_order_id_idx`(`work_order_id`),
    INDEX `part_requests_requested_by_idx`(`requested_by`),
    INDEX `part_requests_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `part_request_items` (
    `id` VARCHAR(191) NOT NULL,
    `request_id` VARCHAR(191) NOT NULL,
    `sparepart_id` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `quantity_given` INTEGER NOT NULL DEFAULT 0,
    `notes` VARCHAR(191) NULL,

    INDEX `part_request_items_request_id_idx`(`request_id`),
    INDEX `part_request_items_sparepart_id_idx`(`sparepart_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `part_requests` ADD CONSTRAINT `part_requests_work_order_id_fkey` FOREIGN KEY (`work_order_id`) REFERENCES `work_orders`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `part_requests` ADD CONSTRAINT `part_requests_requested_by_fkey` FOREIGN KEY (`requested_by`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `part_requests` ADD CONSTRAINT `part_requests_approved_by_fkey` FOREIGN KEY (`approved_by`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `part_request_items` ADD CONSTRAINT `part_request_items_request_id_fkey` FOREIGN KEY (`request_id`) REFERENCES `part_requests`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `part_request_items` ADD CONSTRAINT `part_request_items_sparepart_id_fkey` FOREIGN KEY (`sparepart_id`) REFERENCES `spareparts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
