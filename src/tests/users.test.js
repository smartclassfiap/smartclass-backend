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

describe("Users API", () => {
    let userId;

    it("deve criar um novo usuário", async () => {
        const res = await request(app).post("/users").send({
            name: "Usuário Teste",
            username: "usuarioteste",
            password: "senha123",
            email: "teste@email.com",
            isActive: true,
            role: "aluno",
            mobilePhone: "1234567890",
        });
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("_id");
        userId = res.body._id;
    });

    it("deve listar todos os usuários", async () => {
        const res = await request(app).get("/users/");
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it("deve buscar um usuário por ID", async () => {
        const res = await request(app).get(`/users/${userId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("_id", userId);
    });

    it("deve atualizar um usuário", async () => {
        const res = await request(app)
            .put(`/users/${userId}`)
            .send({ name: "Atualizado", email: "novo@email.com" });
        expect(res.statusCode).toBe(200);
        expect(res.body.name).toBe("Atualizado");
        expect(res.body.email).toBe("novo@email.com");
    });

    // it("deve buscar usuários por palavra-chave", async () => {
    // const res = await request(app).get("/users/search?name=Atualizado");
    // expect(res.statusCode).toBe(200);
    // expect(Array.isArray(res.body)).toBe(true);
    // expect(res.body.length).toBeGreaterThan(0);
    // expect(res.body[0].name).toBe("Atualizado");
    // });

    it("deve remover um usuário", async () => {
        // Cria um user só para este teste
        const post = await request(app).post("/users").send({
            name: "Usuário Teste",
            username: "usuarioteste",
            password: "senha123",
            email: "teste@email.com",
            isActive: true,
            role: "aluno",
            mobilePhone: "1234567890",
        });
        const idParaRemover = post.body._id;

        const res = await request(app).delete(`/users/${idParaRemover}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.user.isActive).toBe(false);
    });
});
