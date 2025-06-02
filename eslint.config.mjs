import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  // 1) Trae las reglas base de Next.js + TypeScript
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // 2) Bloque donde desactivas/rebajas las reglas conflictivas
  {
    rules: {
      // Desactiva el error por usar "any"
      "@typescript-eslint/no-explicit-any": "off",

      // Convierte "unused-vars" en warning (no detiene el build)
      "@typescript-eslint/no-unused-vars": "off",

      // Permite <img> en vez de obligarte a usar <Image />
      "@next/next/no-img-element": "off"
    }
  }
];
