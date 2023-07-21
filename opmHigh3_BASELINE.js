// opmHigh3.js

const fs = require('fs');

// Load the JSON data from a file
let json = JSON.parse(fs.readFileSync('opm_360day_factor_chart.json', 'utf8'));

// Function to get the multiplication factor
function getFactor(days, months) {
    // No need to subtract 1 from months because the first column is considered as the 0 month
    return json[days.toString()][months];
}

class HighThreeCalculator {
  constructor() {
    this.salaryData = [];
  }

  // Add a salary entry to the data
  addSalaryEntry(date, salary) {
    this.salaryData.push({ date: new Date(date), salary });
    this.salaryData.sort((a, b) => a.date - b.date); // Ensure data is sorted by date
  }

// Calculate the high-3 average salary
calculateHighThree() {
    if (this.salaryData.length < 2) {
      throw new Error('At least 2 salary entries are required to calculate the high-3 average salary.');
    }
  
    // Determine today's date and the date 3 years ago
    let today = new Date();
    let threeYearsAgo = new Date();
    threeYearsAgo.setFullYear(today.getFullYear() - 3);
  
    // Check if we have data that covers at least a three-year period
    let totalDuration = (this.salaryData[this.salaryData.length - 1].date - this.salaryData[0].date) / (24 * 60 * 60 * 1000);
    if (totalDuration < 3 * 360) { // Adjusted for a 360-day year
      throw new Error('The salary data must cover at least a three-year period to calculate the high-3 average salary.');
    }
  
    let totalWeightedSalary = 0;
    let totalFactor = 0;
    let timePeriods = [];
    for (let i = 0; i < this.salaryData.length - 1; i++) {
      // Determine the start and end dates of the salary period, ensuring they fall within the three-year period
      let startDate = this.salaryData[i].date < threeYearsAgo ? threeYearsAgo : this.salaryData[i].date;
      let endDate = this.salaryData[i + 1].date > today ? today : this.salaryData[i + 1].date;
  
      // Calculate the number of days this salary was in effect
      let daysInEffect = Math.floor((endDate - startDate) / (24 * 60 * 60 * 1000));
      let monthsInEffect = Math.floor(daysInEffect / 30); // Approximate number of months
      daysInEffect = daysInEffect % 30; // Remaining number of days
  
      // Get the multiplication factor from the OPM factor chart
      let factor = getFactor(daysInEffect, monthsInEffect);
  
      totalWeightedSalary += this.salaryData[i].salary * factor;
      totalFactor += factor;
  
      // Add the details for this time period to the array
      timePeriods.push({
        startDate: startDate,
        endDate: endDate,
        months: monthsInEffect,
        days: daysInEffect,
        factor: factor,
        salary: this.salaryData[i].salary,
        weightedSalary: this.salaryData[i].salary * factor
      });
    }
  
    // Handle the last salary entry, which is assumed to be in effect until today
    let remainingDays = Math.floor((today - this.salaryData[this.salaryData.length - 1].date) / (24 * 60 * 60 * 1000));
    let remainingMonths = Math.floor(remainingDays / 30);
    remainingDays = remainingDays % 30;
    let remainingFactor = getFactor(remainingDays, remainingMonths);
    totalWeightedSalary += this.salaryData[this.salaryData.length - 1].salary * remainingFactor;
    totalFactor += remainingFactor;
  
    // Add the details for the last time period to the array
    timePeriods.push({
      startDate: this.salaryData[this.salaryData.length - 1].date,
      endDate: today,
      months: remainingMonths,
      days: remainingDays,
      opmFactor: remainingFactor,
      salary: this.salaryData[this.salaryData.length - 1].salary,
      weightedSalary: this.salaryData[this.salaryData.length - 1].salary * remainingFactor
    });
  
    let averageSalary = totalWeightedSalary / totalFactor;
  
    // Return the high-3 average salary and the details for each time period
    return {
      highThreeAverage: averageSalary.toFixed(2), // Limit the output to two decimal places
      timePeriods: timePeriods
    };
  }
}  

module.exports = HighThreeCalculator;
