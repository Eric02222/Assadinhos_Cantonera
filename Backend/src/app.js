import express from "express";
import cors from "cors";
import { routerAuth } from "./route/authRouter.js";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send("Servidor esta funcionando");
});

app.use(routerAuth);


export default app;