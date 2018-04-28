var express = require("express");
var bodyParser = require("body-parser");

var app = express();
// Letting Heroku set the port
var PORT = process.env.PORT || 8080;

// Sets up the Express app to handle data parsing
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var mysql = require("mysql");

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "quotes_db"
});

connection.connect(function(err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }
  console.log("connected as id " + connection.threadId);
});

// Express and MySQL code should go here.
// Render the main index.html page with the quotes
app.get("/", function(req,res) {
  connection.query("SELECT * FROM quotes;", function(err,data) {
    if (err) {
      return res.status(500).end();
    }

    res.render("index", { quotes: data });
  });
});

// Retrieve all quotes
 app.get("/quotes", function(req, res) {
   connection.query("SELECT * FROM quotes;", function(err, data) {
     if (err) {
      return res.status(500).end();
     }

     res.json(data);
   });
 });

// Update a quote
 app.put("/quotes/:id", function(req,res) {
   connection.query("UPDATE quotes SET quote = ? WHERE id = ?", [req.body.quote, req.params.id], function(err,result) {
     if (err) {
       return res.status(500).end();
     }
     else if (result.changedRows === 0) {
       return res.status(404).end();
     }
     res.status(200).end();
   });
 });
// Delete a movie
 app.delete("/quotes/:id", function(req,res) {
   connection.query("DELETE FROM quotes WHERE ID = ?", [req.params.id], function(err, result) {
     if (err) {
       return res.status(500).end();
     }
     else if (result.affectedRows === 0) {
       return res.status(404).end();
     }
     res.status(200).end();
   });
 });

 // Start our server so that it can begin listening to client requests.
app.listen(PORT, function() {
  // Log (server-side) when our server has started
  console.log("Server listening on: http://localhost:" + PORT);
})
