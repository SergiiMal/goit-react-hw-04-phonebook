import { useState } from 'react';
import { nanoid } from 'nanoid';
import { Report } from 'notiflix/build/notiflix-report-aio';

import FormContacts from './FormContacts/FormContacts';
import ListContacts from './ListContacts/ListContacts';
import FilterContacts from './FiltrContacts/FilterContacts';
import { Contacts_KEY } from '../Data/keyLocalStor';
import { Container, Title, TitleContacts } from './App.styled';
import useLocalStorage from './hooks/userLocalStorage';
import contactPhone from '../Data/contactPhone.json';

function App() {
  const [contacts, setContacts] = useLocalStorage(Contacts_KEY, contactPhone);

  const [filter, setFilter] = useState('');

  const nameCheck = name => {
    return contacts.filter(contact => contact.name.includes(name));
  };

  const addContact = ({ name, number }) => {
    const check = nameCheck(name);
    if (check.length <= 0) {
      const subscriber = {
        id: nanoid(),
        name,
        number,
      };

      setContacts([subscriber, ...contacts]);

      return;
    }

    Report.failure('Warning!', `"${name}" is already in contacts`, 'Okay');
  };

  const changeFilter = e => {
    setFilter(e.currentTarget.value);
  };

  const getVisibleContacts = (filter, contacts) => {
    const normalizeFilter = filter.toLowerCase();

    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(normalizeFilter)
    );
  };

  const deleteContact = contactId => {
    setContacts(contacts.filter(contact => contact.id !== contactId));
  };

  const visibleContacts = getVisibleContacts(filter, contacts);
  const quantityContacts = contacts.length;

  return (
    <Container>
      <Title>PhoneBook</Title>
      <FormContacts onSubmit={addContact} />

      <TitleContacts>Contacts</TitleContacts>
      <FilterContacts value={filter} onChange={changeFilter} />

      <ListContacts
        quantity={quantityContacts}
        contacts={visibleContacts}
        onDeleteContact={deleteContact}
      />
    </Container>
  );
}

export default App;
