let express = require("express");
let exphbs = require("express-handlebars");

const PORT = process.env.PORT || 8090;

let app = express();

// Set the port of our application
// process.env.PORT lets the port be set by Heroku

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

let routes = require("./controllers/stonks_controller");

app.use(routes);

// Start our server so that it can begin listening to client requests.
app.listen(PORT, () => {
  // Log (server-side) when our server has started
  console.log("Server listening on: http://localhost:" + PORT);
});
