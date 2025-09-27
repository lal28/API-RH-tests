import { faker } from "@faker-js/faker";

// Configurar Faker para português brasileiro
faker.locale = "pt_BR";

// Função para gerar dados de usuário fictícios
export const generateUser = () => ({
  nome: faker.person.fullName(),
  email: faker.internet.email(),
  idade: faker.number.int({ min: 18, max: 80 }),
  telefone: faker.phone.number(),
  cidade: faker.location.city(),
});

// Função para gerar múltiplos usuários
export const generateUsers = (count = 5) => {
  return Array.from({ length: count }, () => generateUser());
};

// Limpar dados entre testes
export const resetUsersData = usersArray => {
  usersArray.length = 0; // Limpa o array mantendo a referência
};

// Função para criar app de teste
export const createTestApp = async () => {
  // Importar sua aplicação aqui
  const app = (await import("../index.js")).default;
  return app;
};
