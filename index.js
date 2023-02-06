const express = require('express');
const app = express();
const PORT = 3001;


const persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

app.get('/info', (request, response) => {
  const info = `Phonebook has info for ${persons.length} people<br>${new Date()}`;
  response.send(info);
})

app.get('/api/persons', (request, response) => {
  response.send(persons);
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);

  const person = persons.find(p => p.id === id);

  console.log(person);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
   
})


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})