import { defineMiddleware, sequence } from "astro:middleware";

// `context` and `next` are automatically typed
export const errorHansdler = defineMiddleware(async (context, next) => {
	const response = await next();
	return response;
});

export const onRequest = sequence(errorHansdler);
