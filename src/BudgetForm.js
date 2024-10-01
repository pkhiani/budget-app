import React, { useState } from 'react';

function BudgetForm() {
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [city, setCity] = useState('');
  const [retirementAge, setRetirementAge] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [budgetEstimate, setBudgetEstimate] = useState('');
  const [error, setError] = useState('');

  const cleanOutput = (text) => {
    // Remove ##, **, and extra spaces
    return text.replace(/##|[*]/g, '').trim();
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(false); // Reset submitted state
    setBudgetEstimate(''); // Clear previous estimate
    setError(''); // Clear previous error message

    // Send data to the backend API
    try {
      const response = await fetch('http://localhost:5000/get-budget-estimate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ retirementAge: Number(retirementAge), city }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }

      const data = await response.json();
      
// Function to clean the budget estimate string
const cleanOutput = (text) => {
    // Remove ##, **, and extra spaces
    return text.replace(/##|[*]/g, '').trim();
  };
  
  if (data.choices && data.choices[0] && data.choices[0].message.content) {
    // Split the content by line, clean each line, and filter out any empty lines
    const budgetLines = data.choices[0].message.content
      .split('\n')
      .filter(line => line.trim() !== '')
      .map(line => cleanOutput(line)); // Apply cleaning to each line
  
    // Remove the first line (header) and set the cleaned budget lines
    setBudgetEstimate(budgetLines.slice(1));
    setSubmitted(true); // Mark as submitted after data is fetched
  }
  
      
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to fetch budget estimate. Please try again.');
      setSubmitted(false); // Keep it false if an error occurs
    }
  };

  return (
    <div>
      <h1>Design Your Life</h1>
      <form onSubmit={handleSubmit}>
        {/* <div>
          <label>Current Monthly Income </label>
          <input 
            type="number" 
            value={monthlyIncome} 
            onChange={(e) => setMonthlyIncome(e.target.value)} 
            placeholder="Enter your monthly income"
            required 
          />
        </div> */}

        <div>
          <label>City </label>
          <input 
            type="text" 
            value={city} 
            onChange={(e) => setCity(e.target.value)} 
            placeholder="Enter your city"
            required 
          />
        </div>

        <div>
          <label>Retirement Age </label>
          <input 
            type="text" 
            value={retirementAge} 
            onChange={(e) => setRetirementAge(e.target.value)} 
            placeholder="Enter your desired retirement age"
            required 
          />
        </div>

        <button type="submit">Submit</button>
      </form>

      {submitted && (
        <div>
          <h2>Budget Estimate:</h2>
          <ul>
            {budgetEstimate.map((line, index) => (
              <li key={index}>{line}</li> // Display each line as a list item
            ))}
          </ul>
        </div>
      )}
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
}

export default BudgetForm;
