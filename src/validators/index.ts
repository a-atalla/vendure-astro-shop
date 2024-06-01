import { z } from "astro/zod";

export const OrderFormValidator = z
	.object({
		emailAddress: z.string().email(),
		firstName: z.string().min(1),
		lastName: z.string().min(1),
		city: z.string().min(1),
		countryCode: z.string().min(1),
		streetLine1: z.string().min(1),
		phoneNumber: z.string().min(1),
		shippingMethod: z.string(),
		paymentMethod: z.string(),
	})
	.required({
		emailAddress: true,
		firstName: true,
		lastName: true,
		city: true,
		countryCode: true,
		streetLine1: true,
		phoneNumber: true,
		shippingMethod: true,
		paymentMethod: true,
	});
