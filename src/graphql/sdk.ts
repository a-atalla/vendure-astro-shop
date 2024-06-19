import type { AstroCookies } from "astro";
import { type DocumentNode, print } from "graphql";
import { getSdk } from "~/graphql/_generated";

const API_URL = import.meta.env.VENDURE_SHOP_API;
const AUTH_TOKEN_SESSION_KEY = "vendure-auth-token";
const VENDURE_CHANNEL_TOKEN = import.meta.env.VENDURE_CHANNEL_TOKEN;

export interface QueryOptions {
	// headers?: Headers;
	// request?: Request;
	astroCookies?: AstroCookies;
}

export interface GraphqlResponse<Response> {
	errors: any[];
	data: Response;
}

export type WithHeaders<T> = T & { _headers: Headers };

async function sendQuery<Response, Variables = {}>(options: {
	query: string;
	variables?: Variables;
	headers?: Headers;
	request?: Request;
	astroCookies?: AstroCookies;
}): Promise<GraphqlResponse<Response> & { headers: Headers }> {
	const headers = new Headers(options.headers);
	headers.append("Content-Type", "application/json");
	if (VENDURE_CHANNEL_TOKEN) {
		headers.append("vendure-token", VENDURE_CHANNEL_TOKEN);
	}

	const vendureAuthToken = options.astroCookies?.get(AUTH_TOKEN_SESSION_KEY);
	if (vendureAuthToken) {
		headers.append("Authorization", `Bearer ${vendureAuthToken.value}`);
	}
	return fetch(API_URL, {
		method: "POST",
		body: JSON.stringify(options),
		headers,
	})
		.then(async (res) => ({
			...(await res.json()),
			headers: res.headers,
		}))
		.catch((err) => {
			console.error("######", err.message);
			throw err;
		});
}

const baseSdk = getSdk<QueryOptions>(requester);

type Sdk = typeof baseSdk;
type SdkWithHeaders = {
	[k in keyof Sdk]: (
		...args: Parameters<Sdk[k]>
	) => Promise<Awaited<ReturnType<Sdk[k]>> & { _headers: Headers }>;
};

export const sdk: SdkWithHeaders = baseSdk as any;

function requester<R, V>(
	doc: DocumentNode,
	vars?: V,
	options?: {
		headers?: Headers;
		request?: Request;
		astroCookies?: AstroCookies;
	},
): Promise<R & { _headers: Headers }> {
	return sendQuery<R, V>({
		query: print(doc),
		variables: vars,
		...options,
	}).then(async (response) => {
		const token = response.headers.get(AUTH_TOKEN_SESSION_KEY);
		const headers: Record<string, string> = {};
		if (token) {
			options?.astroCookies?.set(AUTH_TOKEN_SESSION_KEY, token, {
				path: "/",
				secure: import.meta.env.NODE_ENV === "production",
				httpOnly: true,
			});
		}
		headers["x-vendure-api-url"] = API_URL;
		if (response.errors) {
			console.log(
				response.errors[0].extensions?.exception?.stacktrace.join("\n") ??
					response.errors,
			);
			throw new Error(JSON.stringify(response.errors[0]));
		}
		return { ...response.data, _headers: new Headers(headers) };
	});
}
