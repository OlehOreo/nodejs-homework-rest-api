import Contact from "../models/Contact.js";
import { HttpError } from "../helpers/index.js";
import { ctrlWrapper } from "../decorators/index.js";

const getAll = async (req, res) => {
	const result = await Contact.find({}, "-createdAt -updatedAt");
	res.json(result);
};

const getById = async (req, res) => {
	const { contactId } = req.params;
	const result = await Contact.findById(contactId);
	console.log("result", result);
	if (!result) {
		throw HttpError(404, `Contact with id=${contactId} not found`);
	}

	res.json(result);
};

const add = async (req, res) => {
	const result = await Contact.create(req.body);

	res.status(201).json(result);
};

const deleteById = async (req, res) => {
	const { contactId } = req.params;
	const result = await Contact.findByIdAndDelete(contactId);
	if (!result) {
		throw HttpError(404);
	}
	res.json({ message: "contact deleted" });
};

const updateById = async (req, res) => {
	const { contactId } = req.params;
	const result = await Contact.findByIdAndUpdate(contactId, req.body);
	if (!result) {
		throw HttpError(404);
	}
	res.json(result);
};

const updateStatusContact = async (req, res) => {
	const { contactId } = req.params;
	const result = await Contact.findByIdAndUpdate(contactId, req.body);
	if (!result) {
		throw HttpError(404);
	}
	res.json(result);
};

export default {
	getAll: ctrlWrapper(getAll),
	getById: ctrlWrapper(getById),
	add: ctrlWrapper(add),
	deleteById: ctrlWrapper(deleteById),
	updateById: ctrlWrapper(updateById),
	updateStatusContact: ctrlWrapper(updateStatusContact),
};
