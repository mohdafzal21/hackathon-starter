const passport = require('passport');
const Venue = require('../models/Venue');
const readChunk = require('read-chunk');
const fileType = require('file-type');
const fs = require('fs');
const multer = require('multer');
var storage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now());


    }
});

var upload = multer({storage: storage}).any();

exports.createVenue= (req, res,next) => {
    var storedFiles=[];


        upload(req, res, function (err) {

            console.log(req.files);
            if(req.files.length) {
                for(var i=0; i<req.files.length;i++){
                    const buffer = readChunk.sync("./uploads/" + req.files[i].filename, 0, 4100);
                    fileType(buffer);
                    var checkExt = fileType(buffer).ext;
                    // console.log(checkExt);
                    if (checkExt === "exe") {
                        fs.unlink("./uploads/" + req.files[i].filename, (err) => {
                            if (err) {
                                throw err
                            }
                        });
                    }else{
                        var newName = "./uploads/" +req.files[i].filename + "." + checkExt;
                        console.log(newName);
                        storedFiles.push({path:newName});
                        // console.log('successfully deleted');
                        fs.rename("./uploads/" + req.files[i].filename, newName, function(err) {
                            if ( err ) console.log('ERROR: ' + err);
                        });
                    }
                }
               

            }
            // Everything went fine

            req.checkBody("email", "Enter a valid email address.").isEmail();
            req.checkBody("phone", "Enter a valid IND phone number.").isMobilePhone("en-IN");

            var errors = req.validationErrors();
            if (errors) {
                return res.send(errors);
            } else {

                console.log(storedFiles);
                // console.log(req.body, req.params, req.query);
                const venue = new Venue({
                    name: req.body.name,
                    address: req.body.address,
                    email: req.body.email,
                    phone: req.body.phone,
                    description: req.body.description,


                    photo: storedFiles,
                    review: [],
                    sports: req.body.sports
                });


                Venue.findOne({name: req.body.name}, (err, existingvenue) => {
                    if (err) {
                        return next(err);
                    }
                    if (existingvenue) {
                        //req.flash('errors',{msg:'venue with that name already exist!!'});
                        //return res.redirect('/createVenue');
                        return res.json({result: "venue with that name already exist!!"})

                    }
                    venue.save((err) => {
                        if (err) {
                            req.flash('errors', {msg: 'can not save'})
                            return res.json({result: err});
                        }
                        res.json({result: "now u are on venueList Route!!"})
                        //res.render('/venueList');
                    })
                })
            }
        })
        // }
};
exports.venueList=(req,res) =>{
    Venue.find({}, function(err, venueList) {
        if (err) {
            req.flash('errors', {msg: 'Something wrong'})
        }
        res.json({venueList:venueList})

        //res.render('venue/venueList', {
        //     title: 'List of venue',
        //     venueList: venueList
        // });
    })
};

// exports.venueEdit =(req,res) => {
//
// };
exports.venueEdit= function (req,res) {
    console.log(req.body, req.query, req.params);
    Venue.findOneAndUpdate({_id: req.params.id}, req.body,{ new: true }, function (err,venueEdit) {
        res.json({venueEdit:venueEdit,result:"ur done!!"});
    })
};

exports.venueDelete= function (req,res) {

    console.log(req.body, req.query, req.params);
    Venue.findOneAndRemove({_id: req.params.id}, function (err,venueDelete) {
        res.json({venueDelete:venueDelete,result:"ur done!!"});
    })
};

exports.venuePhoto = function (req, res) {

};

exports.venueAddSport = function (req, res) {

    Venue.findOne({_id:req.params.id},function (err,venue) {
        if(err){
            req.flash("error",{msg:'something wrong with sport add Routing'})
        }

        if(venue.sports.length){
            for (var i=0; i<venue.sports.length;i++) {
                if (venue.sports[i].name === req.body.name) {
                    return res.json({result: "sport name with that name already exist!!"})
                }
            }
        }

        venue.sports.push({name: req.body.name});
        // console.log(venue.sports);
        venue.save((err) => {
            if (err) {
                req.flash('errors', {msg: 'can not save'});
                return res.json({result: err});
            }
            res.json({result: "now u saved the sport name!!"})
            //res.render('/venueList');
        })
    })
};

exports.venueSportEdit = function (req, res) {
    Venue.findOne({_id: req.params.id},req.body,{new: true}, function(err,venue){
        console.log(venue.sports);
        venue.sports = venue.sports.concat(req.body.sports);
        // var editval= sportEdit.sport[0];

        venue.save(function (err, newvenue) {
            if (err) {
                req.flash('errors', {msg: 'Something wrong'})
            }
            res.json({venue: newvenue, result: "ur done sport edit !!"})
        });
    })
};

exports.venueSportUpdate= function (req, res) {

    Venue.findOneAndUpdate(     {
            _id: req.params.id,
            "sports._id":req.params.ids,
        },
        {
            "$set": {
                "sports.$.name":req.body.sports[0].name,
            }
        },{ new: true }, function (err,venueEdit) {

        res.json({venueEdit:venueEdit,result:"ur done!!"});
    })
};

exports.venueSportDelete = function (req, res) {
    Venue.findOne({_id:req.params.id},function (err,venue) {
        if (err) {
            req.flash('errors', {msg: 'Something wrong with deleting sport name'})
        }

        console.log(venue);
        venue.sports.id(req.params.ids).remove();

        // venue.findOneAndRemove({"sports._id":req.params.ids},function (err, sportNameDelete) {
        //     if (err) {
        //         req.flash('errors', {msg: 'Something wrong with deleting sport name'})
        //     }

        venue.save();

        console.log(venue)
            res.json({venue:venue, result:"now u delete the sport name"});
        // })
    })

};

// exports.venuePhoto = function (req, res) {
//
// };

exports.makeReview = function(req,res){
  // const input = new Venue({
  //
  //     rating: req.body.rating,
  //     description:req.body.description
  // });
    Venue.findOne({_id:req.params.id},function (err, venue) {
        if (err) {
            req.flash('errors', {msg: 'Something wrong Rating'})
        }
        console.log(req.body);
        venue.review.push({rating:req.body.rating,description:req.body.description});
        venue.save( function (err) {
            if (err) { req.flash('errors', { msg: 'can not save' }); }

            res.json({"result":"this is result after savnig the data!!"})
        });
    })
};