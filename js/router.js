// BODY PARSER - -- 


var express = require('express');
var router = express.Router();
var User = require('./user');

/** bodyParser.urlencoded(options)
 * Parses the text as URL encoded data (which is how browsers tend to send form data from regular forms set to POST)
 * and exposes the resulting object (containing the keys and values) on req.body
 */
/*
// Login page 
router.get('/', function (req, res) {
    res.render('re', {
        users: users
    });
});
*/

// Register page 
router.get('/', function (req, res) {
    res.render('register');
});




// Register page 
router.get('/login', function (req, res) {
    res.render('login');
});




router.post('/', function (req, res, next) {
    // confirm that user typed same password twice
    if (req.body.password !== req.body.passwordConf) {
        var err = new Error('Passwords do not match.');
        err.status = 400;
        res.send("passwords dont match");
        return next(err);
    }

    if (req.body.username &&
        req.body.password &&
        req.body.passwordConf) {

        var userData = {
            username: req.body.username,
            password: req.body.password,
        }

        User.create(userData, function (error, user) {
            if (error) {
                return next(error);
            } else {
                console.log(user._id);
                req.session.userId = user._id;
                return res.redirect('/home');
            }
        });

    } else if (req.body.loginName && req.body.loginPassword) {
        User.authenticate(req.body.loginName, req.body.loginPassword, function (error, user) {
            if (error || !user) {
                var err = new Error('Wrong email or password.');
                err.status = 401;
                return next(err);
            } else {
                req.session.userId = user._id;
                return res.redirect('/home');
            }
        });
    } else {
        var err = new Error('All fields required.');
        err.status = 400;
        return next(err);
    }

})

// GET /logout
router.get('/logout', function (req, res, next) {
    if (req.session) {
        // delete session object
        req.session.destroy(function (err) {
            if (err) {
                return next(err);
            } else {
                return res.redirect('/');
            }
        });
    }
});

router.get('/home', requiresLogin, function (req, res, next) {
});

function requiresLogin(req, res, next) {
    if (req.session && req.session.userId) {
        res.render('home');
    } else {
        var err = new Error('You must be logged in to view this page.');
        err.status = 401;
        return next(err);
    }
}



module.exports = router;