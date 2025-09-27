import express from "express";
import bodyParser from "body-parser";
import usersRouter from "./routes/users.js";
import swaggerRoute from "./routes/swagger.route.js";

const app = express();
app.use(bodyParser.json());

// Todas as rotas de usuários ficam em /api/v1/users
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/docs", swaggerRoute);

// Só iniciar servidor se NÃO estiver em ambiente de teste
if (process.env.NODE_ENV !== 'test') {
  app.listen(3000, () => {
    console.log("API rodando em http://localhost:3000");
    console.log(`Docs: http://localhost:3000/api/v1/docs`);
  });
}

// Exportar a aplicação para uso nos testes
export default app;