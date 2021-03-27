const {Router} = require('express')
const config = require('config')
const Post = require('../models/Post')
const auth = require('../middleware/auth.middleware')
const router = Router()

router.post('/create', auth, async (req, res) => {
    try {

        const {title} = req.body

        const post = new Post({title, owner: req.user.userId})

        await post.save()
        res.status(201).json({post})

    } catch (e) {
        res.status(500).json({message: "Something went wrong!"});
    }
})

router.get('/', auth, async (req, res) => {
    try {
        const posts = await Post.find({owner: req.user.userId})
        res.json(posts)

    } catch (e) {
        res.status(500).json({message: "Something went wrong!"});
    }
})

router.get('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        res.json(post)
    } catch (e) {
        res.status(500).json({message: "Something went wrong!"});
    }
})


module.exports = router