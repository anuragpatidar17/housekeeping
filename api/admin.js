const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const keys = "mysecret";

router.post('/signup', (req, res) => {
    User.findOne({
        email: req.body.email
    }).then(user => {
        if (user) {
            return res.status(400).json({
                message: 'email already exists'
            })
        } else {
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            });
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser.save().then(() => {
                        res.json(newUser);
                        console.log(`new user ${newUser.name} added to database`);
                    }).catch(err => console.log('error in adding new user ', err));
                })
            })
        }
    })
});

router.post('/signin', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({
        email
    }).then(user => {
        if (!user) {
            return res.status(404).json({
                email: 'email not found'
            });
        }
        bcrypt.compare(password, user.password).then(isMatch => {
            if (isMatch) {
                const payload = {
                    id: user.id,
                    name: user.name,
                    email: user.email
                };
                jwt.sign(payload, keys.secretOrKey, {
                    expiresIn: 3600
                }, (err, token) => {
                    res.json({
                        success: true,
                        token: 'Bearer ' + token
                    });
                });
            } else {
                return res.status(400).json({
                    password: 'password incorrect'
                })
            }
        })
    })
}); 

router.get('/current', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    res.send({
        name: req.user.name,
        email: req.user.email
    });
})

module.exports = router;