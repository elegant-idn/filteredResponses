const express = require('express');
const app = express();
const port = 3000; // You can use any port that's available


const axios = require('axios');

const token = 'sk_prod_TfMbARhdgues5AuIosvvdAC9WsA5kXiZlW8HZPaRDlIbCpSpLsXBeZO7dCVZQwHAY3P4VSBPiiC33poZ1tdUj2ljOzdTCCOSpUZ_3912';
const url = 'https://api.fillout.com/v1/api/forms';

axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;


const applyFilters = (responses, filters) => {
  return responses.filter(response => {
      for (const filter of filters) {
          const { id, condition, value } = filter;
          const responseValue = response[id];

          switch (condition) {
              case 'equals':
                  if (responseValue !== value) {
                      return false;
                  }
                  break;
              case 'does_not_equal':
                  if (responseValue === value) {
                      return false;
                  }
                  break;
              case 'greater_than':
                  if (value > new Date(responseValue)) {
                      return false;
                  }
                  break;
              case 'less_than':
                  if (value < new Date(responseValue)) {
                      return false;
                  }
                  break;
              default:
                  break;
          }
      }
      return true;
  });
};

// Define a route that includes a parameter for formId
app.get('/:formId/filteredResponses', (req, res) => {
  const { formId } = req.params;
  const { limit = 150, offset = 0, filters } = req.query;

  // Parse filters JSON string to object
  const parsedFilters = JSON.parse(filters || "[]");
  
  axios.get(`${url}/${formId}`)
    .then(response => {
      const data = response.data;
      let filteredResponses = applyFilters(data.questions, parsedFilters);
      console.log(filteredResponses);
      response_data = filteredResponses.slice(offset, offset + limit);
      res.send({
        ...response_data,
        "totalResponses": filteredResponses.length,
        "pageCount": offset/limit
      });
    })
    .catch(error => {
      res.send(error);
    })
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
``

