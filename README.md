# 👥 API RH - Sistema de Gerenciamento de Funcionários

Uma API REST simples para gerenciar funcionários de uma empresa, construída com Node.js e Express.

## 📋 Funcionalidades

- ✅ **CRUD completo** de funcionários
- ✅ Listar todos os funcionários
- ✅ Buscar funcionário por ID
- ✅ Criar novo funcionário
- ✅ Atualizar dados do funcionário
- ✅ Remover funcionário
- ✅ Dados de exemplo já inclusos

## 🚀 Como executar

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/api-rh.git
cd api-rh
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Execute o servidor
```bash
npm start
```

### 4. Acesse a API
O servidor estará rodando em: `http://localhost:3000`

## 📖 Endpoints da API

### Base URL: `http://localhost:3000/api/v1/users`

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/v1/docs` | Documentação Swagger |
| `GET` | `/api/v1/users` | Lista todos os funcionários |
| `GET` | `/api/v1/users/:id` | Busca funcionário por ID |
| `POST` | `/api/v1/users` | Cria novo funcionário |
| `PUT` | `/api/v1/users/:id` | Atualiza funcionário existente |
| `DELETE` | `/api/v1/users/:id` | Remove funcionário |

## 📝 Exemplo de dados

```json
{
  "nome": "Lucas Araujo",
  "dataNascimento": "1995-05-10",
  "telefone": "(92) 99999-8888",
  "email": "lucas@email.com",
  "estadoCivil": "solteiro",
  "sexo": "masculino",
  "cep": "69000-000",
  "endereco": "Rua Exemplo, 123",
  "bairro": "Centro",
  "cidade": "Manaus",
  "estado": "AM",
  "pais": "Brasil",
  "usuario": "lucasaraujo",
  "departamento": "TI",
  "emailCorp": "lucas.araujo@empresa.com",
  "ativo": "sim",
  "dataAdmissao": "2023-01-15",
  "numeroIdentidade": "12345678",
  "numeroCpf": "11122233344"
}
```

## 🧪 Testando a API

### 1. No navegador (GET)
```
http://localhost:3000/api/v1/users
```

### 2. Com cURL
```bash
# Listar todos
curl http://localhost:3000/api/v1/users

# Buscar por ID
curl http://localhost:3000/api/v1/users/1

# Criar novo funcionário
curl -X POST http://localhost:3000/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{"nome":"João Silva","email":"joao@email.com"}'

# Atualizar funcionário
curl -X PUT http://localhost:3000/api/v1/users/1 \
  -H "Content-Type: application/json" \
  -d '{"telefone":"(11) 99999-0000"}'

# Deletar funcionário
curl -X DELETE http://localhost:3000/api/v1/users/1
```

### 3. Com Postman/Insomnia
Importe as requisições usando os exemplos de cURL acima ou configure manualmente.

## 📁 Estrutura do projeto

```
api-rh/
├── package.json            # Dependências e scripts
├── index.js                # Servidor principal
├── data.js                 # Dados em memória
└── routes/
    └── users.js            # Rotas CRUD dos usuários
    └── swagger.route.js    # Rotas documentação
```

# 📖 Documentação da API com Swagger

## 🌐 Acessando a Documentação

Após iniciar o servidor, acesse a documentação interativa em:
```
http://localhost:3000/api/v1/docs
```

## 🚀 Como Usar a Documentação

### 1. **Explorar Endpoints**
- Expandir cada seção para ver os endpoints disponíveis
- Visualizar métodos HTTP (GET, POST, PUT, DELETE)
- Ver descrições detalhadas de cada operação

### 2. **Testar Endpoints Diretamente**
- Clicar em "Try it out" em qualquer endpoint
- Preencher os parâmetros necessários
- Clicar em "Execute" para enviar a requisição
- Ver a resposta em tempo real com código de status e corpo

### 3. **Exemplos de Uso**
- Todos os campos incluem exemplos predefinidos
- Modelos de requisição prontos para teste
- Respostas de sucesso e erro documentadas

### 4. **Esquemas de Dados**
- Seção "Schemas" mostra a estrutura completa dos usuários
- Detalhes de todos os campos e seus formatos
- Valores obrigatórios versus opcionais


## 🔍 Dica

A documentação é **interativa** - você pode testar todas as operações diretamente pela interface do Swagger sem necessidade de ferramentas externas como Postman ou Insomnia.



*Documentação gerada automaticamente com Swagger/OpenAPI 3.0*

## ⚠️ Observações importantes

- **Dados temporários**: Os dados ficam apenas na memória. Ao reiniciar o servidor, todas as alterações são perdidas


## 🛠️ Tecnologias utilizadas

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **Body-Parser** - Middleware para parsing JSON
- **Swagger UI** - API Documentation
- **Swagger exprees** - API Documentation

## 🌍 Possíveis usos da nossa API

O objetivo inicial desta API é servir como **backend para o  [nosso sistema de RH](https://github.com/Pedro9185/Sprint-2-Projeto-Integrado-III)**, fornecendo as funcionalidades essenciais para cadastrar, consultar, atualizar e remover informações de funcionários.  

Porém, como se trata de um **CRUD de usuários**, ela pode ser facilmente aproveitada em outros cenários, como por exemplo:

- **Pequenas empresas**: substituir planilhas manuais, centralizando o cadastro de funcionários de forma mais organizada.  
- **Startups**: integrar com sistemas de folha de pagamento, controle de ponto ou plataformas internas.  
- **Departamentos de TI**: ser usada em treinamentos de integração entre front-end e back-end.  
- **Soluções personalizadas**: permitir consultas rápidas sobre usuários (contato, departamento, status) em diferentes dispositivos.  

Assim, mesmo começando como um projeto acadêmico, a API já demonstra como dados simples podem ganhar utilidade prática em diversos contextos do mundo real.

## Desenvolvedores
[Lucas Araujo](https://github.com/lal28)<br>
[Pedro Henrique](https://github.com/Pedro9185)<br>
[Jaine Bento](https://github.com/jaibento)<br>


## 📄 Licença

Este projeto está sob a licença ISC