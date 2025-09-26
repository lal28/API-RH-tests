//importar as bibliotecas
import express from "express";
import { users } from "../data.js";

const router = express.Router();
let idCounter = 6;

//##CRUD##

// CREATE
router.post("/", (req, res) => {
  const novoUsuario = { id: idCounter++, ...req.body };
  users.push(novoUsuario);
  res.status(201).json(novoUsuario);
});

// READ ALL
router.get("/", (req, res) => {
  res.json({ count: users.length, data: users });
});

// READ ONE
router.get("/:id", (req, res) => {
  const user = users.find(u => u.id == req.params.id);
  if (!user) return res.status(404).json({ error: "Usuário não encontrado" });
  res.json(user);
});

// UPDATE
router.put("/:id", (req, res) => {
  const index = users.findIndex(u => u.id == req.params.id);
  if (index === -1) return res.status(404).json({ error: "Usuário não encontrado" });

  users[index] = { ...users[index], ...req.body };
  res.json(users[index]);
});

// DELETE
router.delete("/:id", (req, res) => {
  const index = users.findIndex(u => u.id == req.params.id);
  if (index === -1) return res.status(404).json({ error: "Usuário não encontrado" });

  users.splice(index, 1);
  res.json({ message: "Usuário removido com sucesso" });
});

export default router;
