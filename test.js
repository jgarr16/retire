const HighThreeCalculator = require('./opmHigh3');

let calculator = new HighThreeCalculator();
calculator.addSalaryEntry('2023-01-01', 201891);
calculator.addSalaryEntry('2022-01-02', 194126);
calculator.addSalaryEntry('2021-01-03', 189947);
calculator.addSalaryEntry('2019-01-06', 186269);

console.log(calculator.calculateHighThree()); // Outputs: 195321.333333334
