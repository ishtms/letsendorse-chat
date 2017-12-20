let mongoose = require('mongoose');

let CommentSchema = mongoose.Schema({
        username: {type: String, default: '', required: true},
        message: {type: String, default: '', required: true},
        directComment: [
            {
                username: String,
                id: String,
                message: String,
                childComments: [
                    {
                        username: String,
                        message: String
                    }
                ]
            }
        ],
        commentID: {type: String, required: true}
})

module.exports = mongoose.model('Comments', CommentSchema);