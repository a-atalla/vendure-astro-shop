import { Controller } from "@hotwired/stimulus";
import type { CurrencyCode, Order, OrderLine } from "~/graphql/_generated";
import { formatPrice } from "~/utils";

export default class extends Controller {
	static targets = [
		"count",
		"cartContainer",
		"itemList",
		"subTotal",
		"lineItemTemplate",
		"footer",
		"emptyTemplate",
	];
	static values = {
		cart: Object,
		isOpen: false,
	};

	// values declaration
	declare cartValue: Partial<Order>;
	declare isOpenValue: boolean;
	// targets declaration
	declare readonly countTarget: HTMLElement;
	declare readonly cartContainerTarget: HTMLElement;
	declare readonly itemListTarget: HTMLElement;
	declare readonly subTotalTarget: HTMLElement;
	declare readonly lineItemTemplateTarget: HTMLElement;
	declare readonly footerTarget: HTMLElement;
	declare readonly emptyTemplateTarget: HTMLElement;

	connect() {
		this.getCart();
	}

	async getCart() {
		try {
			const res = await fetch("/api/cart");
			this.cartValue = (await res.json()) || {};
		} catch (error) {
			console.error("Could not fetch the cart: ", error);
		}
	}

	openCart() {
		this.cartContainerTarget.classList.remove("hidden");
		this.cartContainerTarget.classList.add("flex");
		document.body.style.overflow = "hidden";
	}

	closeCart() {
		this.cartContainerTarget.classList.remove("flex");
		this.cartContainerTarget.classList.add("hidden");
		document.body.style.overflow = "auto";
	}

	cartValueChanged() {
		if (this.cartValue?.lines && this.cartValue.lines.length > 0) {
			this.countTarget.classList.remove("hidden");
			this.countTarget.classList.add("flex");
			this.countTarget.innerHTML = `${this.cartValue.lines.length}`;

			this.subTotalTarget.innerHTML = formatPrice(
				this.cartValue.subTotalWithTax,
				this.cartValue.currencyCode as CurrencyCode,
			);
			this.footerTarget.classList.remove("hidden");

			const html = this.lineItemTemplateTarget.innerHTML;
			this.itemListTarget.innerHTML = "";
			for (const line of this.cartValue.lines) {
				const lineItem = this.renderLineItem(html, line);
				this.itemListTarget.appendChild(lineItem);
			}
		} else {
			this.countTarget.classList.remove("flex");
			this.countTarget.classList.add("hidden");
			this.itemListTarget.innerHTML = this.emptyTemplateTarget.innerHTML;
			this.footerTarget.classList.add("hidden");
		}
	}

	renderLineItem(html: string, line: OrderLine): HTMLElement {
		const lineItem = new DOMParser().parseFromString(html, "text/html").body
			.firstChild as HTMLElement;

		lineItem
			.querySelector("#lineItemImage")
			?.setAttribute("src", line.featuredAsset?.preview as string);

		const nameElement = lineItem.querySelector("#lineItemName") as HTMLElement;
		nameElement.textContent = line.productVariant?.name;
		const priceElement = lineItem.querySelector(
			"#lineItemPrice",
		) as HTMLElement;
		priceElement.textContent = formatPrice(
			line.linePriceWithTax,
			this.cartValue.currencyCode as CurrencyCode,
		);

		const qtySelector = lineItem.querySelector(
			"#lineItemQuantity",
		) as HTMLSelectElement;
		qtySelector.value = line.quantity.toString();
		qtySelector.setAttribute("data-line-id", line.id);
		const removeBtn = lineItem.querySelector(
			"#lineItemRemoveBtn",
		) as HTMLElement;
		removeBtn.setAttribute("data-line-id", line.id);
		return lineItem;
	}

	async deleteLineItem(event: Event) {
		// extcract data-line-id from currentTarget
		const lineId = (event.currentTarget as HTMLElement).dataset.lineId;
		const res = await fetch("/api/cart", {
			method: "DELETE",
			body: JSON.stringify({ lineId }),
		});
		const data = await res.json();
		this.cartValue = data;
	}

	async updateCartLine(event: Event) {
		const lineId = (event.target as HTMLElement).dataset.lineId as string;
		const quantity = (event.target as HTMLSelectElement).value as string;
		const res = await fetch("/api/cart", {
			method: "PATCH",
			body: JSON.stringify({
				lineId: Number.parseInt(lineId, 10),
				quantity: Number.parseInt(quantity, 10),
			}),
		});
	}
}
