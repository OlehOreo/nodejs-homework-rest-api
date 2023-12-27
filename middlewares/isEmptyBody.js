import { HttpError } from "../helpers/index.js";

const isEmptyBody = (req, res, next) => {
	const { length } = Object.keys(req.body);

	if (!length) {
		return req.method === "PATCH"
			? next(HttpError(400, "missing field favorite"))
			: next(HttpError(400, "missing fields"));
	}

	next();
};

export default isEmptyBody;
