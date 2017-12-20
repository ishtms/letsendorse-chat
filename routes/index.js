var express = require('express');
var commentModel = require('../schemas/comments');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.post('/addComment', function(req, res, next){
  commentModel
    .create(req.body)
    .then((data) => {
      res.json({
        confirmation: 'success',
        data: data
      })
    })
    .catch((err) => {
      console.log(err);
    })
})
router.get('/all', function(req, res, next){
  commentModel.find({}, (err, response) => {
    if(err){
      return res.json({
        confirmation: 'fail',
        err: err
      }) 
    }
    res.json({
      confirmation: 'successs',
      data: response
    })
  })
})
router.post('/addFirstChild', function(req, res, next){
  commentModel
    .findOne({commentID: req.body.parentId})
    .then((resp) => {
      var Obj = resp;
      Obj.directComment.push({
        username: req.body.username,
        id: req.body.id,
        message: req.body.message,
        childComments: []
      });
      commentModel.findOneAndUpdate({
        commentID: req.body.parentId},
         {$set: { directComment: Obj.directComment}
        }).then((response) => {
          res.json({
            confirmation: "Success",
            data: response
          })
      }).catch((err) =>{
        res.json({
          confirmation: "fail",
          err: err
        })
      })
    })
  });
router.post('/addSecondChild', function(req, res, next){
  commentModel
    .findOne({commentID: req.body.parentId})
    .then((resp)=>
    {
      let data = resp;
      data.directComment.map((current) => {
        if(current.id === req.body.childId){
          current.childComments.push({
            username: req.body.lastUsername,
            message: req.body.lastMessage
          })
        }
      })
      console.log("DATAAAAAA", data)
          commentModel.findOneAndUpdate({commentID: req.body.parentId},
            data, (err, response)=> {
              if(err){
                console.log(err);
                return;
              }
              res.json({data: response});
            })
        }
    ).catch((err) => 
    console.log(err)
    );
})

module.exports = router;
