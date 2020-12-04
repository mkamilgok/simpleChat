const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require("./models/user.js");
const Log = require("./models/log.js");

function initialize(passport, getUserByEmail, getUserByUsername) {
    const authenticateUser = async (email, password, done) => {
        const user = await getUserByEmail(email)
        if (user == null) {
            return done(null, false, { message: 'No user with that email' })
        }

        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user)
            } else {
                let newLog = new Log({
                    username: (await User.findOne({email: email}).select('username -_id')).username,
                    description: "Password Incorrect"
                });
                await newLog.save();
                return done(null, false, { message: 'Password incorrect' })
            }
        } catch (e) {
            return done(e)
        }
    }

    passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))
    passport.serializeUser( async (user, done) => {
        let newLog = new Log({
        username: user.username,
        description: "Successful Login"
        });
        await newLog.save();
        done(null, user.username)});
    passport.deserializeUser( async(username, done) => {

        return done(null, await getUserByUsername(username))
    })
}

module.exports = initialize;