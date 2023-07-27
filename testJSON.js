const fs = require('fs');

// Load the JSON data from a file
let json = JSON.parse(fs.readFileSync('opm_360day_factor_chart.json', 'utf8'));

// Function to get the multiplication factor
function getFactor(days, months) {
    // No need to subtract 1 from months because the first column is considered as the 0 month
    return json[days.toString()][months];
}

// Test cases
console.log(getFactor(15, 3)); // Should print the factor for 3 months and 15 days
console.log(getFactor(0, 1));  // Should print the factor for 1 month and 0 days
console.log(getFactor(29, 11)); // Should print the factor for 12 months and 29 days
console.log(getFactor(20, 7)); // 0.638889

