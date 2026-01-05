import request from "supertest";
import mongoose from "mongoose";
import { app } from "../app.js"; // Certifique-se de exportar o app em app.js

const MONGO_TEST_URI =
    process.env.MONGO_TEST_URI || "mongodb://localhost:27017/postsdb_test";

beforeAll(async () => {
    await mongoose.connect(MONGO_TEST_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
});

describe("Posts API", () => {
    let postId;

    it("deve criar um novo post", async () => {
        const res = await request(app)
            .post("/posts")
            .send({
                title: "Teste",
                content: [
                    { type: "subtitle", value: "O que é UX" },
                    {
                        type: "contentSubtitle",
                        value: "UX trata da experiência do usuário ao interagir com um produto.",
                    },
                    {
                        type: "initialConcepts",
                        value: "Usabilidade, acessibilidade e satisfação.",
                    },
                    { type: "link", value: "https://www.example.com" },
                ],
                matter: "Matemática",
                classNumber: "101",
                teacher: "Professor X",
                image: "http://image.url",
                author: "Autor",
                userId: 1,
                posted: true,
                excluded: false,
            });
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("_id");
        postId = res.body._id;
    });

    it("deve listar todos os posts", async () => {
        const res = await request(app).get("/posts");
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it("deve buscar um post por ID", async () => {
        const res = await request(app).get(`/posts/${postId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("_id", postId);
    });

    it("deve atualizar um post", async () => {
        const res = await request(app)
            .put(`/posts/${postId}`)
            .send({ title: "Atualizado" });
        expect(res.statusCode).toBe(200);
        expect(res.body.title).toBe("Atualizado");
    });

    it("deve buscar posts por palavra-chave", async () => {
        await request(app)
            .post("/posts")
            .send({
                title: "Palavra-chave",
                matter: "UI/UX para desenvolvedores",
                classNumber: "Aula 1",
                teacher: "Gustavo",
                image: "/classes/banner-aula-1.png",
                content: [{ type: "subtitle", value: "Conteúdo da aula" }],
                userId: "1",
                posted: true,
                excluded: false,
            });

        const res = await request(app).get("/posts/search?q=Palavra-chave");

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0].title).toBe("Palavra-chave");
    });

    it("deve remover um post", async () => {
        // Cria um post só para este teste
        const post = await request(app)
            .post("/posts")
            .send({
                title: "Para Remover",
                content: [{ type: "subtitle", value: "Conteúdo da aula" }],
                matter: "Teste",
                classNumber: "Aula X",
                teacher: "Professor Y",
                userId: 1,
                image: "http://image.url",
                posted: true,
                excluded: false,
            });
        const idParaRemover = post.body._id;

        const res = await request(app).delete(`/posts/${idParaRemover}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("message");
    });
});
