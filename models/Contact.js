import { Schema, model } from "mongoose";
import { handleSaveError, addUpdateSettings } from "./hooks.js";
import Joi from "joi";

const contactSchema = new Schema(
	{
		name: {
			type: String,
			required: [true, "Set name for contact"],
		},
		email: {
			type: String,
		},
		phone: {
			type: String,
		},
		favorite: {
			type: Boolean,
			default: false,
		},
	},
	{ versionKey: false, timestamps: true }
);

contactSchema.post("save", handleSaveError);

contactSchema.pre("findOneAndUpdate", addUpdateSettings);

contactSchema.post("findOneAndUpdate", handleSaveError);

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

export const contactUpdateFavoriteSchema = Joi.object({ favorite: Joi.boolean().required() });

const Contact = model("contact", contactSchema);

export default Contact;
