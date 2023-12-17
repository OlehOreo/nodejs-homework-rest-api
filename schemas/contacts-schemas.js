import Joi from "joi";

export const contactAddSchema = Joi.object({
	name: Joi.string().required().messages({ "any.required": "missing required name field" }),
	email: Joi.string()
		.email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "ca", "org", "uk"] } })
		.required()
		.messages({ "any.required": "missing required email field" }),
	phone: Joi.string()
		.trim()
		.regex(/^\(\d{3}\) \d{3}-\d{4}$/)
		.required()
		.messages({ "any.required": "missing required phone field" }),
});
export const contactUpdateSchema = Joi.object({
	name: Joi.string(),
	email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "ca", "org", "uk"] } }),
	phone: Joi.string()
		.trim()
		.regex(/^\(\d{3}\) \d{3}-\d{4}$/),
});
