const { ensureLoggedIn } = require("connect-ensure-login");
const { Router } = require("express");
const passport = require("passport");
const { signInPageController, signUpPageController, signUpHandler, signInPageHandler, homeController, signOutController, } = require("../controllers");

const userSystemRoutes = Router();

userSystemRoutes.get("/", ensureLoggedIn('/sign-in'), homeController);

userSystemRoutes.get("/sign-in", signInPageController);
userSystemRoutes.post("/sign-in", passport.authenticate("local", {successReturnToOrRedirect: '/', failureRedirect: "/sign-in"}))

userSystemRoutes.get("/sign-up", signUpPageController);
userSystemRoutes.post("/sign-up", signUpHandler);

userSystemRoutes.get("/sign-out", ensureLoggedIn('/sign-in'), signOutController);

module.exports = userSystemRoutes;