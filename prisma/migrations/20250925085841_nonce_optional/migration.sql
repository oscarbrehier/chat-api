/*
  Warnings:

  - You are about to drop the column `content` on the `Message` table. All the data in the column will be lost.
  - Added the required column `cipherText` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Message" DROP COLUMN "content",
ADD COLUMN     "cipherText" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "encryptedPrivateKey" TEXT,
ADD COLUMN     "encryptionNonce" TEXT,
ADD COLUMN     "encryptionSalt" TEXT,
ADD COLUMN     "publicKey" TEXT;
