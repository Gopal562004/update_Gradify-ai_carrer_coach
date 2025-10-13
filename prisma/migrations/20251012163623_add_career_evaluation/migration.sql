-- CreateTable
CREATE TABLE "CareerEvaluation" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "result" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CareerEvaluation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CareerEvaluation_userId_key" ON "CareerEvaluation"("userId");

-- AddForeignKey
ALTER TABLE "CareerEvaluation" ADD CONSTRAINT "CareerEvaluation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
