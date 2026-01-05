import { Post } from "../models/post.model.js";

/**
 * GET /posts
 * Lista todos os posts
 */
export const getAllPosts = async (req, res) => {
    const role = req.query.role;
    try {
        let filter = {};
        if (role === "aluno") {
            filter.posted = true;
        }
        if (role === "aluno" || role === "professor") {
            filter.excluded = false;
        }
        const posts = await Post.find(filter).sort({ _id: 1 });
        res.json(posts);
    } catch (err) {
        res.status(500).json({
            error: "Erro ao buscar posts",
            details: err.message,
        });
    }
};

/**
 * GET /posts/:id
 * Retorna um post pelo ID
 */
export const getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ error: "Post não encontrado" });
        }
        res.json(post);
    } catch (err) {
        res.status(500).json({
            error: "Erro ao buscar post",
            details: err.message,
        });
    }
};

/**
 * POST /posts
 * Cria uma nova postagem
 */
export const createPost = async (req, res) => {
    const {
        title,
        content,
        matter,
        classNumber,
        teacher,
        userId,
        image,
        posted,
        excluded,
    } = req.body;

    if (
        !title ||
        !matter ||
        !classNumber ||
        !content ||
        !teacher ||
        !userId ||
        !image ||
        posted === undefined ||
        excluded === undefined
    ) {
        return res.status(400).json({
            error: "Título, conteúdo, matéria, professor, usuário e url da imagem, são obrigatórios",
        });
    }
    try {
        const newPost = await Post.create({
            title,
            matter,
            classNumber,
            content,
            teacher,
            userId,
            image,
            posted,
            excluded,
        });
        res.status(201).json(newPost);
    } catch (err) {
        console.log(err.message);

        res.status(500).json({
            error: "Erro ao criar post",
            details: err.message,
        });
    }
};

/**
 * PUT /posts/:id
 * Atualiza uma postagem existente
 */
export const updatePost = async (req, res) => {
    const { title, content, author } = req.body;
    try {
        const updated = await Post.findByIdAndUpdate(
            req.params.id,
            { $set: { title, content, author } },
            { new: true, runValidators: true }
        );
        if (!updated) {
            return res.status(404).json({ error: "Post não encontrado" });
        }
        res.json(updated);
    } catch (err) {
        res.status(500).json({
            error: "Erro ao atualizar post",
            details: err.message,
        });
    }
};

/**
 * DELETE /posts/:id
 * Remove uma postagem
 */
export const deletePost = async (req, res) => {
    try {
        const deleted = await Post.findByIdAndUpdate(
            req.params.id,
            { $set: { excluded: true } },
            { new: true, runValidators: true }
        );
        if (!deleted) {
            return res.status(404).json({ error: "Post não encontrado" });
        }
        res.json({ message: "Post removido com sucesso", post: deleted });
    } catch (err) {
        res.status(500).json({
            error: "Erro ao remover post",
            details: err.message,
        });
    }
};

/**
 * GET /posts/search
 * Busca posts por palavra-chave
 */
export const searchPosts = async (req, res) => {
    const { q } = req.query;

    if (!q) {
        return res
            .status(400)
            .json({ error: 'Parâmetro de busca "q" é obrigatório' });
    }

    try {
        let regex;
        try {
            regex = new RegExp(q, "i");
        } catch (e) {
            return res
                .status(400)
                .json({ error: "Expressão de busca inválida" });
        }

        const results = await Post.find({
            excluded: false,
            posted: true,
            $or: [
                { title: regex },
                { matter: regex },
                { teacher: regex },
                { "content.value": regex },
            ],
        });

        return res.status(200).json(results);
    } catch (err) {
        console.error("Erro ao buscar posts:", err);
        return res.status(500).json({
            error: "Erro ao buscar posts",
            details: err.message,
        });
    }
};
