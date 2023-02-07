import { useState, useEffect } from 'react';
import phoneBookService from './service/persons';
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';
import Notification from './components/Notification';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [query, setQuery] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  const handleNameChange = event => {
    setNewName(event.target.value);
  };

  const handleNumberChange = event => {
    setNewNumber(event.target.value);
  };

  const handleSubmit = event => {
    event.preventDefault();

    const newPerson = persons.find(p => p.name === newName);

    const createNewPerson = () => {
      const newPerson = {
        name: newName,
        number: newNumber,
      };
      phoneBookService.create(newPerson).then(returnedPerson => {
        setPersons([...persons, returnedPerson]);
        showMessage(`Added ${returnedPerson.name}`, 'success');
        setTimeout(() => setMessage(''), 5000);
      });
    };

    const getPersonToUpdate = () => {
      if (!newPerson) return null;

      return window.confirm(
        `${newPerson.name} is already added to phonebook, replace the number ${newPerson.number} with a new one?`
      )
        ? { ...newPerson, number: newNumber }
        : null;
    };

    const updatePerson = () => {
      const personToUpdate = getPersonToUpdate();

      if (personToUpdate) {
        phoneBookService
          .update(personToUpdate.id, personToUpdate)
          .then(returnedPerson => {
            setPersons(
              persons.map(p =>
                p.id === returnedPerson.id ? returnedPerson : p
              )
            );
            showMessage(`Updated ${returnedPerson.name}`, 'success');
            setTimeout(() => setMessage(''), 5000);
          })
          .catch(() => {
            showMessage(
              `Information of ${personToUpdate.name} has already been removed from server`,
              'error'
            );
            setPersons(persons.filter(p => p.id !== personToUpdate.id));
          });
      }
    };

    const showMessage = (content, status) => {
      setMessage(content);
      setStatus(status);
      setTimeout(() => setMessage(''), 5000);
    };

    if (newPerson) {
      updatePerson();
    } else {
      createNewPerson();
    }

    setNewName('');
    setNewNumber('');
  };

  const handleQueryChange = event => {
    setQuery(event.target.value);
  };

  const removePerson = id => {
    const personToDelete = persons.find(p => p.id === id);
    const confirmDelete = window.confirm(`Delete ${personToDelete.name} ?`);

    if (confirmDelete) {
      phoneBookService.remove(personToDelete.id);
      setPersons(persons.filter(p => p.id !== id));
    }
  };

  const filtered =
    query === ''
      ? persons
      : persons.filter(person =>
          person.name.toLowerCase().includes(query.toLowerCase())
        );

  useEffect(() => {
    phoneBookService.getAll().then(returnedPersons => {
      setPersons(returnedPersons);
    });
  }, []);

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification
        message={message}
        status={status}
      />
      <Filter
        query={query}
        handleQueryChange={handleQueryChange}
      />
      <h3>Add new</h3>
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        handleSubmit={handleSubmit}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
      />
      <h3>Numbers</h3>
      <Persons
        persons={filtered}
        handleDelete={removePerson}
      />
    </div>
  );
};

export default App;
