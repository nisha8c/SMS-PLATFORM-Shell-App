import './App.css'

import {lazy, Suspense, useEffect} from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import {
    ThemeProvider,
    AuthProvider,
    TooltipProvider,
    Toaster,
    SonnerToaster
} from "shared-lib";
import { AppLayout } from "shared-lib";
import { Loader2 } from "lucide-react";
import {eventBus, EventTypes} from "./lib/eventBus.ts";

// Import remote micro frontends
const DashboardPage = lazy(() => import("dashboard/DashboardPage"));
const ContactsPage = lazy(() => import("contacts/ContactsPage"));
const CompaniesPage = lazy(() => import("companies/CompaniesPage"));
const MessagesPage = lazy(() => import("messages/MessagesPage"));
const WorkflowsPage = lazy(() => import("workflows/WorkflowsPage"));
const MonitoringPage = lazy(() => import("monitoring/MonitoringPage"));
const ReportsPage = lazy(() => import("reports/ReportsPage"));
const ConfigurationPage = lazy(() => import("configuration/ConfigurationPage"));
const AdminPage = lazy(() => import("admin/AdminPage"));
const ProfilePage = lazy(() => import("profile/ProfilePage"));

const ModuleLoader = () => (
    <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading module...</p>
        </div>
    </div>
);

function App() {
    useEffect(() => {
        // Initialize event bus listeners
        const unsubscribe = eventBus.on(EventTypes.MODULE_ERROR, (error) => {
            console.error('Module error:', error);
            // Show error toast or notification
        });

        return () => {
            unsubscribe();
        };
    }, []);
    return (
        <ThemeProvider>
            <AuthProvider>
                <TooltipProvider>
                    <Toaster />
                    <SonnerToaster />
                    <BrowserRouter>
                        <AppLayout>
                            <Suspense fallback={<ModuleLoader />}>
                                <Routes>
                                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                                    <Route path="/dashboard" element={<DashboardPage />} />
                                    <Route path="/contacts" element={<ContactsPage />} />
                                    <Route path="/companies" element={<CompaniesPage />} />
                                    <Route path="/messages" element={<MessagesPage />} />
                                    <Route path="/workflows" element={<WorkflowsPage />} />
                                    <Route path="/monitoring" element={<MonitoringPage />} />
                                    <Route path="/reports" element={<ReportsPage />} />
                                    <Route path="/configuration" element={<ConfigurationPage />} />
                                    <Route path="/admin" element={<AdminPage />} />
                                    <Route path="/profile" element={<ProfilePage />} />
                                </Routes>
                            </Suspense>
                        </AppLayout>
                    </BrowserRouter>
                </TooltipProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
