
export const LoadPriority = {
    CRITICAL: 0,
    HIGH: 1,
    MEDIUM: 2,
    LOW: 3,
} as const;

export type LoadPriority = typeof LoadPriority[keyof typeof LoadPriority];


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
} as const;


export const preloadCriticalModules = async () => {
    const critical = Object.entries(MODULE_PRIORITIES)
        .filter(([_, priority]) => priority === LoadPriority.HIGH)
        .map(([name]) => name);

    console.log('[Preload] Loading critical modules:', critical);
    // Trigger preload logic here
};
