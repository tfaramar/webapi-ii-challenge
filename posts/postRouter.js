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
        db.insert({ title, contents })
            .then(({ id }) => {
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
                res.status(500).json({ error: "There was an error while saving the post to the database." })
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
                res.status(404).json({ message: "The post with the specified ID does not exist." });
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ error: "There was an error while getting the post from the database." });
        });
});

router.delete('/:id', (req, res) => {
    const id = req.params.id;
    db.remove(id)
        .then(deleted => {
            console.log(deleted);
            if (deleted) {
                res.status(200).json(id);
            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist." });
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ error: "There was an error deleting the post from the database." });
        });
});

router.put('/:id', (req, res) => {
    const id = req.params.id;
    const title = req.body.title;
    const contents = req.body.contents;
    if (!title && !contents) {
        return res.status(400).json({ errorMessage: "Please provide title and contents for the post." });
    }
    db.update(id, { title, contents })
        .then(updated => {
            console.log(updated);
            if (updated) {
                db.findById(id)
                    .then(post => {
                        console.log(post);
                        if (post.length) {
                            res.status(200).json(post);
                        } else {
                            res.status(404).json({ message: "The post with the specified ID does not exist." });
                        }
                    })
                    .catch(error => {
                        console.log(error);
                        res.status(500).json({ error: "There was an error while getting the post from the database." });
                    });
            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist." });
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ error: "There was an error while updating the post to the database." });
        });
});

router.get('/:post_id/comments', (req, res) => {
    const { post_id } = req.params;
    db.findById(post_id)
        .then(post => {
            if (post.length) {
                db.findPostComments(post_id)
                    .then(comments => res.status(200).json(comments))
            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            }
        })
        .catch (error => {
        console.log(error);
        res.status(500).json({ error: "The comments information could not be retrieved." });
    });
});

router.post('/:post_id/comments', (req, res) => {
    const { post_id } = req.params;
    const text = req.body.text;
    db.insertComment({ text, post_id })
        .then(comment => {
            res.status(200).json(comment);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ error: "There was an error while saving the comment to the database" });
        });
});

module.exports = router;