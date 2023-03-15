const express = require("express");
const userSystemRoutes = require("./routes");
const path = require("path");
const { sequelize } = require("./models");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.model");
const bcrypt = require("bcrypt");
const session = require("express-session");
const cookieParser = require('cookie-parser');
require("dotenv").config();

const PORT = 8000;

const app = express();
app.use(cookieParser());
app.use(
  session({
    secret: 'supersecretkey',
    resave: false,
    saveUninitialized: false,
    // store: new SQLiteStore({ db: 'sessions.db', dir: './var/db' })
  })
);
app.use(express.urlencoded({ extended: false }));
app.use(passport.session());
app.use(passport.initialize());


passport.use(
  new LocalStrategy(async function (username, password, done) {
    try {
      const user = await User.findOne({
        where: {
          email: username,
        },
      });
      if (!user) {
        return done(new Error("incorrect email/password"));
      }
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid) {
        done(null, user);
      }
    } catch (e) {
      done(e, null);
    }
  })
);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function(id, done) {
    console.log(id)
    try {
        const foundUser = await User.findOne({
            where: {
                id
            }
        });
        done(null, foundUser);
    } catch(e) {
        done(e, null);
    }
});

app.use(function(req,res,next){
  res.locals.currentUser = req.user;
  next();
})

app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "views"));

app.use(express.static("public"));


app.listen(PORT, async () => {
    app.use("/", userSystemRoutes);
    try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log("Connected to database");
  } catch (e) {
    console.log("An error occurred trying to connect to the database");
  }
  console.log(`server is running on http://localhost:${PORT}`);
});

app.on("close", async () => {
  await sequelize.close();
});
