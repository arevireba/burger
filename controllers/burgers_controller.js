var express = require("express");
var router = express.Router();

// Requires the burger.js file
var burger = require("../models/burger.js");

// Setting up all of the routes
router.get("/", function(req, res) {
    burger.all(function(data) {
        var hbsObject = {
            burgers: data
        };
        // console.log(hbsObject);
        res.render("index", hbsObject);
    });
});

router.post("/api/burgers", function(req, res) {
    burger.create([req.body.name], function(result) {

        res.json({ id: result.insertId });
    });
});

router.put("/api/burgers/:id", function(req, res) {
    var condition = "id = " + req.params.id;

    burger.update(req.body, condition, function(result) {
        if (result.changedRows == 0) {
            
            // Returns a 404 error if no rows were changed
            return res.status(404).end();
        } else {
          res.status(200).end();
        }
    });
});

router.delete("/api/burgers/:id", function(req, res) {
    var condition = "id = " + req.params.id;

    burger.delete(condition, function(result) {
        if (result.affectedRows == 0) {

            // Returns a 404 error if no rows were deleted
            return res.status(404).end();
        } else {
            res.status(200).end();
        }
    });
});

// Export routes for server.js to use.
module.exports = router;