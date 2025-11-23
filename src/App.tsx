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
import {MODULE_DEPENDENCIES} from "./config/moduleDependencies.ts";
import {moduleLoader} from "./lib/moduleLoader.ts";

const createLazyModule = (
    name: string,
    importer: () => Promise<any>
) => {
    const deps = MODULE_DEPENDENCIES[name as keyof typeof MODULE_DEPENDENCIES] || [];

    return lazy(() =>
        moduleLoader
            .loadWithDependencies(name, importer, deps)
            .then(() => importer())
    );
};


// Import remote micro frontends
const DashboardPage = createLazyModule("dashboard", () => import("dashboard/DashboardPage"));
const ContactsPage = createLazyModule("contacts", () => import("contacts/ContactsPage"));
const CompaniesPage = createLazyModule("companies", () => import("companies/CompaniesPage"));
const MessagesPage = createLazyModule("messages", () => import("messages/MessagesPage"));
const WorkflowsPage = createLazyModule("workflows", () => import("workflows/WorkflowsPage"));
const MonitoringPage = createLazyModule("monitoring", () => import("monitoring/MonitoringPage"));
const ReportsPage = createLazyModule("reports", () => import("reports/ReportsPage"));
const ConfigurationPage = createLazyModule("configuration", () => import("configuration/ConfigurationPage"));
const AdminPage = createLazyModule("admin", () => import("admin/AdminPage"));
const ProfilePage = createLazyModule("profile", () => import("profile/ProfilePage"));

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
        // Expose event bus globally for all MFEs
        window.__SHELL_EVENT_BUS__ = {
            setModuleReady: (name: string) => eventBus.setModuleReady(name),
            on: (event: string, callback: (data?: any) => void) => eventBus.on(event, callback),
            emit: (event: string, data?: any) => eventBus.emit(event, data),
            isModuleReady: (name: string) => eventBus.isModuleReady(name),
        };

        const unsubscribe = eventBus.on(EventTypes.MODULE_ERROR, (error) => {
            console.error('Module error:', error);
            // Show error toast or notification
        });

        return () => {
            unsubscribe();
            delete window.__SHELL_EVENT_BUS__;

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
