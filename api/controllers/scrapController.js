const User = require('../models/user');

//---
const mongoose = require('mongoose');

//---
const bcrypt = require("bcryptjs");

//---
const jwt = require("jsonwebtoken");

const fs = require('fs');

function scrapPureCPU() {
    return new Promise(
        function(resolve, reject) {
            const { exec } = require('child_process');
            exec("scrapy crawl purecpu -O ./db/purecpu.json", {cwd: 'C:\\Users\\salah\\Documents\\Projets\\comparateur_provider\\scrap\\scrap'}, (error, stdout, stderr) => {
                if (error) {
                    console.log(`error: ${error.message}`);
                    reject(error.message);
                    return;
                }
                if (stderr) {
                    console.log(`stderr: ${stderr}`);
                    reject(stderr);
                    return;
                }            
            })
            let rawdata = fs.readFileSync('C:\\Users\\salah\\Documents\\Projets\\comparateur_provider\\scrap\\scrap\\db\\purecpu.json');
            let jsonData = JSON.parse(rawdata);
            resolve(jsonData, "blabla"); // success
        });
}

module.exports = {  
    remoteCmd: async (req, res, next) => {
        result = {}
        await scrapPureCPU().then(data => {
                res.status(200).json({
                    data: data
                });
            })        
    },
};