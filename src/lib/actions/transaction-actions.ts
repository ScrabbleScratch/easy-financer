"use server";

import { PrismaClient, TransactionType } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function getAvailableFunds(userId: string) {
  const transactions = await prisma.transaction.groupBy({
    by: ["type"],
    where: {
      userId
    },
    _sum: {
      amount: true,
    },
  });

  const deposits = transactions.find(t => t.type === "DEPOSIT")?._sum.amount || 0;
  const withdrawals = transactions.find(t => t.type === "WITHDRAWAL")?._sum.amount || 0;

  return deposits - withdrawals;
}

export async function getUserTransactions(userId: string) {
  const transactions = await prisma.transaction.findMany({
    where: {
      userId
    },
  });

  return transactions;
}

export async function createTransaction(userId: string, type: TransactionType, amount: number, concept?: string|null) {
  const transaction = await prisma.transaction.create({
    data: {
      userId,
      amount,
      type,
      concept,
    },
  });

  return transaction;
}