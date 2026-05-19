import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import OnboardingPage from './pages/OnboardingPage';
import DashboardPage from './pages/DashboardPage';
import ExpensesPage from './pages/ExpensesPage';
import AccountPage from './pages/AccountPage';
import AlertsPage from './pages/AlertsPage';
import OfflinePage from './pages/OfflinePage';
import InventoryPage from './pages/InventoryPage';
import BookkeepingPage from './pages/BookkeepingPage';
import { NavigationProvider } from './components/navigation/NavigationProvider';

const ONBOARDING_COMPLETE_KEY = 'biasharapro_onboarding_complete';

function hasCompletedOnboarding() {
	if (typeof window === 'undefined') return false;
	return localStorage.getItem(ONBOARDING_COMPLETE_KEY) === 'true';
}

export default function App() {
	return (
		<Router>
			<NavigationProvider>
				<AppShell />
			</NavigationProvider>
		</Router>
	);
}


function AppShell() {
	const onboardingComplete = hasCompletedOnboarding();

	return (
			<main>
					<Routes>
						<Route path="/" element={<Navigate to={onboardingComplete ? '/dashboard' : '/onboarding'} replace />} />
						<Route
							path="/dashboard"
							element={onboardingComplete ? <DashboardPage /> : <Navigate to="/onboarding" replace />}
						/>
						<Route path="/expenses" element={<ExpensesPage />} />
						<Route path="/account" element={<AccountPage />} />
						<Route path="/alerts" element={<AlertsPage />} />
						<Route path="/inventory" element={<InventoryPage />} />
						<Route path="/bookkeeping" element={<BookkeepingPage />} />
						<Route path="/offline" element={<OfflinePage />} />
						<Route
							path="/onboarding"
							element={onboardingComplete ? <Navigate to="/dashboard" replace /> : <OnboardingPage />}
						/>
					</Routes>
			</main>
	);
}
