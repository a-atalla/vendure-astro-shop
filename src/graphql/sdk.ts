import { type DocumentNode, print } from "graphql";

import { getSdk } from "./_generated";
import type { AstroCookies } from "astro";

const API_URL = "https://demo.vendure.io/shop-api"; // for arabic translations append "?languageCode=ar"

export interface QueryOptions {
	cookies: AstroCookies;
}

export interface GraphqlResponse<Response> {
	errors: any[];
	data: Response;
}

export type WithHeaders<T> = T & { _headers: Headers };

async function sendQuery<
	Response,
	Variables = Record<string, unknown>,
>(options: {
	query: string;
	variables?: Variables;
	headers?: Headers;
	cookies?: AstroCookies;
}): Promise<GraphqlResponse<Response> & { headers: Headers }> {
	const headers = new Headers(options.headers);
	headers.append("Content-Type", "application/json");

	const vendureAuthToken = options.cookies?.get("vendure-auth-token");
	if (vendureAuthToken) {
		headers.append("Authorization", `Bearer ${vendureAuthToken}`);
	}

	const channelToken = import.meta.env.VENDURE_CHANNEL_TOKEN;
	if (channelToken) {
		headers.append("vendure-token", channelToken);
	}

	return fetch(API_URL, {
		credentials: "include",
		method: "POST",
		body: JSON.stringify(options),
		headers,
	}).then(async (res) => ({
		...(await res.json()),
		headers: res.headers,
	}));
}

const baseSdk = getSdk<QueryOptions>(requester);

type Sdk = typeof baseSdk;
type SdkWithHeaders = {
	[k in keyof Sdk]: (
		...args: Parameters<Sdk[k]>
	) => Promise<Awaited<ReturnType<Sdk[k]>> & { _headers: Headers }>;
};

export const sdk: SdkWithHeaders = baseSdk as SdkWithHeaders;

function requester<R, V>(
	doc: DocumentNode,
	vars?: V,
	options?: { headers?: Headers; cookies?: AstroCookies },
): Promise<R & { _headers: Headers }> {
	return sendQuery<R, V>({
		query: print(doc),
		variables: vars,
		...options,
	}).then(async (response) => {
		const token = response.headers.get("vendure-auth-token");
		const headers = new Headers();

		if (token) {
			options?.cookies?.set("vendure-auth-token", token, {
				httpOnly: true,
				sameSite: "strict",
				secure: import.meta.env.NODE_ENV === "production",
			});
			console.log("Storing new auth token in astro cookies");
		}
		headers.set("vendure-api-url", API_URL);
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
