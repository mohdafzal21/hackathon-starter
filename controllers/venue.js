const passport = require('passport');
const Venue = require('../models/Venue');
const readChunk = require('read-chunk');
const fileType = require('file-type');
const fs = require('fs');
const multer = require('multer');


exports.createVenue= (req, res,next) => {
        // if(req.files) {
    var storedFile;
            var storage = multer.diskStorage({

                destination: function (req, file, cb) {
                    cb(null, './uploads');
                },
                filename: function (req, file, cb) {
                    cb(null, file.fieldname + '-' + Date.now());


                }
            });

            var upload = multer({storage: storage}).any();

            upload(req, res, function (err) {

                console.log(req.files);
                if(req.files.length) {

                    const buffer = readChunk.sync("./uploads/" + req.files[0].filename, 0, 4100);
                    fileType(buffer);
                    var checkExt = fileType(buffer).ext;
                    // console.log(checkExt);
                    if (checkExt === "exe") {
                        fs.unlink("./uploads/" + req.files[0].filename, (err) => {
                            if (err) {
                                throw err
                            }
                        });
                    }else{
                        var newName = "./uploads/" +req.files[0].filename + "." + checkExt;
                        console.log(newName);
                        storedFile = newName;
                        // console.log('successfully deleted');
                        fs.rename("./uploads/" + req.files[0].filename, newName, function(err) {
                            if ( err ) console.log('ERROR: ' + err);
                        });
                    }


                    // if (err) {
                    //     // An error occurred when uploading
                    //     //console.log('Limit file size: '+limit);
                    //     res.json({result: "An error occurred when uploading"})
                    // }

                }
                // Everything went fine

                req.checkBody("email", "Enter a valid email address.").isEmail();
                req.checkBody("phone", "Enter a valid IND phone number.").isMobilePhone("en-IN");

                var errors = req.validationErrors();
                if (errors) {
                    return res.send(errors);
                } else {

                    console.log(storedFile);
                    // console.log(req.body, req.params, req.query);
                    const venue = new Venue({
                        name: req.body.name,
                        address: req.body.address,
                        email: req.body.email,
                        phone: req.body.phone,
                        description: req.body.description,


                        photo: [{"path":storedFile}],
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

// exports.venueSportUpdate= function (req, res) {
//
//     Venue.findOneAndUpdate({_id: req.params.id}, req.body,{ new: true }, function (err,venueEdit) {
//         res.json({venueEdit:venueEdit,result:"ur done!!"});
//     })
// };

// exports.venuePhoto = function (req, res) {
//
// };