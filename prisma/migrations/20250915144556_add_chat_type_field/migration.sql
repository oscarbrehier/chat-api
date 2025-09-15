-- AlterTable
ALTER TABLE "public"."Chat" ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'dm';

-- CreateIndex
CREATE INDEX "User_name_idx" ON "public"."User"("name");
