import { Application } from "@hotwired/stimulus";

import CartController from "~/scripts/controllers/cart-controller";
import FiltersController from "~/scripts/controllers/filters-controller";
const Stimulus = Application.start();

Stimulus.register("cart", CartController);
Stimulus.register("filters", FiltersController);
