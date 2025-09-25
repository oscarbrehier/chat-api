/*
  Warnings:

  - You are about to drop the column `cipherText` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `encryptedPrivateKey` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `encryptionNonce` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `encryptionSalt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `publicKey` on the `User` table. All the data in the column will be lost.
  - Added the required column `content` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Message" DROP COLUMN "cipherText",
ADD COLUMN     "content" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "encryptedPrivateKey",
DROP COLUMN "encryptionNonce",
DROP COLUMN "encryptionSalt",
DROP COLUMN "publicKey";
