
export enum LoadPriority {
    CRITICAL = 0,  // Must load first (auth, shell)
    HIGH = 1,      // User-facing features (dashboard)
    MEDIUM = 2,    // Secondary features (contacts, companies)
    LOW = 3,       // Admin/config features
}

export const MODULE_PRIORITIES = {
    dashboard: LoadPriority.HIGH,
    contacts: LoadPriority.MEDIUM,
    companies: LoadPriority.MEDIUM,
    messages: LoadPriority.MEDIUM,
    workflows: LoadPriority.MEDIUM,
    monitoring: LoadPriority.HIGH,
    reports: LoadPriority.LOW,
    configuration: LoadPriority.LOW,
    admin: LoadPriority.LOW,
    profile: LoadPriority.MEDIUM,
};

export const preloadCriticalModules = async () => {
    const critical = Object.entries(MODULE_PRIORITIES)
        .filter(([_, priority]) => priority === LoadPriority.HIGH)
        .map(([name]) => name);

    console.log('[Preload] Loading critical modules:', critical);
    // Trigger preload logic here
};