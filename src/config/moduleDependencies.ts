export const MODULE_DEPENDENCIES = {
    dashboard: [], // No dependencies
    contacts: ['dashboard'], // Needs dashboard to load first
    companies: ['contacts'], // Needs contacts
    messages: ['contacts'], // Needs contacts
    workflows: ['messages'], // Needs messages
    monitoring: ['dashboard'], // Needs dashboard
    reports: ['dashboard', 'monitoring'], // Needs dashboard and monitoring
    configuration: [], // No dependencies
    admin: ['configuration'], // Needs configuration
    profile: [], // No dependencies
};

export const getLoadOrder = (): string[] => {
    const loaded = new Set<string>();
    const order: string[] = [];

    const loadModule = (name: string) => {
        if (loaded.has(name)) return;

        const deps = MODULE_DEPENDENCIES[name as keyof typeof MODULE_DEPENDENCIES] || [];
        deps.forEach(dep => loadModule(dep));

        loaded.add(name);
        order.push(name);
    };

    Object.keys(MODULE_DEPENDENCIES).forEach(loadModule);
    return order;
};