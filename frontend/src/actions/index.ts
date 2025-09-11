import { handleAuthAction } from "@/utils/auth";
import { z } from "astro/zod";
import { defineAction } from "astro:actions";

export const server = {
	login: defineAction({
		input: z.object({
			email: z.string().email(),
			password: z.string()
		}),
		handler: async ({ email, password }, { cookies }) => {

			try {

				const data = await handleAuthAction("login", { email, password }, cookies);
				return (data);

			} catch (error) {

				console.error('Login error in action:', error);
				throw new Error('Login failed');

			};

		}
	}),
	signUp: defineAction({
		input: z.object({
			name: z.string(),
			email: z.string().email(),
			password: z.string(),
		}),
		handler: async({ name, email, password }, { cookies }) => {

			try {

				const data = await handleAuthAction("signUp", { name, email, password }, cookies);
				return (data);

			} catch (error) {

				console.error("Signup error in action", error);
				throw new Error("Signup failed");

			}

		}
	})
};