document.addEventListener('DOMContentLoaded', function () {
    const contributionRate = document.getElementById('contribution-rate');
    const investmentReturn = document.getElementById('investment-return');
    const expenses = document.getElementById('expenses');
    const age = document.getElementById('age');
    const salary = document.getElementById('salary'); // Salary input
    const currentBalance = document.getElementById('current-balance');
    const projectedBalance = document.getElementById('projected-balance');
    const estimatedIncome = document.getElementById('estimated-income');

    // ✅ Format currency function (adds commas)
    function formatCurrency(num) {
        return num.toLocaleString('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
    }

    // ✅ Function to clean salary input for calculations
    function cleanSalaryValue() {
        return parseFloat(salary.value.replace(/,/g, '')) || 0; // Remove commas & convert to number
    }

    // ✅ Format salary when the user leaves the input field
    function formatSalaryOnBlur() {
        let rawValue = salary.value.replace(/,/g, '').trim();
        let numericValue = parseFloat(rawValue);

        if (!isNaN(numericValue) && numericValue > 0) {
            salary.value = formatCurrency(numericValue); // Apply formatting
        } else {
            salary.value = '10,000'; // Default to 10,000 if empty
        }

        updateValues(); // Ensure calculations update
    }

    // ✅ Chart setup
    const balanceChartCtx = document.getElementById('balance-chart').getContext('2d');

    const balanceChart = new Chart(balanceChartCtx, {
        type: 'line',
        data: {
            labels: [], // Years
            datasets: [{
                label: 'Projected Pension Balance',
                data: [],
                borderColor: 'blue',
                borderWidth: 2,
                pointRadius: 3,
                fill: false
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: {
                        usePointStyle: true,
                        pointStyle: 'line',
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Years'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Balance ($)'
                    }
                }
            }
        }
    });

    // ✅ Attach event listeners
    salary.addEventListener('blur', formatSalaryOnBlur); // Format on blur
    salary.addEventListener('input', function () {
        salary.value = salary.value.replace(/[^0-9]/g, ''); // Allow only numbers
    });
    salary.addEventListener('change', updateValues); // Trigger calculations

    contributionRate.addEventListener('input', updateValues);
    investmentReturn.addEventListener('input', updateValues);
    expenses.addEventListener('input', updateValues);
    age.addEventListener('input', updateValues);
    currentBalance.addEventListener('input', updateValues);

    function updateValues() {
        document.getElementById('contribution-rate-value').textContent = contributionRate.value + '%';
        document.getElementById('investment-return-value').textContent = investmentReturn.value + '%';
        document.getElementById('expenses-value').textContent = expenses.value + '%';
        calculateProjections();
    }

    function calculateProjections() {
        const yearsToRetirement = 65 - parseInt(age.value);
        const cleanSalary = cleanSalaryValue();
        const annualContribution = (parseFloat(contributionRate.value) / 100) * cleanSalary;
        const netReturn = (parseFloat(investmentReturn.value) - parseFloat(expenses.value)) / 100;

        let rawValue = currentBalance.value.replace(/,/g, '');
        let balance = parseFloat(rawValue);
        let balanceData = [];

        for (let i = 0; i < yearsToRetirement; i++) {
            balance += annualContribution;  // Add contributions first
            balance *= (1 + netReturn);  // Apply net return directly
            balanceData.push(balance.toFixed(2));
        }

        const retirementIncome = balance / 20; // Using annuity factor of 20

        projectedBalance.textContent = '$' + formatCurrency(balance);
        estimatedIncome.textContent = '$' + formatCurrency(retirementIncome);

        updateCharts(balanceData);
    }

    function updateCharts(balanceData) {
        balanceChart.data.labels = Array.from({ length: balanceData.length }, (_, i) => i + 1);
        balanceChart.data.datasets[0].data = balanceData;
        balanceChart.update();
    }

    updateValues(); // Initial update
});

// ✅ Format Current Account Balance input with commas when user leaves the field
document.getElementById('current-balance').addEventListener('blur', function () {
    let rawValue = this.value.replace(/,/g, '');
    let numericValue = parseFloat(rawValue);

    if (!isNaN(numericValue)) {
        this.value = numericValue.toLocaleString('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
    }
});

// ✅ Prevents non-numeric input in salary and current balance fields
document.getElementById('salary').addEventListener('keypress', function (event) {
    if (!/[0-9]/.test(event.key)) {
        event.preventDefault();
    }
});
document.getElementById('current-balance').addEventListener('keypress', function (event) {
    if (!/[0-9]/.test(event.key)) {
        event.preventDefault();
    }
});
