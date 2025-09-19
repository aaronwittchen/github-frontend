/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string; // add your custom env vars here
  // readonly VITE_ANOTHER_VAR: string; // example
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
