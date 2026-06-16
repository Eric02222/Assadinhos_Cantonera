import db from "../config/db.js";

const createLanche = async (req, res) => {
    try {
        const { nome, preco, categoria, quantidade } = req.body;

        if (!nome || preco === undefined || !categoria || quantidade === undefined) {
            return res.status(400).json({ message: "Todos os campos devem ser preenchidos", success: false });
        }

        const disponivel = quantidade > 0;
        
        const [result] = await db.query(
            "INSERT INTO lanches (nome, preco, categoria, quantidade, disponivel) VALUES (?, ?, ?, ?, ?)",
            [nome, preco, categoria, quantidade, disponivel]
        );

        if (result.affectedRows === 0) {
            return res.status(400).json({ message: "Não foi possível inserir o lanche", success: false });
        }

        return res.status(201).json({ message: "Lanche cadastrado com sucesso", success: true });
    } catch (error) {
        console.error("Erro ao criar lanche:", error);
        return res.status(500).json({ message: "Erro ao criar lanche", error: error.message });
    }
}

const getLanche = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM lanches");
        return res.status(200).json({ success: true, data: rows });
    } catch (error) {
        console.error("Erro ao buscar lanches:", error);
        return res.status(500).json({ message: "Erro ao buscar lanches", error: error.message });
    }
}

const getLanchesById = async (req, res) => {
    try {
        const { id } = req.params;

        const [rows] = await db.query("SELECT * FROM lanches WHERE id = ?", [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Lanche não encontrado", success: false });
        }

        return res.status(200).json({ success: true, data: rows[0] });
    } catch (error) {
        console.error("Erro ao buscar lanche:", error);
        return res.status(500).json({ message: "Erro ao buscar lanche", error: error.message });
    }
}

const editarLanche = async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, preco, categoria, quantidade } = req.body;

        if (!id) {
            return res.status(400).json({ message: "O ID do lanche é obrigatório.", success: false });
        }

        if (!nome || preco === undefined || !categoria || quantidade === undefined) {
            return res.status(400).json({ message: "Informações do lanche são obrigatórios e não podem estar vazios.", success: false });
        }

        const disponivel = quantidade > 0;

        const [result] = await db.query(
            "UPDATE lanches SET nome = ?, preco = ?, categoria = ?, quantidade = ?, disponivel = ? WHERE id = ?",
            [nome, preco, categoria, quantidade, disponivel, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Lanche não encontrado ou nenhuma alteração foi feita.", success: false });
        }

        return res.status(200).json({ message: "Lanche atualizado com sucesso.", success: true });
    } catch (error) {
        console.error("Erro ao editar lanche:", error);
        return res.status(500).json({ message: "Erro interno ao atualizar lanche.", error: error.message });
    }
}

const excluirLanche = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "O ID do lanche é obrigatório.", success: false });
        }

        const [result] = await db.query("DELETE FROM lanches WHERE id = ?", [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Lanche não encontrado.", success: false });
        }

        return res.status(200).json({ message: "Lanche excluído com sucesso.", success: true });
    } catch (error) {
        console.error("Erro ao excluir lanche:", error);
        return res.status(500).json({ message: "Erro interno ao excluir lanche.", error: error.message });
    }
}

export { createLanche, getLanche, getLanchesById, editarLanche, excluirLanche };
