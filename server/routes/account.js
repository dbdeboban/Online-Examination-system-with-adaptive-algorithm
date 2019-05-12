const router = require('express').Router();
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const ScoreModel = require('../models/score');
const SectionScore = require('../models/sectionscore');

const config = require('../config');

router.post('/register', (req, res, next) => {
    let user = new User();
    user.name = req.body.name;
    user.email = req.body.email;
    user.password = req.body.password;

    User.findOne({ email: req.body.email }, (err, existingUser) => {
        if (existingUser) {
            res.json({
                success: false,
                message: 'Account with that email is already registered'
            });
        } else {
            user.save();

            var token = jwt.sign({
                user: user
            }, config.secret, {
                    expiresIn: '7d'
                });

            res.json({
                success: true,
                message: 'Successfully Registered',
                token: token,
                userdata: user
            });
        }
    });

});

router.post('/login', (req, res, next) => {

    User.findOne({ email: req.body.email }, (err, user) => {
        if (err) {
            return res.json({
                success: false,
                message: err
            });
        }

        if (!user) {
            res.json({
                success: false,
                message: 'Authentication Failed, user not found'
            });
        }

        else if (user) {
            var validPassword = user.comparePassword(req.body.password);
            if (!validPassword) {
                res.json({
                    success: false,
                    message: 'Authenticaton failed .Wrong password'
                });
            } else {

                var token = jwt.sign({
                    user: user
                }, config.secret, {
                        expiresIn: '7d'
                    });


                var userT = user;
                for (var i = 0; i < userT.score.length; i++) {
                    userT.score[i] = JSON.parse(userT.score[i]);
                    for (var j = 0; j < userT.score[i].score.length; j++) {
                        userT.score[i].score[j] = JSON.parse(userT.score[i].score[j]);
                    }
                }


                res.json({
                    success: true,
                    message: 'Successfully Logged In',
                    token: token,
                    userdata: userT
                });
            }
        }
    });

});

router.post('/registerScore', (req, res, next) => {
    User.findOne({ email: req.body.email }, (err, user) => {
        if (err) {
            return res.json({
                success: false,
                message: err
            });
        }
        if (!user) {
            res.json({
                success: false,
                message: 'User not found'
            });
        } else {
            ReqScores = req.body.scores;
            for (var i = 0; i < ReqScores.length; i++) {
                let singleScore = new ScoreModel();
                singleScore.testid = ReqScores[i].testid;
                singleScore.score = [];
                for (var j = 0; j < ReqScores[i].score.length; j++) {
                    let sectionScore = new SectionScore();
                    sectionScore.sectionid = ReqScores[i].score[j].sectionid;
                    sectionScore.sectionScore = ReqScores[i].score[j].sectionScore;

                    singleScore.score.push(JSON.stringify(sectionScore));
                }
                ReqScores[i] = JSON.stringify(singleScore);
            }
            user.score = ReqScores;
            user.save();

            res.json({
                success: true,
                message: 'Score Updated'
            });
        }
    });

});

module.exports = router;