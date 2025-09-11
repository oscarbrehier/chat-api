/// <reference types="astro/client" />

import type { JWTPayload } from "jose";

interface ImportMetaEnv {
  readonly API_HOST: string;
  readonly JWT_SECRET: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare global {
  namespace App {
    interface Locals extends Record<string, any> {
      user: JWTPayload | undefined
    }
  }
}