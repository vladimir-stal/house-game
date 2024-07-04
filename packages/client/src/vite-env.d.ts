/// <reference types="vite/client" />
/// <reference path="node_modules/phaser/types/index.d.ts" />

interface ImportMetaEnv {
    readonly VITE_CLIENT_ID: string;
    // add env variables here
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
