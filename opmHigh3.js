const fs = require('fs');

// Load the JSON data from a file
let json = JSON.parse(fs.readFileSync('opm_360day_factor_chart.json', 'utf8'));

// Function to get the multiplication factor
function getFactor(days, months) {
    // No need to subtract 1 from months because the first column is considered as the 0 month
    return json?.[days.toString()]?.[months] ?? 0;
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
    calculateHighThree(date = new Date()) {
        if (this.salaryData.length < 2) {
            throw new Error('At least 2 salary entries are required to calculate the high-3 average salary.');
        }

        // Determine the date 3 years ago from the provided date
        let threeYearsAgo = new Date(date);
        threeYearsAgo.setFullYear(threeYearsAgo.getFullYear() - 3);

        // Check if we have data that covers at least a three-year period before the evaluation date
        if (this.salaryData[0].date > threeYearsAgo) {
            let totalWeightedSalary = 0;
            let totalFactor = 0;

            for (let i = 0; i < this.salaryData.length - 1; i++) {
                let startDate = this.salaryData[i].date < threeYearsAgo ? threeYearsAgo : this.salaryData[i].date;
                let endDate = this.salaryData[i + 1].date > date ? date : this.salaryData[i + 1].date;

                let daysInEffect = Math.floor((endDate - startDate) / (24 * 60 * 60 * 1000));
                let monthsInEffect = Math.floor(daysInEffect / 30);
                daysInEffect = daysInEffect % 30;

                let factor = getFactor(daysInEffect, monthsInEffect);

                totalWeightedSalary += this.salaryData[i].salary * factor;
                totalFactor += factor;

                if (startDate >= threeYearsAgo) {
                    this.salaryData[i].factor = factor;
                }
            }

            let remainingDays = Math.floor((date - this.salaryData[this.salaryData.length - 1].date) / (24 * 60 * 60 * 1000));
            let remainingMonths = Math.floor(remainingDays / 30);
            remainingDays = remainingDays % 30;
            let remainingFactor = getFactor(remainingDays, remainingMonths);
            totalWeightedSalary += this.salaryData[this.salaryData.length - 1].salary * remainingFactor;
            totalFactor += remainingFactor;

            let averageSalary = totalWeightedSalary / totalFactor;

            // Format averageSalary as currency (USD)
            const formatter = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
            });

            const outputDate = date.toISOString().slice(0, 10);

            return {
                averageSalary: formatter.format(averageSalary),
                queryDate: outputDate,
                message: `Insufficient salary data. (The average salary for the data provided is ${formatter.format(averageSalary)}).`
            };
        }

        let totalWeightedSalary = 0;
        let totalFactor = 0;
        let highThreeEntries = [];

        for (let i = 0; i < this.salaryData.length - 1; i++) {
            let startDate = this.salaryData[i].date < threeYearsAgo ? threeYearsAgo : this.salaryData[i].date;
            let endDate = this.salaryData[i + 1].date > date ? date : this.salaryData[i + 1].date;

            let daysInEffect = Math.floor((endDate - startDate) / (24 * 60 * 60 * 1000));
            let monthsInEffect = Math.floor(daysInEffect / 30);
            daysInEffect = daysInEffect % 30;

            let factor = getFactor(daysInEffect, monthsInEffect);

            totalWeightedSalary += this.salaryData[i].salary * factor;
            totalFactor += factor;

            if (startDate >= threeYearsAgo) {
                highThreeEntries.push({
                    date: startDate,
                    salary: this.salaryData[i].salary,
                    weightedSalary: this.salaryData[i].salary * factor
                });
            }
        }

        let remainingDays = Math.floor((date - this.salaryData[this.salaryData.length - 1].date) / (24 * 60 * 60 * 1000));
        let remainingMonths = Math.floor(remainingDays / 30);
        remainingDays = remainingDays % 30;
        let remainingFactor = getFactor(remainingDays, remainingMonths);
        totalWeightedSalary += this.salaryData[this.salaryData.length - 1].salary * remainingFactor;
        totalFactor += remainingFactor;

        highThreeEntries.push({
            date: this.salaryData[this.salaryData.length - 1].date,
            salary: this.salaryData[this.salaryData.length - 1].salary,
            weightedSalary: this.salaryData[this.salaryData.length - 1].salary * remainingFactor
        });

        let averageSalary = totalWeightedSalary / totalFactor;

        // Format averageSalary as currency (USD)
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        });

        const outputDate = date.toISOString().slice(0, 10);

        return {
            averageSalary: formatter.format(averageSalary),
            queryDate: outputDate,
        };
    }
}

module.exports = HighThreeCalculator;
