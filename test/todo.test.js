const req = require("supertest");
const express = require("express");
const todo = require("../controller/todo");
const test_db = require("./test_db");
const Todo = require("../db/schema/todo");

const server = req(express().use(express.json()).use(todo));

describe("/no_auth", () => {
    describe("GET /no_auth/todos", () => {
        it("basic case (zero data)", async () => {
            var res = await server.get("/todos");
            expect(res.status).toBe(200);
            expect(res.body).toEqual({ count: 0, data: [], success: true });
        });
        it("non zero data case", async () => {
            const data = [
                { title: "title1", order: 1 },
                { title: "title2", order: 2 },
            ];
            await Todo.insertMany(data);
            var res = await server.get("/todos");
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.count).toBe(data.length);
        });
    });
    describe("GET /no_auth/todos/:_id", () => {
        it("basic case", async () => {
            const data = await Todo.create({ title: "title1", order: 1 });
            var res = await server.get(`/todos/${data._id}`);
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data[0].title).toBe(data.title);
            expect(res.body.data[0].order).toBe(data.order);
        });
        it("400 todo not found case", async () => {
            const data = await Todo.create({ title: "title1", order: 1 });
            await Todo.deleteMany({});
            var res = await server.get(`/todos/${data._id}`);
            expect(res.status).toBe(400);
        });
    });
    describe("POST /no_auth/todos", () => {
        it("basic case", async () => {
            var res = await server.post("/todos").send({ title: "title1" });
            expect(res.status).toBe(200);
            expect(res.body.data.title).toBe("title1");
            expect(res.body.data.order).toBe(1);
        });
        it("start at order 1 case", async () => {
            await Todo.create({ title: "title1", order: 1 });
            var res = await server.post("/todos").send({ title: "title2" });
            expect(res.status).toBe(200);
            expect(res.body.data.title).toBe("title2");
            expect(res.body.data.order).toBe(2);
        });
    });
    describe("PUT /no_auth/todos/:_id", () => {
        it("basic case", async () => {
            const data = await Todo.create({ title: "title1", order: 1 });
            var res = await server
                .put(`/todos/${data._id}`)
                .send({ title: "title2" });
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.title).toBe("title2");
        });
        it("400 todo not found case", async () => {
            const data = await Todo.create({ title: "title1", order: 1 });
            await Todo.deleteMany({});
            var res = await server
                .put(`/todos/${data._id}`)
                .send({ title: "title2" });
            expect(res.status).toBe(400);
            expect(res.body.error).toBe("todo not found");
        });
    });
    describe("DELETE /no_auth/todos/:_id", () => {
        it("basic case", async () => {
            const data = await Todo.create({ title: "title1", order: 1 });
            var res = await server.delete(`/todos/${data._id}`);
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });
        it("400 todo not found case", async () => {
            const data = await Todo.create({ title: "title1", order: 1 });
            await Todo.deleteMany({});
            var res = await server.delete(`/todos/${data._id}`);
            expect(res.status).toBe(400);
            expect(res.body.error).toBe("todo not found");
        });
    });
});

beforeEach(async () => {
    await test_db.clearDatabase();
});

beforeAll(async () => {
    await test_db.connect();
});

afterAll(async () => {
    await test_db.closeDatabase();
});
