# Técnicas de Teste

## **1️⃣ Particionamento de Equivalência**

### **🎯 Conceito Simples**

"Não preciso testar TODOS os valores possíveis, só um representante de cada grupo similar"

### **💻 Na Nossa API**

```javascript
// Grupo VÁLIDO: Email correto
teste("joao@gmail.com")  ✅ Status 201

// Grupo INVÁLIDO: Email sem @
teste("joaogmail.com")   ❌ Status 400

// Grupo INVÁLIDO: Email vazio
teste("")                ❌ Status 400
```

**Vantagem:** Cobertura completa com poucos testes!

---

## **2️⃣ Análise de Valor Limite**

### **🎯 Conceito Simples**

"Bugs aparecem mais nas 'fronteiras' - teste os extremos!"

### **💻 Na Nossa API**

Buscar usuário por ID:

```javascript
// ID mínimo válido
GET /users/1     ✅ Status 200 (primeiro usuário)

// ID máximo válido
GET /users/999   ✅ Status 200 (último usuário)

// LIMITE INFERIOR inválido
GET /users/0     ❌ Status 404 (não existe)
GET /users/-1    ❌ Status 404 (não existe)

// LIMITE SUPERIOR inválido
GET /users/9999  ❌ Status 404 (não existe)
```

**Casos especiais:**

```javascript
GET /users/1.5   ❌ Status 404 (não é inteiro!)
GET /users/abc   ❌ Status 404 (não é número!)
```

**Vantagem:** Encontra bugs que aparecem nos "cantos"!

---

## **3️⃣ Teste de Caixa-Preta**

### **🎯 Conceito Simples**

"Não me importa COMO funciona por dentro, só se o resultado está certo"

### **💻 Na Nossa API**

Atualizar usuário:

```javascript
// ENTRADA: ID existente + dados válidos
PUT /users/5
Body: { nome: "João Silva" }

// RESULTADO ESPERADO:
✅ Status: 200
✅ Resposta: { id: 5, nome: "João Silva", email: "original@email.com" }
✅ Comportamento: Email foi PRESERVADO (não enviamos, não mudou)
```

**Diferentes entradas, diferentes resultados:**

| Entrada                       | Resultado Esperado          |
| ----------------------------- | --------------------------- |
| ID existe + dados válidos     | ✅ Status 200 + atualização |
| ID existe + dados inválidos   | ❌ Status 400 + erro        |
| ID não existe + dados válidos | ❌ Status 404 + erro        |

**Vantagem:** Testa o que o USUÁRIO vê, não o código interno!

---

## **4️⃣ Teste End-to-End (E2E)**

### **🎯 Conceito Simples**

"Testar a jornada COMPLETA do usuário, do início ao fim"

### **💻 Na Nossa API**

**Jornada completa CRUD:**

```javascript
// 1️⃣ CRIAR usuário
POST /users
Body: { nome: "Maria", email: "maria@test.com" }
Resultado: ✅ Status 201, ID = 123

// 2️⃣ LISTAR e verificar se aparece
GET /users
Resultado: ✅ Status 200, Maria está na lista

// 3️⃣ BUSCAR usuário específico
GET /users/123
Resultado: ✅ Status 200, dados de Maria

// 4️⃣ ATUALIZAR dados
PUT /users/123
Body: { nome: "Maria Silva" }
Resultado: ✅ Status 200, nome atualizado

// 5️⃣ DELETAR usuário
DELETE /users/123
Resultado: ✅ Status 200, removido

// 6️⃣ CONFIRMAR que não existe mais
GET /users/123
Resultado: ✅ Status 404, usuário sumiu
```

**Vantagem:** Garante que a aplicação funciona como um TODO!

---

## **5️⃣ Verificação vs Validação**

### **🎯 Conceito Simples**

- **Verificação:** "Estou fazendo a coisa CERTA?"
- **Validação:** "Estou fazendo CERTO?"

### **💻 Na Nossa API**

Deletar usuário ID = 5:

**VERIFICAÇÃO (produto certo):**

```javascript
// ✅ Deletou APENAS o usuário 5?
DELETE /users/5

// Confirmar que outros usuários NÃO foram afetados
GET /users/3  ✅ Status 200 (ainda existe)
GET /users/7  ✅ Status 200 (ainda existe)

// Confirmar que o 5 foi removido
GET /users/5  ✅ Status 404 (não existe mais)
```

**VALIDAÇÃO (processo correto):**

```javascript
// ✅ Processo está correto?

// Status code adequado
DELETE /users/5
Resultado: ✅ Status 200 (sucesso)

// Mensagem apropriada
Resposta: { message: "Usuário removido com sucesso" }

// Idempotência (deletar de novo)
DELETE /users/5
Resultado: ✅ Status 404 (já não existe)

// Rejeita IDs inválidos
DELETE /users/abc
Resultado: ✅ Status 404 (ID inválido)
```

**Vantagem:** Garante PRECISÃO e QUALIDADE do processo!

---

## **📊 Resumo Visual**

| Técnica                   | Pergunta Principal       | Exemplo Simples               |
| ------------------------- | ------------------------ | ----------------------------- |
| **Particionamento**       | Quantos testes preciso?  | Testar 1 por grupo, não todos |
| **Valor Limite**          | Onde bugs aparecem mais? | Nas fronteiras (0, 1, máximo) |
| **Caixa-Preta**           | O resultado está certo?  | Entrada → Saída esperada      |
| **End-to-End**            | Tudo funciona junto?     | Do início ao fim completo     |
| **Verificação/Validação** | Certo vs Correto?        | Coisa certa + Feito certo     |

---

## **🎓 Dica para Iniciantes**

**Ordem de aprendizado sugerida:**

1. **Caixa-Preta** (mais intuitivo - focar no resultado)
2. **Particionamento** (economizar testes)
3. **Valor Limite** (encontrar bugs nos extremos)
4. **End-to-End** (juntar tudo)
5. **Verificação/Validação** (refinamento)
