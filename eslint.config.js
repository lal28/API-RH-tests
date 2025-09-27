import js from "@eslint/js";
import prettierConfig from "eslint-config-prettier";
import globals from "globals";

export default [
  // Configuração base recomendada do ESLint
  js.configs.recommended,

  {
    // Arquivos da pasta routes que serão analisados
    files: ["src/routes/**/*.js", "src/index.js"],

    // Configurações de ambiente
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        // Variáveis globais do Node.js
        ...globals.node, //  Inclui todas as globals do Node.js
        ...globals.jest, //  Inclui globals do Jest para testes
      },
    },

    // Regras personalizadas
    rules: {
      // Regras de qualidade de código
      "no-unused-vars": "error",
      //"no-console": "warn", // não mostrar warnings para console.log
      "no-debugger": "error",

      // Regras de boas práticas
      "prefer-const": "error",
      "no-var": "error",
      eqeqeq: ["error", "always"], // Use === ao invés de ==

      // Regras específicas para APIs
      //"consistent-return": "error", // regra de consistencia do retorno das funções, desativado por enquanto
      "no-duplicate-imports": "error",

      // Regras de formatação
      semi: ["error", "always"],
      quotes: ["error", "double"],
      indent: ["error", 2],
    },
  },

  // Configuração do Prettier (desativa regras que conflitam)
  prettierConfig,

  {
    // Ignorar arquivos/pastas
    ignores: ["node_modules/", "dist/", "build/", "coverage/"],
  },
];
