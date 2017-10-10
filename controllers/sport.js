
const passport = require('passport');
//const User = require('../models/User');
const Sport = require('../models/Sport')

/**
 * GET /create Sport Form
 * Sport Form page.
 */
exports.createSportForm = (req, res) => {
    res.render('sports/create', {
        title: 'Create Sport'
    });
};

/**
 * POST /sport
 * Create a new sport.
 */
exports.createSport = (req, res, next) => {


    const sport = new Sport({
        name: req.body.name,
        type: req.body.type
    });

    Sport.findOne({ name: req.body.name }, (err, existingsport) => {
        if (err) { return next(err); }
        if (existingsport) {
            req.flash('errors', { msg: 'Sport  with that name address already exists.' });
            return res.redirect('/createSportForm');
        }
        sport.save((err) => {
        if (err) { req.flash('errors', { msg: 'can not save' }); }

        res.redirect('/createSportForm');
});
});

};

exports.listSports = (req, res) => {

    Sport.find({}, function(err, sports_list) {
        if (err) {
            req.flash('errors', {msg: 'Something wrong'})
        }


        res.render('sports/list', {
            title: 'List of Sport',
            sports_list: sports_list
        });
    })
};

/**
 * GET /account
 * Profile page.
 */
// exports.getAccount = (req, res) => {
//     res.render('account/profile', {
//         title: 'Account Management'
//     });
// };


