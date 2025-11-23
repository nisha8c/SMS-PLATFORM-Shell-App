import { eventBus } from './eventBus';

export class ModuleLoadManager {
    private loadingModules: Set<string> = new Set();
    private loadedModules: Set<string> = new Set();
    private loadErrors: Map<string, Error> = new Map();
    private loadPromises: Map<string, Promise<void>> = new Map();

    // Load a module with race condition protection
    async loadModule(name: string, loader: () => Promise<any>): Promise<void> {
        // Already loaded
        if (this.loadedModules.has(name)) {
            return Promise.resolve();
        }

        // Currently loading - return existing promise
        if (this.loadingModules.has(name)) {
            return this.loadPromises.get(name)!;
        }

        // Start loading
        this.loadingModules.add(name);
        console.log(`[ModuleLoader] Loading ${name}...`);

        const loadPromise = loader()
            .then(() => {
                this.loadedModules.add(name);
                this.loadingModules.delete(name);
                eventBus.setModuleReady(name);
                console.log(`[ModuleLoader] ${name} loaded successfully`);
            })
            .catch((error) => {
                this.loadingModules.delete(name);
                this.loadErrors.set(name, error);
                console.error(`[ModuleLoader] Failed to load ${name}:`, error);
                throw error;
            });

        this.loadPromises.set(name, loadPromise);
        return loadPromise;
    }

    // Load multiple modules in parallel
    async loadModules(modules: Array<{ name: string; loader: () => Promise<any> }>): Promise<void> {
        await Promise.all(
            modules.map(({ name, loader }) => this.loadModule(name, loader))
        );
    }

    // Load modules with dependencies (ensures order)
    async loadWithDependencies(
        name: string,
        loader: () => Promise<any>,
        dependencies: string[] = []
    ): Promise<void> {
        // Wait for dependencies first
        const unmetDeps = dependencies.filter(dep => !this.loadedModules.has(dep));

        if (unmetDeps.length > 0) {
            await new Promise<void>((resolve, reject) => {
                const timeout = setTimeout(() => {
                    reject(new Error(`Timeout waiting for dependencies: ${unmetDeps.join(', ')}`));
                }, 30000);

                eventBus.whenAllReady(dependencies, () => {
                    clearTimeout(timeout);
                    resolve();
                });
            });
        }

        // Load the module
        return this.loadModule(name, loader);
    }

    isLoaded(name: string): boolean {
        return this.loadedModules.has(name);
    }

    isLoading(name: string): boolean {
        return this.loadingModules.has(name);
    }

    getError(name: string): Error | undefined {
        return this.loadErrors.get(name);
    }
}

export const moduleLoader = new ModuleLoadManager();