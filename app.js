const express = require("express");
const morgan = require("morgan");
const {engine}  = require('express-handlebars');

const path = require('path');
const fs = require("fs"); 
require("dotenv").config();
// console.log(process.env)
const { google } = require("googleapis");

const app = express();
const port = process.env.PORT || 2000; 

// view engine
// View Engine Setup
app.engine('hbs', engine({
  extname:'hbs',
  defaultLayout : 'main',
  layoutsDir : path.join(__dirname,'views','layouts'),
  partialsDir : path.join(__dirname, 'views', 'partials')
}))
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'views'))


// app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(":method :url :status :response-time ms :res[content-lenght] "));

const sheets = google.sheets({
  version: "v4",
  auth: "API_KEY",
});

//additional codes start
app.get("/test", (req, res) => {
  res.render("allData", { everyData: [["Header1", "Header2"], ["Row1Cell1", "Row1Cell2"], ["Row2Cell1", "Row2Cell2"]] });
});

const routes = require("./server/routes/sheetRoute.js")

app.use("/",routes);

//additional code end

// app.get("/", async (req, res) => {
//   res.render("index");
// });

// app.post("/", async (req, res) => {
//   const { name, task, date } = req.body;

//   const auth = new google.auth.GoogleAuth({
//     keyFile: "cred.json",

//     scopes: "https://www.googleapis.com/auth/spreadsheets",
//   });
//   const client = await auth.getClient();
//   const spreadsheetID = "1yAQ0HjROTnvczaQLPJ6jKLXf6BTFbc586yOVwMxcLM8";
//   const googleSheets = google.sheets({ version: "v4", auth: client });

//   //Meta data about the spreadsheet
//   const metaData = await googleSheets.spreadsheets.get({
//     auth,
//     spreadsheetId: spreadsheetID,
//   });

//   //Get Rows from spreadsheet
//   const getRows = await googleSheets.spreadsheets.values.get({
//     auth,
//     spreadsheetId: spreadsheetID,
//     range: "Sheet1",
//   });

//   //Write data or append new data to spreadsheet
//   await googleSheets.spreadsheets.values.append({
//     auth,
//     spreadsheetId: spreadsheetID,
//     range: "Sheet1!A:B",
//     valueInputOption: "USER_ENTERED",
//     resource: {
//       values: [[name,task,date]],
//     },
//   });

//   // res.send(getRows.data);
//   res.send("Succesfully submiteed");
//   console.log("Heloo World");
// });

app.listen(port, () => console.log(`listining on port ${port}`));
