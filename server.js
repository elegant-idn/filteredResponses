const express = require('express');
const app = express();
const port = 3000; // You can use any port that's available


const axios = require('axios');

const token = 'sk_prod_TfMbARhdgues5AuIosvvdAC9WsA5kXiZlW8HZPaRDlIbCpSpLsXBeZO7dCVZQwHAY3P4VSBPiiC33poZ1tdUj2ljOzdTCCOSpUZ_3912';
const url = 'https://api.fillout.com/v1/api/forms';

axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;


// Define a route that includes a parameter for formId
app.get('/:formId/filteredResponses', (req, res) => {
  // Access the formId from the request parameters
  const { formId } = req.params;
  const { filters } = req.query;
  const parsedFilters = JSON.parse(filters);
  
  // Here, you would implement logic to filter responses based on the formId.
  // This example just sends a message including the formId for demonstration.
  // In a real application, you might query a database or another data source
  // to find the appropriate responses.
  
  axios.get(`${url}/${formId}`)
    .then(response => {
        const data = response.data;
        console.log(data);
        const filteredResponses = data.responses.filter(response => {
          // Check if all filter conditions are met for each response
          return parsedFilters.every(filter => {
              const question = response.questions.find(question => question.id === filter.id);
              if (!question) return false;
  
              switch (filter.condition) {
                  case 'equals':
                      return question.value === filter.value;
                  case 'does_not_equal':
                      return question.value !== filter.value;
                  case 'greater_than':
                      return new Date(question.value) > new Date(filter.value);
                  case 'less_than':
                      return new Date(question.value) < new Date(filter.value);
                  default:
                      return false;
              }
          });
        });
        res.send(filteredResponses);
    })
    .catch(error => {
        res.send('Error making the request', error);
    });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
``

