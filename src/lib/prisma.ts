import { PrismaClient } from "@prisma/client";

const prismaGlobal = global as typeof global & { prisma?: PrismaClient };

const prisma =
  prismaGlobal.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error"] : [],
  });

export default prisma;

if (process.env.NODE_ENV !== "production") prismaGlobal.prisma = prisma;
