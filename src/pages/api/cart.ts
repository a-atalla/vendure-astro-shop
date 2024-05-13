import type { APIRoute } from "astro";
import { sdk } from "~/graphql/sdk";

export const GET: APIRoute = async ({ cookies }) => {
	const cart = await sdk.getActiveOrder(undefined, { astroCookies: cookies });
	return new Response(JSON.stringify(cart.activeOrder));
};
