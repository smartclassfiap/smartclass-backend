import { User } from "../models/user.model.js";

/*
 * GET/users
 *  Lista de todos os usuarios
 */

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().sort({ _id: 1 });
        res.json(users);
    } catch (err) {
        res.status(500).json({
            error: "Erro ao buscar usuários",
            details: err.message,
        });
    }
};

/**
 * GET /users/:id
 * Retorna um user pelo ID
 */

export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: "User não encontrado" });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({
            error: "Erro ao buscar user",
            details: err.message,
        });
    }
};

/**
 * POST /users
 * Cria um novo User
 */
export const createUser = async (req, res) => {
    const { name, username, password, email, isActive, role, mobilePhone } =
        req.body;

    if (
        !name ||
        !username ||
        !password ||
        !email ||
        !isActive ||
        !role ||
        !mobilePhone
    ) {
        return res.status(400).json({
            error: `Os valores: name, username, password, email, isActive, 
            São obrigatórios!`,
        });
    }
    try {
        const newUser = await User.create({
            name,
            username,
            password,
            email,
            isActive,
            role,
            mobilePhone,
        });
        res.status(201).json(newUser);
    } catch (err) {
        res.status(500).json({
            error: "Erro ao criar user",
            details: err.message,
        });
    }
};

/**
 * PUT /users/:id
 * Atualiza o cadastro do usuario
 */
export const updateUser = async (req, res) => {
    const { name, email, mobilePhone, password, isActive } = req.body;
    try {
        const updated = await User.findByIdAndUpdate(
            req.params.id,
            { $set: { name, email, mobilePhone, password, isActive } },
            { new: true, runValidators: true }
        );
        if (!updated) {
            return res.status(404).json({ error: "User não encontrado" });
        }
        return res.json(updated);
    } catch (err) {
        res.status(500).json({
            error: "Erro ao atualizar User",
            details: err.message,
        });
    }
};

/**
 * DELETE /users/:id
 * Remove um usuario
 */
export const deleteUser = async (req, res) => {
    try {
        const deleted = await User.findByIdAndUpdate(
            req.params.id,
            { $set: { isActive: false } },
            { new: true, runValidators: true }
        );

        if (!deleted) {
            return res.status(500).json({ error: "User não encontrado" });
        }
        res.json({ message: "User inativado com sucesso", user: deleted });
    } catch (err) {
        res.status(500).json({
            error: "Erro ao remover User",
            details: err.message,
        });
    }
};
/**
 * GET /users/search
 * Busca usuario por palavra-chave
 */

export const searchUsers = async (req, res) => {
    const { name } = req.params.query;
    if (!name) {
        return res
            .status(400)
            .json({ error: 'Parâmetro de busca "name" é obrigatório' });
    }
    try {
        // Protege contra regex inválido
        let regex;
        try {
            regex = new RegExp(name, "i");
        } catch (e) {
            return res
                .status(400)
                .json({ error: "Expressão de busca inválida" });
        }
        const results = await User.find({
            $or: [{ name: regex }, { content: regex }],
        });
        res.json(results);
    } catch (err) {
        console.error("Erro ao buscar user:", err);
        res.status(500).json({
            error: "Erro ao buscar user:",
            details: err.message,
        });
    }
};
