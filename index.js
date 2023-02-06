const express = require('express');
const app = express();
app.use(express.json());

const PORT = 3001;

 
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})


let persons = [
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
  response.json(persons);
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

app.delete('/api/persons/:id', (request, response) => { 
  const id = Number(request.params.id);

  persons = persons.filter(p => p.id !== id);

  response.status(204).end();
})

const generateId = () => {
  let id = Math.floor(Math.random() * (900) + 100);
  while (persons.find(p => p.id === id)) {
    id = Math.floor(Math.random() * (900) + 100);
  }
  return id;
}

app.post('/api/persons', (request, response) => {
  const body = request.body;

  const id = generateId();
  
  const person = {
    id: id,
    name: body.name,
    number: body.number
  }
  
  persons = persons.concat(person);

  response.json(person);

})


