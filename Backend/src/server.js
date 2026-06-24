import app from "./app.js";

// Define a porta do servidor, usando a variável de ambiente PORT ou a porta padrão 8081
const PORT = process.env.PORT || 8081;

// Inicia o servidor e escuta na porta especificada
app.listen(PORT, () => {
  console.log(`Servidor rodando em: http://localhost:${PORT}/`);
});