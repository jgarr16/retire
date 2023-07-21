const fs = require('fs');
const pdfParse = require('pdf-parse');

let dataBuffer = fs.readFileSync('./CSRS-FERS-Handbook-Time-Factor-Chart.pdf');

pdfParse(dataBuffer).then(function(data) {
    console.log(data.text);        
});
