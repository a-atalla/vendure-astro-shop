import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
	static targets = ["count"];
	static values = { cart: {} };

	connect() {
		this.getCart();
	}

	cartValueChanged() {
		console.log(this.cartValue);
		if (this.cartValue?.lines) {
			// toggle class on target
			this.countTarget.classList.remove("hidden");
			this.countTarget.classList.add("flex");

			// set the count
			this.countTarget.innerHTML = this.cartValue.lines.length;
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
