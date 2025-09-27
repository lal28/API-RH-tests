# API-RH-tests 🧪

## 📋 Descrição

Este projeto implementa uma suíte completa de **testes automatizados** para a [API-RH](https://github.com/lal28/API-RH), uma API que gerencia operações CRUD (Create, Read, Update, Delete) de usuários/funcionários.

Os testes foram desenvolvidos aplicando diferentes técnicas de **análise funcional** e **caixa-preta**, garantindo a qualidade e confiabilidade da API através de:

- **Testes de Particionamento de Equivalência** (CREATE)
- **Testes de Análise de Valor Limite** (READ)  
- **Testes de Caixa-Preta** (UPDATE)
- **Testes End-to-End** (Fluxo completo CRUD)
- **Testes de Verificação vs Validação** (DELETE)

## 🚀 Como Executar

### Pré-requisitos
- **Node.js** (versão 14 ou superior)
- **npm** ou **yarn**
- **Git**

### Passo a passo

1. **Clone o repositório:**
```bash
git clone https://github.com/seu-usuario/API-RH-tests.git
cd API-RH-tests
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Execute os testes:**
```bash
# Executar todos os testes
npm test

# Executar testes em modo watch (desenvolvimento)
npm run test:watch

# Executar testes com cobertura de código
npm run test:coverage

# Verificar qualidade do código
npm run code:check

# Corrigir problemas de formatação automaticamente
npm run code:fix
```

4. **Iniciar a API (se necessário):**
```bash
npm start
```

A API ficará disponível em `http://localhost:3000`

### Resultado Esperado
```
Tests: 36 passed, 36 total
Time: ~10-15 segundos
```

## 🎯 Testes Implementados

| Técnica | Endpoint | Valida | Resultado Esperado |
|---------|----------|--------|-------------------|
| **Particionamento** | `POST /users` | Dados válidos/inválidos | ✅ 201 / ❌ 400 |
| **Valor Limite** | `GET /users/:id` | IDs extremos | ✅ 200 / ❌ 404 |
| **Caixa-Preta** | `PUT /users/:id` | Atualização | ✅ Preserva campos |
| **End-to-End** | Todos | Fluxo CRUD | ✅ Integração completa |
| **Verificação** | `DELETE /users/:id` | Deleção precisa | ✅ Remove apenas correto |

## 🔍 Interpretando Resultados

```bash
✓ teste passou (15 ms)    # Sucesso
✗ teste falhou           # Falha - verificar mensagem
```

## 📁 Estrutura do Projeto

```
API-RH-tests/
├── .prettierignore            # Arquivos ignorados pelo Prettier
├── .prettierrc                # Configuração do Prettier
├── eslint.config.js           # Configuração do ESLint
├── package-lock.json          # Lock das versões das dependências
├── package.json               # Dependências e scripts do projeto
├── README.md                  # Documentação do projeto
└── src/
    ├── data.js                # Dados mockados para desenvolvimento
    ├── helpers/
    │   └── testSetup.js       # Utilitários e dados fictícios para testes
    ├── index.js               # Configuração principal da aplicação Express
    ├── routes/
    │   ├── swagger.route.js   # Rotas para documentação Swagger
    │   └── users.js           # Rotas CRUD com validações implementadas
    ├── swagger.json           # Especificação da API em formato OpenAPI
    └── __tests__/
        └── users.test.js      # Suíte completa de testes automatizados
```


## 🛠️ Tecnologias Utilizadas

### **Framework de Testes**
- **Jest** - Framework de testes JavaScript
- **Supertest** - Testes de integração HTTP
- **@faker-js/faker** - Geração de dados fictícios

### **Qualidade de Código**
- **ESLint** - Análise estática de código
- **Prettier** - Formatação automática de código

### **Backend**
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **ES Modules** - Sistema de módulos moderno




## 🔧 Scripts Disponíveis

```bash
npm test                    # Executar todos os testes
npm run test:watch          # Testes em modo watch
npm run test:coverage       # Testes com relatório de cobertura
npm run lint                # Verificar problemas de código
npm run lint:fix            # Corrigir problemas automaticamente  
npm run format              # Formatar código com Prettier
npm run code:check          # Verificação completa (lint + format)
npm run code:fix            # Correção completa (lint + format)
npm start                   # Iniciar servidor de desenvolvimento
```

## 👥 Desenvolvedores

[Lucas Araujo](https://github.com/lal28)<br>
[Pedro Henrique](https://github.com/Pedro9185)<br>
[Jaine Bento](https://github.com/jaibento)<br>

## 📝 Licença

Este projeto foi desenvolvido para fins educacionais como parte do curso de **Análise e Desenvolvimento de Sistemas**.

