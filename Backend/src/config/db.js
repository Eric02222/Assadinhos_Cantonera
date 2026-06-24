// Configuração da conexão com o banco de dados MySQL usando um pool de conexões
import mysql2 from "mysql2/promise"
import dotenv from "dotenv";

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

// Cria o pool de conexão para gerenciar múltiplas conexões de forma eficiente
const db = mysql2.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "861391",
    database: process.env.DB_DATABASE || "lanchos"
});

// Exporta o objeto de conexão para uso em outros módulos
export default db;