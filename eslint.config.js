import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { globalIgnores } from "eslint/config";

export default tseslint.config(
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      // "recommended-latest" (rather than "recommended") includes the React
      // Compiler rules (purity, immutability, static-components, etc.) —
      // this project relies on the compiler for memoization, so those rules
      // are load-bearing, not optional strictness.
      reactHooks.configs.flat["recommended-latest"],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "FunctionDeclaration",
          message: "Use arrow functions instead of function declarations (project convention).",
        },
      ],
      // Permits a component file to also export a plain primitive constant
      // (string/number/boolean) alongside it -- Fast Refresh can preserve
      // state safely for those. It does NOT cover an object/enum-like
      // `as const` export (still warns) -- those need their own file, e.g.
      // BadgeKind.ts, IconName.ts.
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
    },
  },
  {
    // Fast Refresh doesn't apply to test files or test-only utilities --
    // Vitest never runs them through Vite's HMR.
    files: ["**/*.test.{ts,tsx}", "**/testUtils/**"],
    rules: {
      "react-refresh/only-export-components": "off",
    },
  }
);
