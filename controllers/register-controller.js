import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/User.js";
import { HttpError } from "../helpers/index.js";
import { ctrlWrapper } from "../decorators/index.js";

const { JWT_SECRET } = process.env;

const signUp = async (req, res) => {
	const { email, password } = req.body;
	const user = await User.findOne({ email });

	if (user) {
		throw HttpError(409, "Email in use");
	}
	const hashPassword = await bcrypt.hash(password, 10);

	const newUser = await User.create({ ...req.body, password: hashPassword });

	res.status(201).json({ user: { email: newUser.email, subscription: newUser.subscription } });
};

const signIn = async (req, res) => {
	const { email, password } = req.body;
	const user = await User.findOne({ email });

	if (!user) {
		throw HttpError(401, "Email or password is wrong");
	}

	const passwordCompare = await bcrypt.compare(password, user.password);
	if (!passwordCompare) {
		throw HttpError(401, "Email or password is wrong");
	}

	const { _id: id } = user;
	const payload = {
		id,
	};

	const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
	
	await User.findByIdAndUpdate(id, { token });

	res.json({
		token,
		user: {
			email: user.email,
			subscription: user.subscription,
		},
	});
};

const getCurrent = async (req, res) => {
	const { email, subscription } = req.user;
	res.json({
		email,
		subscription,
	});
};

const logOut = async (req, res) => {
	const { _id } = req.user;
	await User.findByIdAndUpdate(_id, { token: "" });
	res.status(204).send();
};

const updateSubscription = async (req, res) => {
	const { _id: owner, subscription: old } = req.user;
	console.log(old);
	const result = await User.findOneAndUpdate(owner, req.body);
	const { subscription: newSubscription } = req.body;
	if (!result) {
		throw HttpError(404);
	}
	if (old === newSubscription) {
		throw HttpError(409, `your subscription now ${newSubscription} choose another`);
	}
	res.json({
		message: `subscription changed from ${old} to ${newSubscription}`,
		email: result.email,
	});
};

export default {
	signUp: ctrlWrapper(signUp),
	signIn: ctrlWrapper(signIn),
	getCurrent: ctrlWrapper(getCurrent),
	logOut: ctrlWrapper(logOut),
	updateSubscription: ctrlWrapper(updateSubscription),
};