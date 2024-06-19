import { Controller } from "@hotwired/stimulus";
import { useWindowResize } from "stimulus-use";

export default class extends Controller {
	static targets = ["sidebar"];

	declare readonly sidebarTarget: HTMLElement;

	connect() {
		useWindowResize(this);
	}
	windowResize({ width }: { width: number }) {
		if (width > 1024) {
			this.sidebarTarget.classList.add("translate-x-full");
			this.sidebarTarget.classList.remove("translate-x-0");
		}
	}
	toggleFilterSidebar(event: Event): void {
		this.sidebarTarget.classList.toggle("translate-x-full");
		this.sidebarTarget.classList.toggle("translate-x-0");
	}
}
