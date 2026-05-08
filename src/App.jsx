import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';

import OnboardingPage from './pages/OnboardingPage';
import DashboardPage from './pages/DashboardPage';
import Dashboard2 from './pages/Dashboard2';
import Stock from './pages/Stock';
import Sales from './pages/Sales';
import ExpensesPage from './pages/ExpensesPage';
import Ledger from './pages/Ledger';
import DataModals from './pages/DataModals';
import AccountPage from './pages/AccountPage';
import AlertsPage from './pages/AlertsPage';
import OfflinePage from './pages/OfflinePage';
import InventoryPage from './pages/InventoryPage';
import BookkeepingPage from './pages/BookkeepingPage';

export default function App() {
	return (
		<Router>
			<AppShell />
		</Router>
	);
}


function AppShell() {
	const location = useLocation();

	if (location.pathname === '/' || location.pathname === '/dashboard') {
		return (
			<Routes>
				<Route path="/" element={<DashboardPage />} />
				<Route path="/dashboard" element={<DashboardPage />} />
			</Routes>
		);
	}

	if (location.pathname === '/onboarding') {
		return (
			<Routes>
				<Route path="/onboarding" element={<OnboardingPage />} />
			</Routes>
		);
	}

	return (
		<>
			<div className="min-h-screen bg-white text-gray-900">
				<nav className="p-4 border-b">
					<ul className="flex gap-4 flex-wrap">
						<li><Link to="/">Dashboard</Link></li>
						<li><Link to="/dashboard2">Dashboard 2</Link></li>
						<li><Link to="/stock">Stock</Link></li>
						<li><Link to="/sales">Sales</Link></li>
						<li><Link to="/expenses">Expenses</Link></li>
						<li><Link to="/ledger">Ledger</Link></li>
						<li><Link to="/data-modals">Data Modals</Link></li>
						<li><Link to="/account">Account</Link></li>
						<li><Link to="/alerts">Alerts</Link></li>
						<li><Link to="/inventory">Inventory</Link></li>
						<li><Link to="/bookkeeping">Bookkeeping</Link></li>
						<li><Link to="/offline">Offline</Link></li>
						<li><Link to="/onboarding">Onboarding</Link></li>
					</ul>
				</nav>

				<main className="p-6">
					<Routes>
						<Route path="/dashboard" element={<DashboardPage />} />
						<Route path="/dashboard2" element={<Dashboard2 />} />
						<Route path="/stock" element={<Stock />} />
						<Route path="/sales" element={<Sales />} />
						<Route path="/expenses" element={<ExpensesPage />} />
						<Route path="/ledger" element={<Ledger />} />
						<Route path="/data-modals" element={<DataModals />} />
						<Route path="/account" element={<AccountPage />} />
						<Route path="/alerts" element={<AlertsPage />} />
						<Route path="/inventory" element={<InventoryPage />} />
						<Route path="/bookkeeping" element={<BookkeepingPage />} />
						<Route path="/offline" element={<OfflinePage />} />
						<Route path="/onboarding" element={<OnboardingPage />} />
					</Routes>
				</main>
			</div>
		</>
	);
}
