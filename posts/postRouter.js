const express = require('express');
const db = require('../data/db.js');

const router = express.Router();

router.get('/', (req, res) => {
    db.find()
        .then(posts => res.status(200).json(posts))
        .catch(error => {
            console.log(error);
            res.status(500).json({ error: "The posts information could not be retrieved." });
        });
});

router.post('/', (req, res) => {
    const title = req.body.title;
    const contents = req.body.contents;
    if (!title || !contents) {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." });
    } else {
        db.insert({title, contents})
        .then(({id}) => {
            db.findById(id)
                .then(([post]) => {
                    res.status(201).json(post);
                })
                .catch(error => {
                    console.log(error);
                })
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ error: "There was an error while saving the post to the database" })
        })
    }  
});

router.get('/:id', (req, res) => {
    const id = req.params.id;
    db.findById(id)
        .then(post => {
            console.log(post);
            if (post.length) {
                res.status(200).json(post);
            } else {
                res.status(500).json({ message: "The post with the specified ID does not exist." });
            }  
        });
});

router.delete('/:id', (req, res) => {
    
})

module.exports = router;