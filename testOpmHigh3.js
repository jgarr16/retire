const HighThreeCalculator = require('./opmHigh3');

const calculator = new HighThreeCalculator();

// let calculator = new HighThreeCalculator();
calculator.addSalaryEntry('2023-01-01', 201891);
calculator.addSalaryEntry('2022-01-02', 194126);
calculator.addSalaryEntry('2021-01-03', 189947);
calculator.addSalaryEntry('2019-01-06', 186269);
calculator.addSalaryEntry('2017-10-15', 180844);
calculator.addSalaryEntry('2016-08-21', 170608);
calculator.addSalaryEntry('2016-01-10', 157971);
calculator.addSalaryEntry('2015-09-24', 155705);
calculator.addSalaryEntry('2015-01-11', 153670);
calculator.addSalaryEntry('2014-01-12', 147760);
calculator.addSalaryEntry('2012-09-23', 143456);
calculator.addSalaryEntry('2011-09-11', 132830);
calculator.addSalaryEntry('2010-11-21', 128923);
calculator.addSalaryEntry('2010-01-03', 125016);
calculator.addSalaryEntry('2009-11-22', 122897);
calculator.addSalaryEntry('2009-01-04', 119056);
calculator.addSalaryEntry('2008-11-23', 115149);
calculator.addSalaryEntry('2008-01-06', 111435);
calculator.addSalaryEntry('2007-11-25', 110363);
calculator.addSalaryEntry('2007-02-04', 96950);
calculator.addSalaryEntry('2007-01-07', 93822);
calculator.addSalaryEntry('2006-02-05', 91407);
calculator.addSalaryEntry('2006-01-08', 79931);
calculator.addSalaryEntry('2005-07-24', 77274);
calculator.addSalaryEntry('2005-01-09', 74782);
calculator.addSalaryEntry('2004-07-19', 72108);

// let averageSalary = calculator.calculateHighThree();
// console.log("High-3 Average Salary:", averageSalary);

// Calculate the high-3 average salary for any given date (e.g., '2023-07-21')
// const result = calculator.calculateHighThree(new Date('2023-07-21'));
// console.log(`High-3 Salary on ${result.queryDate}:`, result.averageSalary);

// Get the evaluation date from the command-line arguments (assuming the date is provided in the format 'YYYY-MM-DD')
const args = process.argv.slice(2); // Skip the first two arguments (node and script file)
const evaluationDate = args.length > 0 ? new Date(args[0]) : new Date(); // If no date provided, use the current date

// Calculate the high-3 average salary for the evaluation date
const result = calculator.calculateHighThree(evaluationDate);

// Check if there's an insufficient data message
if (result.message) {
    console.log(result.message);
} else {
    console.log(`High-3 Salary on ${result.queryDate}:`, result.averageSalary);
}