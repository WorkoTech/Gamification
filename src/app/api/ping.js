module.exports = (app, db) => {

    /**
     * GET /ping
     *
     * Aim to be use for kubernetes liveness and readeness probe
     * in order to check if the service is up and running or not.
     */
    app.get('/ping', (req, res) => {
        db.profile.findAll()
            .then(() => res.status(200).end())
            .catch(() => res.status(500).end())
    })
}
