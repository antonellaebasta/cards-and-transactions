import type { ReactNode } from "react";

export type OverviewLayoutProps = {
  cardSelector: ReactNode;
  balanceSummary: ReactNode;
  filterBar: ReactNode;
  transactionList: ReactNode;
};

export const OverviewLayout = ({ cardSelector, balanceSummary, filterBar, transactionList }: OverviewLayoutProps) => (
  <main className="min-h-screen bg-bg p-s-4 md:p-s-7">
    <div className="mx-auto max-w-2xl">
      <h1 className="text-h1 font-semibold text-ink">Cards overview</h1>
      <section className="mt-s-6">{cardSelector}</section>
      <section className="mt-s-6">{balanceSummary}</section>
      <section className="mt-s-6">{filterBar}</section>
      <section className="mt-s-6">{transactionList}</section>
    </div>
  </main>
);
