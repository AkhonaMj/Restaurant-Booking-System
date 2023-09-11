import express from "express";
import pgp from "pg-promise";
import exphbs from "express-handlebars";
import bodyParser from "body-parser";
import flash from "flash-express";
import dotenv from "dotenv";
dotenv.config()
import restaurant from "./services/restaurant.js";

const app = express();


app.use(express.static('public'));
app.use(flash());

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const handlebarSetup = exphbs.engine({
    partialsDir: "./views/partials",
    viewPath: './views',
    layoutsDir: './views/layouts'
});
app.engine('handlebars', handlebarSetup);
app.set('view engine', 'handlebars');

const db = pgp({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

const restaurantInst = restaurant(db);

app.get("/", (req, res) => {

    res.render('index', { tables: [{}, {}, { booked: true }, {}, {}, {}] })
});
app.post("/book", (req, res) => {
    restaurantInst.getTables(req.body);
    restaurantInst.bookTable(req.body.tableId);
    if (!restaurantInst.getTables()) {
        req.flash('error', "");
        res.redirect('/')
    }
})

app.get("/bookings", (req, res) => {
    res.render('bookings', { tables: [{}, {}, {}, {}, {}, {}] })
});

app.get("/booking/:username", async (req, res) => {
    const username = req.params.username;
    var getTableByUser = await restaurantInst.getBookedTablesForUser(username)
    res.render("booking", {
        booking: getTableByUser,
        username: username
    });

})

app.post("/cancel", async (req, res) => {
    await restaurantInst.cancelTableBooking(tableName)
    res.redirect('/')
});



var portNumber = process.env.PORT || 3000;

//start everything up
app.listen(portNumber, function () {
    console.log('🚀  server listening on:', portNumber);
});