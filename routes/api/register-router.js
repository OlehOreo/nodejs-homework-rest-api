import express from "express";

import registerController from "../../controllers/register-controller.js";
import { isEmptyBody, authenticate } from "../../middlewares/index.js";
import { validateBody } from "../../decorators/index.js";

import { userSignUpSchema, userSignInSchema, userUpdateSubscriptionSchema } from "../../models/User.js";

const registerRouter = express.Router();

registerRouter.patch(
	"/",
	authenticate,
	isEmptyBody,
	validateBody(userUpdateSubscriptionSchema),
	registerController.updateSubscription
);

registerRouter.post("/register", isEmptyBody, validateBody(userSignUpSchema), registerController.signUp);

registerRouter.post("/login", isEmptyBody, validateBody(userSignInSchema), registerController.signIn);

registerRouter.get("/current", authenticate, registerController.getCurrent);

registerRouter.post("/logout", authenticate, registerController.logOut);

export default registerRouter;
