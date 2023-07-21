// highThree.js

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
      if (totalDuration < 3 * 365) {
        throw new Error('The salary data must cover at least a three-year period to calculate the high-3 average salary.');
      }
  
      let totalWeightedSalary = 0;
      let totalDays = 0;
      for (let i = 0; i < this.salaryData.length - 1; i++) {
        // Determine the start and end dates of the salary period, ensuring they fall within the three-year period
        let startDate = this.salaryData[i].date < threeYearsAgo ? threeYearsAgo : this.salaryData[i].date;
        let endDate = this.salaryData[i + 1].date > today ? today : this.salaryData[i + 1].date;
  
        // Calculate the number of days this salary was in effect
        let daysInEffect = (endDate - startDate) / (24 * 60 * 60 * 1000);
        totalWeightedSalary += this.salaryData[i].salary * daysInEffect;
        totalDays += daysInEffect;
      }
  
      // Handle the last salary entry, which is assumed to be in effect until today
      let remainingDays = (today - this.salaryData[this.salaryData.length - 1].date) / (24 * 60 * 60 * 1000);
      if (remainingDays > 0) {
        totalWeightedSalary += this.salaryData[this.salaryData.length - 1].salary * remainingDays;
      }
  
      let averageSalary = totalWeightedSalary / (3 * 365); // Divide by the number of days in 3 years
  
      return averageSalary.toFixed(2); // Limit the output to two decimal places
    }
  }
  
  module.exports = HighThreeCalculator;
  