//importar as bibliotecas
import express from "express";
import { users } from "../data.js";

const router = express.Router();
let idCounter = 6;

// Função para validar email
const isValidEmail = email => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Função para validar dados do usuário (CREATE - campos obrigatórios)
const validateUser = userData => {
  const errors = [];

  // Validar nome
  if (!userData.nome || userData.nome.trim() === "") {
    errors.push("Nome é obrigatório");
  }

  // Validar email
  if (!userData.email || userData.email.trim() === "") {
    errors.push("Email é obrigatório");
  } else if (!isValidEmail(userData.email)) {
    errors.push("Email deve ter formato válido");
  }

  // Validar idade (se fornecida)
  if (userData.idade !== undefined) {
    if (
      typeof userData.idade !== "number" ||
      userData.idade < 0 ||
      userData.idade > 120
    ) {
      errors.push("Idade deve ser um número entre 0 e 120");
    }
  }

  return errors;
};

// Função para validar dados do usuário (UPDATE - apenas campos enviados)
const validateUserUpdate = userData => {
  const errors = [];

  // Validar nome (apenas se fornecido)
  if (userData.nome !== undefined) {
    if (!userData.nome || userData.nome.trim() === "") {
      errors.push("Nome é obrigatório");
    }
  }

  // Validar email (apenas se fornecido)
  if (userData.email !== undefined) {
    if (!userData.email || userData.email.trim() === "") {
      errors.push("Email é obrigatório");
    } else if (!isValidEmail(userData.email)) {
      errors.push("Email deve ter formato válido");
    }
  }

  // Validar idade (se fornecida)
  if (userData.idade !== undefined) {
    if (
      typeof userData.idade !== "number" ||
      userData.idade < 0 ||
      userData.idade > 120
    ) {
      errors.push("Idade deve ser um número entre 0 e 120");
    }
  }

  // Verificar se pelo menos um campo foi enviado
  const camposEnviados = Object.keys(userData).filter(
    key => userData[key] !== undefined
  );
  if (camposEnviados.length === 0) {
    errors.push("Pelo menos um campo deve ser fornecido para atualização");
  }

  return errors;
};

//##CRUD##

// CREATE com validação
router.post("/", (req, res) => {
  const errors = validateUser(req.body);

  if (errors.length > 0) {
    return res.status(400).json({
      error: "Dados inválidos",
      details: errors,
    });
  }

  const novoUsuario = { id: idCounter++, ...req.body };
  users.push(novoUsuario);
  res.status(201).json(novoUsuario);
});

// READ ALL
router.get("/", (req, res) => {
  res.json({ count: users.length, data: users });
});

// READ ONE com validação de ID
router.get("/:id", (req, res) => {
  const idParam = req.params.id;

  // Validar se é um número inteiro válido
  const id = parseInt(idParam);

  // Verificar se a conversão é válida e se o valor original era realmente um inteiro
  if (isNaN(id) || id.toString() !== idParam || id <= 0) {
    return res.status(404).json({ error: "Usuário não encontrado" });
  }

  const user = users.find(u => u.id === id);
  if (!user) return res.status(404).json({ error: "Usuário não encontrado" });
  return res.json(user);
});

// UPDATE com validação específica para atualização
router.put("/:id", (req, res) => {
  const idParam = req.params.id;
  const id = parseInt(idParam);

  // Validar ID
  if (isNaN(id) || id.toString() !== idParam || id <= 0) {
    return res.status(404).json({ error: "Usuário não encontrado" });
  }

  const index = users.findIndex(u => u.id === id);
  if (index === -1)
    return res.status(404).json({ error: "Usuário não encontrado" });

  // Usar validação específica para UPDATE
  const errors = validateUserUpdate(req.body);

  if (errors.length > 0) {
    return res.status(400).json({
      error: "Dados inválidos",
      details: errors,
    });
  }

  users[index] = { ...users[index], ...req.body };
  return res.json(users[index]);
});

// DELETE com validação de ID
router.delete("/:id", (req, res) => {
  const idParam = req.params.id;
  const id = parseInt(idParam);

  // Validar ID
  if (isNaN(id) || id.toString() !== idParam || id <= 0) {
    return res.status(404).json({ error: "Usuário não encontrado" });
  }

  const index = users.findIndex(u => u.id === id);
  if (index === -1)
    return res.status(404).json({ error: "Usuário não encontrado" });

  users.splice(index, 1);
  return res.json({ message: "Usuário removido com sucesso" });
});

export default router;
