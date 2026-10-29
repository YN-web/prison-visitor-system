-- CreateTable
CREATE TABLE `GateDutyAssignment` (
    `id` VARCHAR(191) NOT NULL,
    `staffId` VARCHAR(191) NOT NULL,
    `prisonId` VARCHAR(191) NOT NULL,
    `dutyDate` DATETIME(3) NOT NULL,
    `shift` ENUM('MORNING', 'AFTERNOON', 'NIGHT') NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `assignedById` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `GateDutyAssignment_staffId_dutyDate_idx`(`staffId`, `dutyDate`),
    INDEX `GateDutyAssignment_prisonId_dutyDate_idx`(`prisonId`, `dutyDate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `GateDutyAssignment` ADD CONSTRAINT `GateDutyAssignment_staffId_fkey` FOREIGN KEY (`staffId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GateDutyAssignment` ADD CONSTRAINT `GateDutyAssignment_prisonId_fkey` FOREIGN KEY (`prisonId`) REFERENCES `Prison`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
