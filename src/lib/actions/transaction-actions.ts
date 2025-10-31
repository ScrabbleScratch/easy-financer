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

export async function getAllTransactions(userId: string) {
  const transactions = await prisma.transaction.findMany({
    where: {
      userId
    },
  });

  return transactions;
}

export async function getMonthlyTransactions(
  userId: string,
  year?: number,
  month?: number
) {
  // Use current date if year or month not specified
  const now = new Date();
  const targetYear = year ?? now.getFullYear();
  const targetMonth = month ?? now.getMonth() + 1; // getMonth() returns 0-11, we need 1-12

  // Calculate start of month in client's timezone, then convert to UTC
  const localStartOfMonth = new Date(targetYear, targetMonth - 1, 1, 0, 0, 0, 0);

  // Calculate start of next month
  const localStartOfNextMonth = new Date(targetYear, targetMonth, 1, 0, 0, 0, 0);

  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      date: {
        gte: localStartOfMonth,
        lt: localStartOfNextMonth,
      },
    },
    orderBy: {
      date: 'desc',
    },
  });

  return transactions;
}

export async function createTransaction(userId: string, type: TransactionType, amount: number, date?: Date, concept?: string|null) {
  const transaction = await prisma.transaction.create({
    data: {
      userId,
      amount,
      type,
      concept,
      date
    },
  });

  return transaction;
}