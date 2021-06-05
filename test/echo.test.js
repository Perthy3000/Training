const echo = require("../controller/echo");
const express = require("express");
const req = require("supertest");

const server = req(express().use(express.json()).use(echo));

describe("/echo", () => {
    describe("GET /echo/echo_get", () => {
        it("basic case", async () => {
            var res = await server.get("/echo_get");
            expect(res.status).toBe(200);
            expect(res.body).toEqual({ message: "Echo from the other side" });
        });
    });
    describe("GET /echo/echo_params/:param", () => {
        it("basic case", async () => {
            var res = await server.get("/echo_params/param");
            expect(res.status).toBe(200);
            expect(res.body).toEqual({ params: "param" });
        });
        it("404 no param case", async () => {
            var res = await server.get("/echo_params");
            expect(res.status).toBe(404);
        });
    });
    describe("GET /echo/echo_qs", () => {
        it("basic case", async () => {
            var res = await server.get("/echo_qs");
            expect(res.status).toBe(200);
            expect(res.body).toEqual({});
        });
        it("one query case", async () => {
            var res = await server.get("/echo_qs?hello=world");
            expect(res.status).toBe(200);
            expect(res.body).toEqual({ hello: "world" });
        });
    });

    describe("POST /echo", () => {
        it("basic case", async () => {
            var res = await server.post("/");
            expect(res.status).toBe(200);
            expect(res.body).toEqual({ test: "success" });
        });
    });
});
