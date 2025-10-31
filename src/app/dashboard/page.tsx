"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAtomValue } from "jotai";

import { userState } from "@/atoms/user-state";

import { getAvailableFunds, getMonthlyTransactions } from "@/lib/actions/transaction-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Transaction, TransactionType } from "@/generated/prisma";

export default function DashboardHomePage() {
  const user = useAtomValue(userState);
  const [availableFunds, setAvailableFunds] = useState<number>(0);
  const [monthlyTransactions, setMonthlyTransactions] = useState<Transaction[]>([]);
  const [monthlyExpenses, setMonthlyExpenses] = useState(0);

  const handleGetFunds = async () => {
    if (!user.isAuthenticated) return;

    const total = await getAvailableFunds(user.id);
    setAvailableFunds(total);
  };

  const handleGetMonthlyTransactions = async () => {
    if (!user.isAuthenticated) return;

    // Get client's timezone offset in minutes
    const timezoneOffset = new Date().getTimezoneOffset();

    const transactions = await getMonthlyTransactions(user.id, undefined, undefined, timezoneOffset);
    setMonthlyTransactions(transactions);

    const expenses = transactions
      .filter(t => t.type === TransactionType.WITHDRAWAL)
      .reduce((acc, curr) => acc + curr.amount, 0);
    setMonthlyExpenses(expenses);
  };

  useEffect(() => {
    handleGetFunds();
    handleGetMonthlyTransactions();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center gap-6">
      <Card className="w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-xl font-bold">
            Available Funds
          </CardTitle>
          <CardDescription className="text-5xl font-bold text-emerald-600">
            ${availableFunds.toFixed(2)} 
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center font-bold flex flex-row">
          <div className="grow shrink basis-0">
            <h2>Monthly Expenses</h2>
            <p className="text-orange-700">${monthlyExpenses.toFixed(2)}</p>
          </div>
          <div className="grow shrink basis-0">
            <h2>Savings</h2>
            <p className="text-blue-500">$0.00</p>
          </div>
        </CardContent>
      </Card>
      <Link href="dashboard/transaction/add">
        <Button>
          Register Transaction
        </Button>
      </Link>
    </div>
  );
}