import react from '@vitejs/plugin-react'

import { defineConfig } from "vite";
import path from "path";
import federation from "@originjs/vite-plugin-federation";

import type { SharedConfig } from "@originjs/vite-plugin-federation";

type SharedConfigWithSingleton = SharedConfig & {
    singleton?: boolean;
};

type SharedWithSingleton = Record<string, SharedConfigWithSingleton>;


export default defineConfig({
    resolve: {
        preserveSymlinks: true,
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },

    },
    optimizeDeps: {
        exclude: ["shared-lib"]
    },
    server: {
        port: 3000,
        host: true,
        fs: {
            allow: [
                // 👇 allow the shell root (default)
                path.resolve(__dirname),

                // 👇 allow the shared-lib symlink target
                path.resolve(__dirname, "../shared-lib"),
            ]
        }
    },
    plugins: [
        react(),
        federation({
            name: "shell",
            remotes: {
                dashboard: "http://localhost:3001/assets/remoteEntry.js",
                contacts: "http://localhost:3002/assets/remoteEntry.js",
                companies: "http://localhost:3003/assets/remoteEntry.js",
                messages: "http://localhost:3004/assets/remoteEntry.js",
                workflows: "http://localhost:3005/assets/remoteEntry.js",
                monitoring: "http://localhost:3006/assets/remoteEntry.js",
                reports: "http://localhost:3007/assets/remoteEntry.js",
                configuration: "http://localhost:3008/assets/remoteEntry.js",
                admin: "http://localhost:3009/assets/remoteEntry.js",
                profile: "http://localhost:3010/assets/remoteEntry.js",
            },
            shared: {
                react: {
                    singleton: true,
                    requiredVersion: "^18.3.1",
                },

                "react-dom": {
                    singleton: true,
                    requiredVersion: "^18.3.1",
                },

                "react-router-dom": {
                    singleton: true,
                    requiredVersion: "^6.30.1",
                },
            } as SharedWithSingleton,

        }),
    ],
    build: {
        target: "esnext",
        minify: false,
        cssCodeSplit: false,
    },
});