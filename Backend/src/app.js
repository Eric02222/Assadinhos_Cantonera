import express from "express";
import cors from "cors";
import { routerAuth } from "./route/authRouter.js";
import routerUsuario from "./route/usuarioRouter.js";
import routerLanche from "./route/lancheRouter.js";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send("Servidor esta funcionando");
});

app.use(routerAuth);
app.use(routerUsuario);
app.use(routerLanche);



export default app;