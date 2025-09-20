-- CreateTable
CREATE TABLE "Book" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "isbn" TEXT NOT NULL,
    "pages" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Book_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Book_isbn_key" ON "Book"("isbn");
