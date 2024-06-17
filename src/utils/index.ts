import type { CurrencyCode } from "~/graphql/_generated";

export function formatPrice(
	priceWithTax: any,
	currencyCode: CurrencyCode,
): string {
	const format = (value: number, currency: CurrencyCode) => {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency,
		}).format(value / 100);
	};

	if (priceWithTax == null || !currencyCode) {
		return "";
	}
	if (typeof priceWithTax === "number") {
		return format(priceWithTax, currencyCode);
	}
	if ("value" in priceWithTax) {
		return format(priceWithTax.value, currencyCode);
	}
	if (priceWithTax.min === priceWithTax.max) {
		return format(priceWithTax.min, currencyCode);
	}
	return `${format(priceWithTax.min, currencyCode)} - ${format(
		priceWithTax.max,
		currencyCode,
	)}`;
}
export type FacetValue = {
	id: string;
	name: string;
	count: number;
};

export function aggregateFacetValues(
	data: any[],
): Record<string, Array<FacetValue>> {
	return data.reduce(
		(acc, item) => {
			const facetName = item.facetValue.facet.name;
			const facetValueName = item.facetValue.name;
			if (!acc[facetName]) {
				acc[facetName] = [];
			}
			const f = {
				id: item.facetValue.id,
				name: facetValueName,
				count: item.count,
			};
			acc[facetName].push(f);

			return acc;
		},
		{} as Record<string, string[]>,
	);
}
