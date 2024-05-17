import { Controller } from "@hotwired/stimulus";
import type { Order } from "~/graphql/_generated";

export default class extends Controller {
	static targets = ["count"];
	static values = {
		cart: Object,
	};

	// typescript declarations
	// targets
	declare readonly hasCountTarget: boolean;
	declare readonly countTarget: HTMLElement;
	declare readonly countTargets: HTMLElement[];

	// values
	declare cartValue: Partial<Order>;
	declare readonly hasCartValue: boolean;

	connect() {
		this.getCart();
	}

	cartValueChanged() {
		console.log(this.cartValue);
		if (this.cartValue?.lines) {
			this.countTarget.classList.remove("hidden");
			this.countTarget.classList.add("flex");
			this.countTarget.innerHTML = `${this.cartValue.lines.length}`;
		} else {
			this.countTarget.classList.remove("flex");
			this.countTarget.classList.add("hidden");
		}
	}

	async getCart() {
		const res = await fetch("/api/cart");
		this.cartValue = await res.json();
	}
}
