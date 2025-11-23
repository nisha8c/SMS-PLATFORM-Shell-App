import React, { Component, type ReactNode } from 'react';

interface Props {
    moduleName: string;
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class MFEErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error(`[${this.props.moduleName}] Error:`, error, errorInfo);

        // Emit error event
        window.__SHELL_EVENT_BUS__?.emit('module:error', {
            module: this.props.moduleName,
            error: error.message,
        });
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback || (
                <div className="p-8 text-center">
                    <h2 className="text-xl font-bold text-destructive mb-2">
                        Failed to load {this.props.moduleName}
                    </h2>
                    <p className="text-muted-foreground">
                        {this.state.error?.message}
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded"
                    >
                        Reload Page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}