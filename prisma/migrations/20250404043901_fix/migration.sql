/*
  Warnings:

  - The primary key for the `Tarjeta` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `descuentos` on the `Tarjeta` table. All the data in the column will be lost.
  - The `id` column on the `Tarjeta` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Tarjeta" DROP CONSTRAINT "Tarjeta_pkey",
DROP COLUMN "descuentos",
ADD COLUMN     "descuento" TEXT NOT NULL DEFAULT '10',
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Tarjeta_pkey" PRIMARY KEY ("id");
