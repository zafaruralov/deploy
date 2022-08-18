const middlewares = {
    notFound: (req, res) => {
        res.status(404).json({ message: `Not found ${req.originalUrl}` })
    },
}

module.exports = middlewares
