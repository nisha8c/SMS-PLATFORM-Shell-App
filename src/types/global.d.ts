export {};

declare global {
    interface Window {
        __SHELL_EVENT_BUS__?: {
            setModuleReady: (name: string) => void;
            on: (event: string, callback: (data?: any) => void) => () => void;
            emit: (event: string, data?: any) => void;
            isModuleReady: (name: string) => boolean;
        };
    }
}
