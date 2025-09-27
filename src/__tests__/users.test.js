import request from "supertest";
import { describe, test, expect, beforeEach } from "@jest/globals";
import app from "../index.js";
import { generateUser, generateUsers } from "../helpers/testSetup.js";

describe("API CRUD Usuários - Testes Automatizados", () => {
  describe("1. TESTE DE PARTICIONAMENTO DE EQUIVALÊNCIA - CREATE", () => {
    describe("Classe de Equivalência: Dados Válidos", () => {
      test("deve criar usuário com todos os dados válidos", async () => {
        const usuarioValido = generateUser();

        const response = await request(app)
          .post("/api/v1/users")
          .send(usuarioValido)
          .expect(201);

        expect(response.body).toMatchObject(usuarioValido);
        expect(response.body.id).toBeDefined();
        expect(typeof response.body.id).toBe("number");
      });

      test("deve criar usuário com dados mínimos obrigatórios", async () => {
        const usuarioMinimo = {
          nome: generateUser().nome,
          email: generateUser().email,
        };

        const response = await request(app)
          .post("/api/v1/users")
          .send(usuarioMinimo)
          .expect(201);

        expect(response.body.nome).toBe(usuarioMinimo.nome);
        expect(response.body.email).toBe(usuarioMinimo.email);
        expect(response.body.id).toBeDefined();
      });
    });

    describe("Classe de Equivalência: Dados Inválidos", () => {
      test("deve rejeitar usuário com dados vazios", async () => {
        const usuarioVazio = {};

        const response = await request(app)
          .post("/api/v1/users")
          .send(usuarioVazio)
          .expect(400);

        expect(response.body).toHaveProperty("error");
      });

      test("deve rejeitar usuário com email inválido", async () => {
        const usuarioEmailInvalido = {
          nome: generateUser().nome,
          email: "email-sem-formato-valido",
        };

        const response = await request(app)
          .post("/api/v1/users")
          .send(usuarioEmailInvalido)
          .expect(400);

        expect(response.body).toHaveProperty("error");
      });

      test("deve rejeitar usuário com idade inválida", async () => {
        const usuarioIdadeInvalida = {
          nome: generateUser().nome,
          email: generateUser().email,
          idade: "não é número",
        };

        const response = await request(app)
          .post("/api/v1/users")
          .send(usuarioIdadeInvalida)
          .expect(400);

        expect(response.body).toHaveProperty("error");
      });
    });
  });

  describe("2. TESTE DE ANÁLISE DE VALOR LIMITE - READ ONE", () => {
    let usuariosCriados = [];

    // Preparar dados para os testes de limite
    beforeEach(async () => {
      // Limpar array de usuários criados para este teste
      usuariosCriados = [];

      // Criar alguns usuários para testar limites
      for (let i = 0; i < 3; i++) {
        const novoUsuario = generateUser();
        const response = await request(app)
          .post("/api/v1/users")
          .send(novoUsuario)
          .expect(201);
        usuariosCriados.push(response.body);
      }
    });

    describe("Valores Limite Válidos", () => {
      test("deve encontrar usuário com ID mínimo válido (primeiro usuário)", async () => {
        // Pegar o menor ID dos usuários criados
        const menorId = Math.min(...usuariosCriados.map(u => u.id));

        const response = await request(app)
          .get(`/api/v1/users/${menorId}`)
          .expect(200);

        expect(response.body.id).toBe(menorId);
        expect(response.body).toHaveProperty("nome");
        expect(response.body).toHaveProperty("email");
      });

      test("deve encontrar usuário com ID máximo válido (último usuário)", async () => {
        // Pegar o maior ID dos usuários criados
        const maiorId = Math.max(...usuariosCriados.map(u => u.id));

        const response = await request(app)
          .get(`/api/v1/users/${maiorId}`)
          .expect(200);

        expect(response.body.id).toBe(maiorId);
        expect(response.body).toHaveProperty("nome");
        expect(response.body).toHaveProperty("email");
      });
    });

    describe("Valores Limite Inválidos - Numéricos", () => {
      test("deve retornar 404 para ID = 0 (limite inferior inválido)", async () => {
        const response = await request(app).get("/api/v1/users/0").expect(404);

        expect(response.body).toEqual({
          error: "Usuário não encontrado",
        });
      });

      test("deve retornar 404 para ID negativo (abaixo do limite)", async () => {
        const response = await request(app).get("/api/v1/users/-1").expect(404);

        expect(response.body).toEqual({
          error: "Usuário não encontrado",
        });
      });

      test("deve retornar 404 para ID muito alto (acima do limite)", async () => {
        // ID que com certeza não existe
        const idMuitoAlto = 999999;

        const response = await request(app)
          .get(`/api/v1/users/${idMuitoAlto}`)
          .expect(404);

        expect(response.body).toEqual({
          error: "Usuário não encontrado",
        });
      });
    });

    describe("Valores Limite Inválidos - Não Numéricos", () => {
      test("deve retornar 404 para ID como string (abc)", async () => {
        const response = await request(app)
          .get("/api/v1/users/abc")
          .expect(404);

        expect(response.body).toEqual({
          error: "Usuário não encontrado",
        });
      });

      test("deve retornar 404 para ID como string numérica inválida", async () => {
        const response = await request(app)
          .get("/api/v1/users/1.5")
          .expect(404);

        expect(response.body).toEqual({
          error: "Usuário não encontrado",
        });
      });
    });

    describe("Casos Extremos de Limite", () => {
      test("deve lidar com ID como string que representa número válido", async () => {
        const primeiroId = Math.min(...usuariosCriados.map(u => u.id));

        // Passar ID como string, mas que representa número válido
        const response = await request(app)
          .get(`/api/v1/users/${primeiroId.toString()}`)
          .expect(200);

        expect(response.body.id).toBe(primeiroId);
      });
    });
  });
  describe("3. TESTE DE CAIXA-PRETA - UPDATE", () => {
    let usuarioExistente;

    // Preparar usuário para os testes de UPDATE
    beforeEach(async () => {
      // Criar um usuário que será usado nos testes de atualização
      const novoUsuario = generateUser();
      const response = await request(app)
        .post("/api/v1/users")
        .send(novoUsuario)
        .expect(201);
      usuarioExistente = response.body;
    });

    describe("Comportamento: Entrada Válida + Usuário Existente", () => {
      test("deve atualizar completamente usuário existente", async () => {
        // ENTRADA: Dados válidos + ID existente
        const dadosAtualizados = {
          nome: "Nome Completamente Novo",
          email: "novo.email@teste.com",
          idade: 35,
          telefone: "(85) 98888-8888",
          cidade: "Fortaleza",
        };

        // COMPORTAMENTO ESPERADO: 200 + dados atualizados + ID mantido
        const response = await request(app)
          .put(`/api/v1/users/${usuarioExistente.id}`)
          .send(dadosAtualizados)
          .expect(200);

        expect(response.body).toEqual({
          ...dadosAtualizados,
          id: usuarioExistente.id, // ID deve ser preservado
        });
      });

      test("deve atualizar parcialmente usuário existente", async () => {
        // ENTRADA: Apenas alguns campos + ID existente
        const atualizacaoParcial = {
          nome: "Apenas Nome Novo",
        };

        // COMPORTAMENTO ESPERADO: 200 + campo atualizado + outros campos preservados
        const response = await request(app)
          .put(`/api/v1/users/${usuarioExistente.id}`)
          .send(atualizacaoParcial)
          .expect(200);

        expect(response.body.nome).toBe(atualizacaoParcial.nome);
        expect(response.body.email).toBe(usuarioExistente.email); // Mantido
        expect(response.body.id).toBe(usuarioExistente.id); // Mantido
      });

      test("deve preservar campos não informados na atualização", async () => {
        // ENTRADA: Só email novo
        const somenteEmail = {
          email: "so.email@novo.com",
        };

        // COMPORTAMENTO ESPERADO: Email atualizado, resto inalterado
        const response = await request(app)
          .put(`/api/v1/users/${usuarioExistente.id}`)
          .send(somenteEmail)
          .expect(200);

        expect(response.body.email).toBe(somenteEmail.email);
        expect(response.body.nome).toBe(usuarioExistente.nome); // Preservado
        expect(response.body.idade).toBe(usuarioExistente.idade); // Preservado
      });
    });

    describe("Comportamento: Entrada Válida + Usuário Inexistente", () => {
      test("deve retornar 404 para usuário inexistente com dados válidos", async () => {
        // ENTRADA: Dados perfeitos + ID que não existe
        const dadosValidos = generateUser();
        const idInexistente = 999999;

        // COMPORTAMENTO ESPERADO: 404 + mensagem de erro
        const response = await request(app)
          .put(`/api/v1/users/${idInexistente}`)
          .send(dadosValidos)
          .expect(404);

        expect(response.body).toEqual({
          error: "Usuário não encontrado",
        });
      });

      test("deve retornar 404 para ID inválido mesmo com dados válidos", async () => {
        // ENTRADA: Dados perfeitos + ID inválido
        const dadosValidos = generateUser();

        // COMPORTAMENTO ESPERADO: 404 (ID inválido tem prioridade)
        const response = await request(app)
          .put("/api/v1/users/abc")
          .send(dadosValidos)
          .expect(404);

        expect(response.body).toEqual({
          error: "Usuário não encontrado",
        });
      });
    });

    describe("Comportamento: Entrada Inválida + Usuário Existente", () => {
      test("deve rejeitar atualização com email inválido", async () => {
        // ENTRADA: ID existente + dados inválidos
        const dadosInvalidos = {
          nome: "Nome Válido",
          email: "email-sem-arroba-nem-dominio",
        };

        // COMPORTAMENTO ESPERADO: 400 + erro de validação
        const response = await request(app)
          .put(`/api/v1/users/${usuarioExistente.id}`)
          .send(dadosInvalidos)
          .expect(400);

        expect(response.body).toHaveProperty("error", "Dados inválidos");
        expect(response.body).toHaveProperty("details");
      });

      test("deve rejeitar atualização com idade inválida", async () => {
        // ENTRADA: ID existente + idade como string
        const dadosInvalidos = {
          nome: "Nome OK",
          email: "email@valido.com",
          idade: "trinta anos",
        };

        // COMPORTAMENTO ESPERADO: 400 + erro específico da idade
        const response = await request(app)
          .put(`/api/v1/users/${usuarioExistente.id}`)
          .send(dadosInvalidos)
          .expect(400);

        expect(response.body).toHaveProperty("error", "Dados inválidos");
        expect(response.body.details).toContain(
          "Idade deve ser um número entre 0 e 120"
        );
      });

      test("deve rejeitar atualização com nome vazio", async () => {
        // ENTRADA: Nome vazio (obrigatório)
        const dadosInvalidos = {
          nome: "",
          email: "email@valido.com",
        };

        // COMPORTAMENTO ESPERADO: 400 + erro do nome
        const response = await request(app)
          .put(`/api/v1/users/${usuarioExistente.id}`)
          .send(dadosInvalidos)
          .expect(400);

        expect(response.body).toHaveProperty("error", "Dados inválidos");
        expect(response.body.details).toContain("Nome é obrigatório");
      });
    });

    describe("Comportamento: Casos Extremos", () => {
      test("deve lidar com objeto vazio (não deve alterar nada)", async () => {
        // ENTRADA: Objeto vazio
        const objetoVazio = {};

        // COMPORTAMENTO ESPERADO: 400 (nome e email obrigatórios)
        const response = await request(app)
          .put(`/api/v1/users/${usuarioExistente.id}`)
          .send(objetoVazio)
          .expect(400);

        expect(response.body).toHaveProperty("error", "Dados inválidos");
      });

      test("deve manter integridade dos dados após atualização falhada", async () => {
        // ENTRADA: Dados inválidos que devem falhar
        const dadosInvalidos = { email: "email-inválido" };

        // Tentar atualizar (deve falhar)
        await request(app)
          .put(`/api/v1/users/${usuarioExistente.id}`)
          .send(dadosInvalidos)
          .expect(400);

        // COMPORTAMENTO ESPERADO: Dados originais devem estar intactos
        const verificacao = await request(app)
          .get(`/api/v1/users/${usuarioExistente.id}`)
          .expect(200);

        expect(verificacao.body).toEqual(usuarioExistente); // Dados inalterados
      });
    });
  });
  describe("4. TESTE END-TO-END - FLUXO COMPLETO CRUD", () => {
    describe("Jornada Completa do Usuário", () => {
      test("deve executar fluxo completo: CREATE → READ → UPDATE → DELETE", async () => {
        // PASSO 1: CREATE - Criar novo usuário
        const usuarioOriginal = generateUser();

        const createResponse = await request(app)
          .post("/api/v1/users")
          .send(usuarioOriginal)
          .expect(201);

        expect(createResponse.body).toMatchObject(usuarioOriginal);
        expect(createResponse.body.id).toBeDefined();

        const usuarioId = createResponse.body.id;
        const usuarioCriado = createResponse.body;

        // PASSO 2: READ ALL - Verificar se aparece na listagem
        const listResponse = await request(app)
          .get("/api/v1/users")
          .expect(200);

        expect(listResponse.body.count).toBeGreaterThan(0);
        expect(listResponse.body.data).toContainEqual(usuarioCriado);

        // PASSO 3: READ ONE - Buscar usuário específico
        const getResponse = await request(app)
          .get(`/api/v1/users/${usuarioId}`)
          .expect(200);

        expect(getResponse.body).toEqual(usuarioCriado);

        // PASSO 4: UPDATE - Modificar dados do usuário
        const dadosAtualizados = {
          nome: `${usuarioOriginal.nome} - ATUALIZADO`,
          email: `atualizado.${usuarioOriginal.email}`,
          idade: (usuarioOriginal.idade || 25) + 5,
        };

        const updateResponse = await request(app)
          .put(`/api/v1/users/${usuarioId}`)
          .send(dadosAtualizados)
          .expect(200);

        expect(updateResponse.body).toMatchObject(dadosAtualizados);
        expect(updateResponse.body.id).toBe(usuarioId);

        // PASSO 5: READ ONE novamente - Confirmar atualização
        const getUpdatedResponse = await request(app)
          .get(`/api/v1/users/${usuarioId}`)
          .expect(200);

        expect(getUpdatedResponse.body).toEqual(updateResponse.body);
        expect(getUpdatedResponse.body.nome).toContain("ATUALIZADO");

        // PASSO 6: DELETE - Remover usuário
        const deleteResponse = await request(app)
          .delete(`/api/v1/users/${usuarioId}`)
          .expect(200);

        expect(deleteResponse.body).toEqual({
          message: "Usuário removido com sucesso",
        });

        // PASSO 7: READ ONE final - Confirmar remoção (404)
        await request(app).get(`/api/v1/users/${usuarioId}`).expect(404);

        // PASSO 8: READ ALL final - Verificar que não está mais na lista
        const finalListResponse = await request(app)
          .get("/api/v1/users")
          .expect(200);

        const usuarioNaLista = finalListResponse.body.data.find(
          u => u.id === usuarioId
        );
        expect(usuarioNaLista).toBeUndefined();
      });
    });

    describe("Múltiplos Usuários - Integridade do Sistema", () => {
      test("deve manter integridade ao manipular múltiplos usuários", async () => {
        // Criar múltiplos usuários
        const usuarios = [];
        const usuariosData = generateUsers(3);

        for (const userData of usuariosData) {
          const response = await request(app)
            .post("/api/v1/users")
            .send(userData)
            .expect(201);
          usuarios.push(response.body);
        }

        // Verificar que todos foram criados
        const listResponse = await request(app)
          .get("/api/v1/users")
          .expect(200);

        expect(listResponse.body.count).toBeGreaterThanOrEqual(3);

        // Atualizar apenas o primeiro usuário
        const primeiroUsuario = usuarios[0];
        const dadosAtualizados = { nome: "PRIMEIRO ATUALIZADO" };

        await request(app)
          .put(`/api/v1/users/${primeiroUsuario.id}`)
          .send(dadosAtualizados)
          .expect(200);

        // Verificar que apenas o primeiro foi alterado
        const verificarPrimeiro = await request(app)
          .get(`/api/v1/users/${primeiroUsuario.id}`)
          .expect(200);
        expect(verificarPrimeiro.body.nome).toBe("PRIMEIRO ATUALIZADO");

        const verificarSegundo = await request(app)
          .get(`/api/v1/users/${usuarios[1].id}`)
          .expect(200);
        expect(verificarSegundo.body.nome).not.toContain("ATUALIZADO");

        // Deletar apenas o usuário do meio
        const usuarioMeio = usuarios[1];
        await request(app)
          .delete(`/api/v1/users/${usuarioMeio.id}`)
          .expect(200);

        // Verificar que os outros ainda existem
        await request(app).get(`/api/v1/users/${usuarios[0].id}`).expect(200);

        await request(app).get(`/api/v1/users/${usuarios[2].id}`).expect(200);

        // Verificar que o deletado não existe mais
        await request(app).get(`/api/v1/users/${usuarioMeio.id}`).expect(404);
      });
    });

    describe("Cenários de Falha no Fluxo", () => {
      test("deve lidar com falhas em etapas intermediárias", async () => {
        // 1. Criar usuário com sucesso
        const usuario = generateUser();
        const createResponse = await request(app)
          .post("/api/v1/users")
          .send(usuario)
          .expect(201);

        const usuarioId = createResponse.body.id;

        // 2. Tentar atualizar com dados inválidos (deve falhar)
        const dadosInvalidos = { email: "email-sem-formato" };
        await request(app)
          .put(`/api/v1/users/${usuarioId}`)
          .send(dadosInvalidos)
          .expect(400);

        // 3. Verificar que usuário ainda existe com dados originais
        const verificacao = await request(app)
          .get(`/api/v1/users/${usuarioId}`)
          .expect(200);
        expect(verificacao.body).toMatchObject(usuario);

        // 4. Tentar deletar usuário inexistente
        const idInexistente = 999999;
        await request(app).delete(`/api/v1/users/${idInexistente}`).expect(404);

        // 5. Verificar que usuário original ainda existe
        await request(app).get(`/api/v1/users/${usuarioId}`).expect(200);

        // 6. Deletar com sucesso
        await request(app).delete(`/api/v1/users/${usuarioId}`).expect(200);

        // 7. Confirmar remoção
        await request(app).get(`/api/v1/users/${usuarioId}`).expect(404);
      });
    });

    describe("Performance e Consistência", () => {
      test("deve manter consistência durante operações rápidas sequenciais", async () => {
        // Criar usuário
        const usuario = generateUser();
        const createResponse = await request(app)
          .post("/api/v1/users")
          .send(usuario)
          .expect(201);

        const usuarioId = createResponse.body.id;

        // Fazer múltiplas operações READ rapidamente
        const promises = [];
        for (let i = 0; i < 5; i++) {
          promises.push(
            request(app).get(`/api/v1/users/${usuarioId}`).expect(200)
          );
        }

        const responses = await Promise.all(promises);

        // Todas as respostas devem ser idênticas
        const primeiraResposta = responses[0].body;
        responses.forEach(response => {
          expect(response.body).toEqual(primeiraResposta);
        });

        // Limpeza
        await request(app).delete(`/api/v1/users/${usuarioId}`).expect(200);
      });
    });
  });
  describe("5. TESTE DE VERIFICAÇÃO VS VALIDAÇÃO - DELETE", () => {
    describe("VERIFICAÇÃO: Estamos deletando o usuário CERTO?", () => {
      let usuariosParaTeste = [];

      beforeEach(async () => {
        // Criar múltiplos usuários para verificar seletividade
        usuariosParaTeste = [];
        const usuariosData = generateUsers(4);

        for (const userData of usuariosData) {
          const response = await request(app)
            .post("/api/v1/users")
            .send(userData)
            .expect(201);
          usuariosParaTeste.push(response.body);
        }
      });

      test("deve deletar APENAS o usuário específico solicitado", async () => {
        // VERIFICAÇÃO: Escolher usuário específico para deletar
        const usuarioParaDeletar = usuariosParaTeste[1]; // Usuário do meio
        const usuariosQueDevemPermanecer = usuariosParaTeste.filter(
          u => u.id !== usuarioParaDeletar.id
        );

        // Deletar o usuário específico
        await request(app)
          .delete(`/api/v1/users/${usuarioParaDeletar.id}`)
          .expect(200);

        // VERIFICAÇÃO: Confirmar que APENAS o usuário correto foi deletado
        await request(app)
          .get(`/api/v1/users/${usuarioParaDeletar.id}`)
          .expect(404);

        // VERIFICAÇÃO: Todos os outros usuários devem ainda existir
        for (const usuario of usuariosQueDevemPermanecer) {
          const response = await request(app)
            .get(`/api/v1/users/${usuario.id}`)
            .expect(200);
          expect(response.body).toEqual(usuario);
        }
      });

      test("deve manter integridade dos dados de outros usuários", async () => {
        const usuarioOriginal1 = usuariosParaTeste[0];
        const usuarioOriginal2 = usuariosParaTeste[1];
        const usuarioParaDeletar = usuariosParaTeste[2];
        const usuarioOriginal3 = usuariosParaTeste[3];

        // VERIFICAÇÃO: Deletar usuário do meio
        await request(app)
          .delete(`/api/v1/users/${usuarioParaDeletar.id}`)
          .expect(200);

        // VERIFICAÇÃO: Dados dos outros usuários devem estar EXATAMENTE iguais
        const verificacao1 = await request(app)
          .get(`/api/v1/users/${usuarioOriginal1.id}`)
          .expect(200);
        const verificacao2 = await request(app)
          .get(`/api/v1/users/${usuarioOriginal2.id}`)
          .expect(200);
        const verificacao3 = await request(app)
          .get(`/api/v1/users/${usuarioOriginal3.id}`)
          .expect(200);

        expect(verificacao1.body).toEqual(usuarioOriginal1);
        expect(verificacao2.body).toEqual(usuarioOriginal2);
        expect(verificacao3.body).toEqual(usuarioOriginal3);
      });

      test("deve manter contagem correta na listagem após deleção", async () => {
        // Contar usuários antes
        const listaAntes = await request(app).get("/api/v1/users").expect(200);
        const countAntes = listaAntes.body.count;

        // VERIFICAÇÃO: Deletar um usuário
        const usuarioParaDeletar = usuariosParaTeste[0];
        await request(app)
          .delete(`/api/v1/users/${usuarioParaDeletar.id}`)
          .expect(200);

        // VERIFICAÇÃO: Contagem deve diminuir exatamente 1
        const listaDepois = await request(app).get("/api/v1/users").expect(200);
        expect(listaDepois.body.count).toBe(countAntes - 1);

        // VERIFICAÇÃO: Usuário deletado não deve aparecer na lista
        const usuarioNaLista = listaDepois.body.data.find(
          u => u.id === usuarioParaDeletar.id
        );
        expect(usuarioNaLista).toBeUndefined();
      });
    });

    describe("VALIDAÇÃO: Estamos deletando da forma CORRETA?", () => {
      let usuarioParaTeste;

      beforeEach(async () => {
        // Criar usuário para os testes de validação
        const userData = generateUser();
        const response = await request(app)
          .post("/api/v1/users")
          .send(userData)
          .expect(201);
        usuarioParaTeste = response.body;
      });

      test("deve retornar status 200 e mensagem correta ao deletar usuário existente", async () => {
        // VALIDAÇÃO: Status code e estrutura da resposta corretos
        const response = await request(app)
          .delete(`/api/v1/users/${usuarioParaTeste.id}`)
          .expect(200);

        // VALIDAÇÃO: Mensagem de resposta no formato esperado
        expect(response.body).toEqual({
          message: "Usuário removido com sucesso",
        });

        // VALIDAÇÃO: Content-Type correto
        expect(response.headers["content-type"]).toMatch(/application\/json/);
      });

      test("deve retornar status 404 para usuário inexistente", async () => {
        const idInexistente = 999999;

        // VALIDAÇÃO: Status code correto para recurso não encontrado
        const response = await request(app)
          .delete(`/api/v1/users/${idInexistente}`)
          .expect(404);

        // VALIDAÇÃO: Mensagem de erro no formato esperado
        expect(response.body).toEqual({
          error: "Usuário não encontrado",
        });
      });

      test("deve retornar status 404 para ID inválido", async () => {
        const idsInvalidos = ["abc", "1.5", "-1", "0"];

        for (const idInvalido of idsInvalidos) {
          // VALIDAÇÃO: Todos os IDs inválidos devem retornar 404
          const response = await request(app)
            .delete(`/api/v1/users/${idInvalido}`)
            .expect(404);

          // VALIDAÇÃO: Mensagem consistente para todos os casos
          expect(response.body).toEqual({
            error: "Usuário não encontrado",
          });
        }
      });

      test("deve ser idempotente - deletar usuário já deletado", async () => {
        // Deletar usuário uma vez
        await request(app)
          .delete(`/api/v1/users/${usuarioParaTeste.id}`)
          .expect(200);

        // VALIDAÇÃO: Tentar deletar novamente deve retornar 404
        const response = await request(app)
          .delete(`/api/v1/users/${usuarioParaTeste.id}`)
          .expect(404);

        // VALIDAÇÃO: Mensagem de erro apropriada
        expect(response.body).toEqual({
          error: "Usuário não encontrado",
        });
      });
    });

    describe("VERIFICAÇÃO + VALIDAÇÃO: Cenários Complexos", () => {
      test("deve manter sistema estável após múltiplas deleções", async () => {
        // Criar vários usuários
        const usuarios = [];
        for (let i = 0; i < 5; i++) {
          const userData = generateUser();
          const response = await request(app)
            .post("/api/v1/users")
            .send(userData)
            .expect(201);
          usuarios.push(response.body);
        }

        // VERIFICAÇÃO + VALIDAÇÃO: Deletar usuários alternadamente
        await request(app)
          .delete(`/api/v1/users/${usuarios[1].id}`)
          .expect(200); // Delete 2º
        await request(app)
          .delete(`/api/v1/users/${usuarios[3].id}`)
          .expect(200); // Delete 4º

        // VERIFICAÇÃO: Usuários certos foram deletados
        await request(app).get(`/api/v1/users/${usuarios[1].id}`).expect(404);
        await request(app).get(`/api/v1/users/${usuarios[3].id}`).expect(404);

        // VERIFICAÇÃO: Usuários certos permanecem
        await request(app).get(`/api/v1/users/${usuarios[0].id}`).expect(200);
        await request(app).get(`/api/v1/users/${usuarios[2].id}`).expect(200);
        await request(app).get(`/api/v1/users/${usuarios[4].id}`).expect(200);

        // VALIDAÇÃO: Tentar deletar usuários já deletados
        await request(app)
          .delete(`/api/v1/users/${usuarios[1].id}`)
          .expect(404);
        await request(app)
          .delete(`/api/v1/users/${usuarios[3].id}`)
          .expect(404);
      });

      test("deve manter ordem e integridade após deleções sequenciais", async () => {
        // Criar usuários em sequência
        const usuariosOriginais = [];
        for (let i = 0; i < 3; i++) {
          const userData = {
            ...generateUser(),
            nome: `Usuario ${i + 1}`,
          };
          const response = await request(app)
            .post("/api/v1/users")
            .send(userData)
            .expect(201);
          usuariosOriginais.push(response.body);
        }

        // VERIFICAÇÃO: Deletar primeiro usuário
        await request(app)
          .delete(`/api/v1/users/${usuariosOriginais[0].id}`)
          .expect(200);

        // VALIDAÇÃO: Sistema deve funcionar normalmente com os restantes
        const lista = await request(app).get("/api/v1/users").expect(200);

        expect(lista.body.data).not.toContainEqual(usuariosOriginais[0]);
        expect(lista.body.data).toContainEqual(usuariosOriginais[1]);
        expect(lista.body.data).toContainEqual(usuariosOriginais[2]);

        // VERIFICAÇÃO: Operações CRUD devem funcionar nos usuários restantes
        const dadosUpdate = { nome: "Usuario 2 - ATUALIZADO" };
        await request(app)
          .put(`/api/v1/users/${usuariosOriginais[1].id}`)
          .send(dadosUpdate)
          .expect(200);

        // VALIDAÇÃO: Atualização deve ter funcionado
        const verificacao = await request(app)
          .get(`/api/v1/users/${usuariosOriginais[1].id}`)
          .expect(200);
        expect(verificacao.body.nome).toBe("Usuario 2 - ATUALIZADO");
      });
    });
  });
});
