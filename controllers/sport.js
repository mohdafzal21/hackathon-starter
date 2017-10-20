
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

        res.redirect('/sport/'+ sport.name);
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

exports.getsport = (req, res) => {

    Sport.findOne({name: req.params.name}, function(err, sport) {

        console.log(err,sport)
        if (err) {
            req.flash('errors', {msg: 'Something wrong'})
        }


        res.render('sports/sport', {
            title: ' Sport',
            sport: sport
        });
    })
};

exports.deleteSport = (req, res) => {

    Sport.findOneAndRemove({_id: req.params.id}, function(err, sport) {

        console.log(err,sport)
        if (err) {
            req.flash('errors', {msg: 'Something wrong'})
        }


        //res.redirect('/listsports');
        res.json({error:err,sport:sport});
    })
};

exports.editSport = (req, res, next) => {

    // const sport = new Sport({
    //     name: req.body.name,
    //     type: req.body.type
    // });

    Sport.findOne({name: req.params.name},function(err, sport) {

        console.log(err,sport)
        if (err) {
            req.flash('errors', {msg: 'Something wrong'})
        }



        res.render('sports/edit', {
            title: ' Sport',
            sport: sport
        });
    })

};
exports.updateSport = (req, res, next) => {



    console.log(req.body)

    Sport.findOneAndUpdate({_id: req.body.id}, req.body, { new: true }, function(err, sport) {

        console.log(err,sport)
        if (err) {
            req.flash('errors', {msg: 'Something wrong'})
        }

        res.json({error:err,sport:sport});

        // res.redirect('/listsports');
    })

};

