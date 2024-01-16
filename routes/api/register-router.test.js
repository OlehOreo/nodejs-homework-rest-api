import mongoose from "mongoose";
import request from "supertest";
import "dotenv/config";

import app from "../../app.js";

const { TEST_DB_HOST, PORT = 3000 } = process.env;

describe("test /api/users/login", () => {
	let server = null;

	beforeAll(async () => {
		await mongoose.connect(TEST_DB_HOST);
		server = app.listen(PORT);
	});

	afterAll(async () => {
		await mongoose.connection.close();
		server.close();
	});

	const signInData = {
		email: "petro@gmail.com",
		password: "qwerty",
	};

	test("should return status code 200", async () => {
		const response = await request(app).post("/api/users/login").send(signInData);

		expect(response.status).toBe(200);
	});

	test("should return a token in the response", async () => {
		const response = await request(app).post("/api/users/login").send(signInData);
		expect(response.body.token).toBeDefined();
	});

	test("should return user={email: string , subscription: string}", async () => {
		const response = await request(app).post("/api/users/login").send(signInData);

		const { user } = JSON.parse(response.text);

		expect(user).toEqual({
			email: expect.any(String),
			subscription: expect.any(String),
		});
	});
});
