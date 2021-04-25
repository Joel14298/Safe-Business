let express = require("express");
let path = require("path");
let bodyParser = require("body-parser");
let routes = require("./routes");
const session = require("express-session");

const WebAppStrategy = require("ibmcloud-appid").WebAppStrategy;
const CALLBACK_URL = "/ibm/cloud/appid/callback";

let app = express();

// DB Conection
const MongoClient = require("mongodb").MongoClient;
// const { request } = require("http");
// const { response } = require("express");
const passport = require("passport");
const uri =
  "mongodb+srv://Joel14298:123456.@cluster0.0pbdt.mongodb.net/Users?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
let collection;
client.connect((err) => {
  collection = client.db("Save_Business_DB").collection("Save_Business_Users");

  console.log("User is connected");
});

// Multifactor Authentication for the Web Application

app.use(
  session({
    secret: "123456",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});

passport.use(
  new WebAppStrategy({
    tenantId: "99530204-edd4-470d-a0cd-3f73a408bb01",
    clientId: "ae1a9c6e-2a7b-4342-a9c4-8363fde5b3a9",
    secret: "YTJhMmYwMzMtYjNiYi00MTk5LTliMGEtYjEyZTc5NDU2YTk1",
    oauthServerUrl:
      "https://us-south.appid.cloud.ibm.com/oauth/v4/99530204-edd4-470d-a0cd-3f73a408bb01",
    redirectUri: "http://localhost:8082" + CALLBACK_URL,
  })
);

app.get(
  CALLBACK_URL,
  passport.authenticate(WebAppStrategy.STRATEGY_NAME, {
    failureRedirect: "/error",
  })
);

app.use("/protected", passport.authenticate(WebAppStrategy.STRATEGY_NAME));

app.use("/protected", express.static("protected"));

var port = process.env.PORT || 8082;

app.use(express.static(__dirname + "/public"));

app.use("/", routes({ client }));
app.set("views", path.join(__dirname, "./views"));
app.set("view engine", "ejs");

app.listen(port);
console.log("Listening to port", port);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/", function (req, res, next) {
  res.send({ message: "ok" });

  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  client.close();
});

app.get("/user/c", function (req, res) {
  res.render("db");
});

require("cf-deployment-tracker-client").track();
