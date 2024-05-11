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
