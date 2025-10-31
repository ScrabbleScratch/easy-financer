"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAtomValue } from "jotai";

import { userState } from "@/atoms/user-state";

import { cn } from "@/lib/utils";
import { getAvailableFunds, getMonthlyTransactions } from "@/lib/actions/transaction-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Transaction, TransactionType } from "@/generated/prisma";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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

    const transactions = await getMonthlyTransactions(user.id);
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
      <Accordion type="single" className="w-xl px-4 shadow-md" collapsible>
        <AccordionItem value="history">
          <AccordionTrigger>Transactions history</AccordionTrigger>
          <AccordionContent>
            <Table>
              <TableHeader>
                <TableRow className="bg-neutral-50">
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Concept</TableHead>
                  <TableHead>Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {monthlyTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="p-8 text-center text-neutral-400">
                      No transactions found in the current month
                    </TableCell>
                  </TableRow>
                ) : monthlyTransactions.map((transaction, index) => (
                  <TableRow key={index}>
                    <TableCell>{transaction.date.toLocaleDateString()}</TableCell>
                    <TableCell
                      className={cn({
                        "text-emerald-600": transaction.type === TransactionType.DEPOSIT,
                        "text-orange-700": transaction.type === TransactionType.WITHDRAWAL,
                      })}
                    >
                      ${transaction.amount.toFixed(2)}
                    </TableCell>
                    <TableCell>{transaction.concept ?? "-"}</TableCell>
                    <TableCell
                      className={cn({
                        "text-emerald-600": transaction.type === TransactionType.DEPOSIT,
                        "text-orange-700": transaction.type === TransactionType.WITHDRAWAL,
                      })}
                    >
                      {transaction.type}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}