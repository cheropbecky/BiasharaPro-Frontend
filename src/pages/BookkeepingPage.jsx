import React, { useState, useEffect, useMemo } from 'react';
import {
  TrendingUp, TrendingDown, Wallet, Calendar, Download, Printer,
  FileSpreadsheet, PieChart, BarChart3, Package, DollarSign, Filter
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';
import OfflineBanner from '../components/OfflineBanner';
import useLang from '../hooks/useLang';
import useSidebar from '../hooks/useSidebar';
import { getReportsData, getSales, getExpenses, DB_CHANGE_EVENT } from '../db/sqlite';

export default function BookkeepingPage() {
  const { lang, t } = useLang();
  const { collapsed } = useSidebar();

  const [dateRange, setDateRange] = useState('all'); // today, week, month, all
  const [transactionType, setTransactionType] = useState('all'); // all, income, expense
  const [reports, setReports] = useState({
    totalRevenue: 0,
    totalCost: 0,
    grossProfit: 0,
    totalExpenses: 0,
    netProfit: 0,
    totalStockBuyValue: 0,
    totalStockSellValue: 0,
    potentialProfitInStock: 0,
    paymentBreakdown: { Cash: 0, 'M-Pesa': 0, Card: 0, Other: 0 },
    expenseByCategory: {},
    salesCount: 0,
    expensesCount: 0,
  });

  const [transactions, setTransactions] = useState([]);

  const loadReportData = async () => {
    try {
      const rep = await getReportsData();
      const sales = await getSales({ limit: 500 });
      const expenses = await getExpenses({ period: 'all' });

      setReports(rep);

      // Combine active sales and expenses into unified ledger
      const salesTx = sales
        .filter(s => s.status !== 'CANCELLED')
        .map(s => ({
          id: `sale-${s.id}`,
          date: s.created_at,
          description: `Mauzo: ${(s.items || []).map(i => `${i.product_name} x${i.qty}`).join(', ') || s.receipt_number}`,
          category: 'Mauzo',
          amount: Number(s.total_amount || 0),
          type: 'income',
          payment: s.payment_method || 'Cash',
          ref: s.mpesa_reference || s.receipt_number,
        }));

      const expTx = expenses.map(e => ({
        id: `exp-${e.id}`,
        date: e.created_at,
        description: e.description,
        category: e.category || 'Gharama',
        amount: Number(e.amount || 0),
        type: 'expense',
        payment: e.payment_method || 'Cash',
        ref: e.mpesa_reference || '',
      }));

      const combined = [...salesTx, ...expTx].sort((a, b) => new Date(b.date) - new Date(a.date));
      setTransactions(combined);
    } catch (err) {
      console.error('Failed to load reports data', err);
    }
  };

  useEffect(() => {
    loadReportData();
    const handler = () => loadReportData();
    window.addEventListener(DB_CHANGE_EVENT, handler);
    return () => window.removeEventListener(DB_CHANGE_EVENT, handler);
  }, []);

  // Filtered ledger by date and type
  const filteredLedger = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

    return transactions.filter(tx => {
      const d = (tx.date || '').slice(0, 10);
      if (dateRange === 'today' && d !== todayStr) return false;
      if (dateRange === 'week' && d < weekAgo) return false;
      if (dateRange === 'month' && d < monthAgo) return false;

      if (transactionType === 'income' && tx.type !== 'income') return false;
      if (transactionType === 'expense' && tx.type !== 'expense') return false;

      return true;
    });
  }, [transactions, dateRange, transactionType]);

  const handleExportCSV = () => {
    const headers = ['Date', 'Type', 'Description', 'Category', 'Amount (KES)', 'Payment Method', 'Reference'];
    const rows = filteredLedger.map(r => [
      r.date.slice(0, 16),
      r.type.toUpperCase(),
      `"${(r.description || '').replace(/"/g, '""')}"`,
      r.category,
      r.amount,
      r.payment,
      r.ref || ''
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `BiasharaPro_Bookkeeping_${dateRange}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="min-h-screen bg-[#eff5ef] text-[#171d19] relative"
      style={{
        fontFamily: '"Manrope", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <Sidebar />
      <TopBar />
      <BottomNav />

      <main className={`px-4 pb-24 pt-20 lg:px-8 ${collapsed ? 'lg:pl-20' : 'lg:pl-60'} lg:pb-12 transition-all duration-200 ease-in-out`}>
        <OfflineBanner />

        {/* Header */}
        <div className="mb-6 mt-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-[#171d19] lg:text-3xl">
              {lang === 'en' ? 'Bookkeeping & Financial Reports' : 'Vitabu vya Hesabu na Ripoti'}
            </h1>
            <p className="mt-1 text-sm text-[#3d4a42]">
              {lang === 'en'
                ? 'Track income, operating expenses, cost of goods, and real profit'
                : 'Muhtasari wa mauzo, gharama za bidhaa, na faida halisi ya duka'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 rounded-xl border border-[#bccac0] bg-white px-3.5 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 active:scale-95 transition"
            >
              <FileSpreadsheet className="h-4 w-4 text-emerald-700" />
              <span>Pakua CSV</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-xl bg-[#006948] px-3.5 py-2.5 text-xs font-bold text-white shadow hover:bg-[#00553a] active:scale-95 transition"
            >
              <Printer className="h-4 w-4" />
              <span>{lang === 'en' ? 'Print Report' : 'Chapisha'}</span>
            </button>
          </div>
        </div>

        {/* Date Filter Bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-3 border border-[#bccac0]/40 shadow-sm">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-gray-500 uppercase tracking-wider pl-1">
              Kipindi:
            </span>
            {[
              { id: 'all', label: lang === 'en' ? 'All Time' : 'Muda Wote' },
              { id: 'today', label: lang === 'en' ? 'Today' : 'Leo' },
              { id: 'week', label: lang === 'en' ? 'Last 7 Days' : 'Siku 7 Zilizopita' },
              { id: 'month', label: lang === 'en' ? 'This Month' : 'Mwezi Huu' },
            ].map(r => (
              <button
                key={r.id}
                onClick={() => setDateRange(r.id)}
                className={`rounded-xl px-3 py-1.5 font-bold transition ${
                  dateRange === r.id
                    ? 'bg-[#006948] text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          <div className="text-xs font-bold text-gray-500 pr-1">
            Miamala {filteredLedger.length}
          </div>
        </div>

        {/* 3 Core Financial Summary Cards */}
        <div className="mb-6 grid gap-4 lg:grid-cols-3">
          {/* Revenue */}
          <div className="rounded-3xl border-t-4 border-t-[#006948] bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  {lang === 'en' ? 'TOTAL SALES REVENUE' : 'JUMLA YA MAPATO YA MAUZO'}
                </p>
                <h2 className="mt-3 text-3xl font-black text-[#171d19]">
                  KSh {reports.totalRevenue.toLocaleString()}
                </h2>
                <p className="mt-2 text-xs font-semibold text-[#16a34a]">
                  Miamala {reports.salesCount} ya mauzo
                </p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-[#006948]">
                <TrendingUp className="h-6 w-6" />
              </div>
            </div>
          </div>

          {/* Operating Expenses */}
          <div className="rounded-3xl border-t-4 border-t-red-600 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  {lang === 'en' ? 'OPERATING EXPENSES' : 'GHARAMA ZA UENDESHAJI'}
                </p>
                <h2 className="mt-3 text-3xl font-black text-red-600">
                  KSh {reports.totalExpenses.toLocaleString()}
                </h2>
                <p className="mt-2 text-xs font-semibold text-red-500">
                  Matumizi {reports.expensesCount} (Umeme, Kodi, n.k.)
                </p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-100 text-red-600">
                <TrendingDown className="h-6 w-6" />
              </div>
            </div>
          </div>

          {/* Net Profit */}
          <div className="rounded-3xl border-t-4 border-t-blue-600 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  {lang === 'en' ? 'NET BUSINESS PROFIT' : 'FAIDA HALISI YA DUKA'}
                </p>
                <h2 className="mt-3 text-3xl font-black text-blue-700">
                  KSh {reports.netProfit.toLocaleString()}
                </h2>
                <p className="mt-2 text-xs font-semibold text-gray-500">
                  {reports.totalRevenue > 0
                    ? `Faida halisi: ${((reports.netProfit / reports.totalRevenue) * 100).toFixed(1)}%`
                    : 'Faida baada ya gharama zote'}
                </p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                <Wallet className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Profit & Loss Detailed Breakdown Card */}
        <div className="mb-6 rounded-3xl border border-[#bccac0]/40 bg-white p-6 shadow-sm">
          <h3 className="text-base font-extrabold text-[#171d19] mb-4">
            {lang === 'en' ? 'Profit & Loss Statement (P&L)' : 'Mchanganuo Kamili wa Faida na Hasara (P&L)'}
          </h3>

          <div className="space-y-3 font-mono text-xs sm:text-sm">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <span className="font-sans font-medium text-gray-700">1. Jumla ya Mauzo (Gross Sales):</span>
              <span className="font-bold text-[#006948]">KSh {reports.totalRevenue.toLocaleString()}</span>
            </div>

            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <span className="font-sans font-medium text-gray-700">2. Bei ya Kununua Bidhaa Zilizouzwa (COGS):</span>
              <span className="font-bold text-gray-600">- KSh {reports.totalCost.toLocaleString()}</span>
            </div>

            <div className="flex items-center justify-between border-b border-gray-200 pb-2 bg-emerald-50/50 p-2 rounded-xl">
              <span className="font-sans font-bold text-[#006948]">3. Faida ya Mauzo (Gross Profit = 1 - 2):</span>
              <span className="font-bold text-[#006948]">KSh {reports.grossProfit.toLocaleString()}</span>
            </div>

            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <span className="font-sans font-medium text-gray-700">4. Gharama za Uendeshaji Duka (Operating Expenses):</span>
              <span className="font-bold text-red-600">- KSh {reports.totalExpenses.toLocaleString()}</span>
            </div>

            <div className="flex items-center justify-between bg-blue-50/60 p-3 rounded-2xl font-sans text-sm sm:text-base font-black">
              <span className="text-blue-900">FAIDA HALISI YA BIASHARA (Net Business Profit):</span>
              <span className="text-blue-700">KSh {reports.netProfit.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Secondary Grid: Stock Valuation & Payment Methods */}
        <div className="mb-6 grid gap-6 lg:grid-cols-2">
          {/* Stock Valuation */}
          <div className="rounded-3xl border border-[#bccac0]/40 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-[#006948]">
                  <Package className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-extrabold text-[#171d19]">
                  {lang === 'en' ? 'Stock Valuation' : 'Thamani ya Stoki Dukan'}
                </h3>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between rounded-2xl bg-gray-50 p-3 text-xs">
                <span className="text-gray-600">Thamani kwa Bei ya Kununua (Cost Value):</span>
                <span className="font-bold text-[#171d19]">KSh {reports.totalStockBuyValue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between rounded-2xl bg-emerald-50/50 p-3 text-xs">
                <span className="text-[#006948]">Thamani kwa Bei ya Kuuza (Retail Value):</span>
                <span className="font-bold text-[#006948]">KSh {reports.totalStockSellValue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between rounded-2xl bg-blue-50/50 p-3 text-xs">
                <span className="text-blue-800 font-semibold">Faida Iliyopo Ndani ya Stoki:</span>
                <span className="font-black text-blue-700">KSh {reports.potentialProfitInStock.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Payment Methods Breakdown */}
          <div className="rounded-3xl border border-[#bccac0]/40 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-extrabold text-[#171d19] mb-4">
              {lang === 'en' ? 'Sales by Payment Method' : 'Mapato kwa Njia za Malipo'}
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-2xl bg-emerald-50 p-3 text-xs">
                <span className="font-bold text-[#006948]">Lipa na M-Pesa</span>
                <span className="font-black text-[#006948] text-sm">
                  KSh {(reports.paymentBreakdown['M-Pesa'] || 0).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-gray-50 p-3 text-xs">
                <span className="font-bold text-gray-700">Pesa Taslimu (Cash)</span>
                <span className="font-black text-gray-800 text-sm">
                  KSh {(reports.paymentBreakdown.Cash || 0).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-gray-50 p-3 text-xs">
                <span className="font-bold text-gray-700">Nyingine / Kadi</span>
                <span className="font-black text-gray-800 text-sm">
                  KSh {((reports.paymentBreakdown.Card || 0) + (reports.paymentBreakdown.Other || 0)).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Complete Transaction Ledger */}
        <div className="overflow-hidden rounded-3xl border border-[#bccac0]/40 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e5e7eb] px-6 py-4 bg-[#f9fafb]">
            <h3 className="text-sm font-extrabold text-[#171d19]">
              {lang === 'en' ? 'Transaction Ledger' : 'Daftari Kuu la Miamala (General Ledger)'}
            </h3>

            {/* Type Filters */}
            <div className="flex items-center gap-1.5 text-xs">
              {[
                { id: 'all', label: lang === 'en' ? 'All' : 'Zote' },
                { id: 'income', label: lang === 'en' ? 'Income (+)' : 'Mapato (+)' },
                { id: 'expense', label: lang === 'en' ? 'Expenses (-)' : 'Gharama (-)' },
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setTransactionType(opt.id)}
                  className={`rounded-full px-3 py-1 font-bold transition ${
                    transactionType === opt.id
                      ? 'bg-[#006948] text-white'
                      : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Desktop Ledger Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs text-[#171d19]">
              <thead className="border-b border-[#e5e7eb] bg-white text-[11px] font-bold uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-6 py-3.5">Tarehe / Saa</th>
                  <th className="px-4 py-3.5">Maelezo</th>
                  <th className="px-4 py-3.5">Jamii</th>
                  <th className="px-4 py-3.5">Njia ya Malipo</th>
                  <th className="px-4 py-3.5">Nambari / Ref</th>
                  <th className="px-6 py-3.5 text-right">Kiasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f3f4f6]">
                {filteredLedger.map(row => {
                  const isIncome = row.type === 'income';
                  return (
                    <tr key={row.id} className="hover:bg-gray-50/70 transition">
                      <td className="px-6 py-3.5 font-mono text-gray-500">
                        {new Date(row.date).toLocaleDateString()} {new Date(row.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-4 py-3.5 font-bold text-gray-900 max-w-xs truncate">
                        {row.description}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-bold ${isIncome ? 'bg-emerald-100 text-[#006948]' : 'bg-red-100 text-red-700'}`}>
                          {row.category}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-gray-600 font-medium">
                        {row.payment}
                      </td>
                      <td className="px-4 py-3.5 font-mono text-gray-400">
                        {row.ref || '—'}
                      </td>
                      <td className="px-6 py-3.5 text-right font-black text-sm" style={{ color: isIncome ? '#16a34a' : '#dc2626' }}>
                        {isIncome ? '+ ' : '- '}KSh {row.amount.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Ledger List */}
          <div className="divide-y divide-[#f3f4f6] md:hidden">
            {filteredLedger.map(row => {
              const isIncome = row.type === 'income';
              return (
                <div key={row.id} className="p-4 flex items-center justify-between">
                  <div className="pr-3">
                    <span className="text-[10px] font-mono text-gray-400 block">
                      {new Date(row.date).toLocaleDateString()} • {row.payment}
                    </span>
                    <h4 className="font-bold text-xs text-[#171d19] mt-0.5 line-clamp-1">{row.description}</h4>
                    <span className={`inline-block rounded px-1.5 py-0.2 text-[9px] font-bold mt-1 ${isIncome ? 'bg-emerald-100 text-[#006948]' : 'bg-red-100 text-red-700'}`}>
                      {row.category}
                    </span>
                  </div>

                  <div className="text-right shrink-0">
                    <span className={`text-sm font-black ${isIncome ? 'text-[#16a34a]' : 'text-red-600'}`}>
                      {isIncome ? '+ ' : '- '}KSh {row.amount.toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredLedger.length === 0 && (
            <div className="py-12 text-center text-gray-400 text-xs">
              Hakuna miamala katika kipindi hiki.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
