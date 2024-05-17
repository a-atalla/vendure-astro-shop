import { Application } from "@hotwired/stimulus";

import CartController from "~/scripts/controllers/cart-controller";

const Stimulus = Application.start();

Stimulus.register("cart", CartController);
