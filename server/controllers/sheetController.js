const express = require("express");
const flash = require("connect-flash");

const { google } = require("googleapis");
const Handlebars = require("handlebars");

exports.indexPage = async (req, res) => {
  res.render("index");
};

exports.sheetWork = async (req, res) => {
  try {
    const { name, task, date } = req.body;
    //middleware i guess
    const auth = new google.auth.GoogleAuth({
      keyFile: "cred.json",

      scopes: "https://www.googleapis.com/auth/spreadsheets",
    });
    const client = await auth.getClient();
    const spreadsheetID = "1yAQ0HjROTnvczaQLPJ6jKLXf6BTFbc586yOVwMxcLM8";
    const googleSheets = google.sheets({ version: "v4", auth: client });

    //Meta data about the spreadsheet
    const metaData = await googleSheets.spreadsheets.get({
      auth,
      spreadsheetId: spreadsheetID,
    });

    //Get Rows from spreadsheet
    const getRows = await googleSheets.spreadsheets.values.get({
      auth,
      spreadsheetId: spreadsheetID,
      range: "Sheet1",
    });
    // additinal code jun13
    const sheetName = "Sheet1";
    const readResponse = await googleSheets.spreadsheets.values.get({
      spreadsheetId: spreadsheetID,
      range: `${sheetName}!A:C`,
    });
    const rows = readResponse.data.values || [];
    let dateExists = false;
    let rowIndex = 0;

    // Check if today's date already exists
    for (let i = 0; i < rows.length; i++) {
      if (rows[i][0] === date) {
        dateExists = true;
        rowIndex = i;
        break;
      }
    }
    console.log(rowIndex);

    if (!dateExists) {
      // Date doesn't exist, append date first
      await googleSheets.spreadsheets.values.append({
        spreadsheetId: spreadsheetID,
        range: `${sheetName}!A:C`,
        valueInputOption: "USER_ENTERED",
        resource: {
          values: [[date], ["NAME", "TASK"], [name, task]],
        },
      });
    } else {
      // Date exists, append task and name under the date
      await googleSheets.spreadsheets.values.append({
        spreadsheetId: spreadsheetID,
        range: `${sheetName}!A${rowIndex + 2}:C${rowIndex + 2}`,
        valueInputOption: "USER_ENTERED",
        resource: {
          values: [[name, task]],
        },
      });
    }

    
    res.render("index");
    console.log("Data Succesfully Submitted");
    
  } catch (error) {
    // additional code ju13
    console.log(error);
    res.render("errors/500", {
      title: "Internal Server Error",
    });
  }
};

//retrieve every data
exports.retrieveData = async (req, res) => {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: "cred.json",

      scopes: "https://www.googleapis.com/auth/spreadsheets",
    });
    const client = await auth.getClient();
    const spreadsheetID = "1yAQ0HjROTnvczaQLPJ6jKLXf6BTFbc586yOVwMxcLM8";
    const googleSheets = google.sheets({ version: "v4", auth: client });

    const getRows = await googleSheets.spreadsheets.values.get({
      auth,
      spreadsheetId: spreadsheetID,
      range: "Sheet1",
    });
    const everyData = getRows.data.values;
    console.log(everyData);
    // res.send(getRows.data);
    // console.log(getRows.data.values);
    // Register a custom helper to check if a value equals a specific string
    Handlebars.registerHelper("equals", function (a, b) {
      return a === b;
    });
    Handlebars.registerHelper("isDate", function (value) {
      return !isNaN(Date.parse(value));
    });

    res.render("allData", { everyData });
    console.log("Data Retieved Succesfully!!");
  } catch (error) {
    console.log(error);

    res.render("errors/500", {
      title: "Internal Server Error",
    });
  }
};

exports.about = async(req,res)=>{
  try {
    res.render('about')
  } catch (error) {
    console.log(error);
  }
}