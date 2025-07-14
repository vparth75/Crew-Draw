import { PrismaClient } from "@prisma/client";

export const prismaClient = new PrismaClient({
  omit: {
    user: {
      password: true
    }
  }
});