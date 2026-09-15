import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PropertyCard from './PropertyCard';

const mockProperty = {
  L_ListingID: '1115119412',
  L_Photos: JSON.stringify([
    'https://example.com/photo.jpg'
  ]),
  L_SystemPrice: 500000,
  L_Address: '123 Main St',
  L_City: 'Anaheim',
  L_State: 'CA',
  L_Zip: '92801',
  L_Keyword2: 3,
  LM_Dec_3: 2,
  LM_Int2_3: 1500
};

function renderCard() {
  return render(
    <MemoryRouter>
      <PropertyCard property={mockProperty} />
    </MemoryRouter>
  );
}

test('renders property data', () => {
  renderCard();

  expect(screen.getByText('$500,000')).toBeInTheDocument();

  const address = document.querySelector('.card-address');

  expect(address).toHaveTextContent('123 Main St');
  expect(address).toHaveTextContent('Anaheim');
  expect(address).toHaveTextContent('CA');
  expect(address).toHaveTextContent('92801');

  expect(screen.getByText('3', { exact: true })).toBeInTheDocument();
  expect(screen.getByText('2', { exact: true })).toBeInTheDocument();
  expect(screen.getByText('1,500', { exact: true })).toBeInTheDocument();
});

test('clicking the card navigates to the property detail page', () => {
  renderCard();

  const cardLink = screen.getByRole('link');

  expect(cardLink).toHaveAttribute(
    'href',
    '/property/1115119412'
  );

  fireEvent.click(cardLink);

  expect(cardLink).toHaveAttribute(
    'href',
    '/property/1115119412'
  );
});