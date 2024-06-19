const express = require("express");
const router = express.Router();
const { google } = require("googleapis");

const sheetController = require("../controllers/sheetController.js")
    router.get('/',sheetController.indexPage);

    router.post('/',sheetController.sheetWork);
     
    router.get('/allData',sheetController.retrieveData);

    router.get('/about',sheetController.about);


module.exports = router; 