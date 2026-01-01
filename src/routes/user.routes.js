import { Router } from "express";
import {
    getAllUsers,
    getUserById,
    searchUsers,
    createUser,
    updateUser,
    deleteUser,
    loginUser,
} from "../controllers/user.controller.js";

const routerUsers = Router();

routerUsers.get('/users/login', loginUser);

/**
 * @swagger
 * /users:
 *   get:
 *     tags:
 *      - Usuários
 *     summary: Lista todos os usuários
 *     responses:
 *       200:
 *         description: Lista de usuários
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
routerUsers.get("/users/", getAllUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     tags:
 *      - Usuários
 *     summary: Retorna um usuário por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Usuário não encontrado
 */
routerUsers.get("/users/:id", getUserById);

// /**
//  * @swagger
//  * /users/search:
//  *   get:
//  *     tags:
//  *      - Usuários
//  *     summary: Busca usuários por palavra-chave
//  *     parameters:
//  *       - in: query
//  *         name: name
//  *         schema:
//  *           type: string
//  *         required: true
//  *         description: Nome do usuário para busca
//  *     responses:
//  *       200:
//  *         description: Lista de usuários encontrados
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: array
//  *               items:
//  *                 $ref: '#/components/schemas/User'
//  *       400:
//  *         description: Parâmetro de busca "name" é obrigatório
//  */
// routerUsers.get("/users/search", searchUsers);

/**
 * @swagger
 * /users:
 *   post:
 *     tags:
 *      - Usuários
 *     summary: Cria um novo usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       201:
 *         description: Usuário criado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Dados obrigatórios ausentes
 */
routerUsers.post("/users", createUser);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     tags:
 *      - Usuários
 *     summary: Atualiza um usuário existente
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserUpdate'
 *     responses:
 *       200:
 *         description: Usuário atualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Usuário não encontrado
 */
routerUsers.put("/users/:id", updateUser);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     tags:
 *      - Usuários
 *     summary: Remove um usuário
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Usuário removido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 messsage:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       404:
 *         description: Usuário não encontrado
 */
routerUsers.delete("/users/:id", deleteUser);

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         username:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         isActive:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *         mobilePhone:
 *           type: string
 *     UserInput:
 *       type: object
 *       required:
 *         - name
 *         - username
 *         - password
 *         - email
 *         - isActive
 *         - role
 *       properties:
 *         name:
 *           type: string
 *         username:
 *           type: string
 *         password:
 *           type: string
 *         email:
 *           type: string
 *         isActive:
 *           type: boolean
 *         role:
 *           type: string
 *           enum: [professor, aluno, administrador]
 *         mobilePhone:
 *           type: string
 *     UserUpdate:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         mobilePhone:
 *           type: string
 *         password:
 *           type: string
 *         isActive:
 *           type: boolean
 */
export default routerUsers;
