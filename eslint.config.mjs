import astro from "eslint-plugin-astro"
import js from "@eslint/js"
import tseslint from "typescript-eslint"
import prettier from "eslint-config-prettier"

export default tseslint.config(
    js.configs.recommended,
    ...tseslint.configs.recommended,
    ...astro.configs.recommended,
    prettier,
    {
        ignores: ["dist", "node_modules", ".astro", ".vscode"]
    },
    {
        files: ["**/*.astro"],
        languageOptions: {
            parser: astro.parser,
            parserOptions: {
                extraFileExtensions: [".astro"],
                parser: tseslint.parser
            }
        }
    }
)
