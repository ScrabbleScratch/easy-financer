"use server";

import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function getUser(email: string) {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  return user;
}

export async function createUser(email: string) {
  const user = await prisma.user.create({
    data: {
      email,
    },
  });

  return user;
}