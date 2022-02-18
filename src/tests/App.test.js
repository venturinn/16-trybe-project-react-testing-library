import React from 'react';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import App from '../App';

const renderWithRouter = (component) => {
  const history = createMemoryHistory();
  return ({
    ...render(<Router history={ history }>{component}</Router>), history,
  });
};

describe('Testa os links no topo da aplicação e o correto roteamento.',
  () => {
    test('O primeiro link deve possuir o texto Home e rotear para "./"', () => {
      const { history } = renderWithRouter(<App />);

      const homeLink = screen.getByRole('link', { name: 'Home' });
      expect(homeLink).toBeInTheDocument();
      userEvent.click(homeLink);
      const { pathname } = history.location;
      expect(pathname).toBe('/');
    });

    test('O segundo link deve possuir o texto About e rotear para "./about"', () => {
      const { history } = renderWithRouter(<App />);

      const aboutLink = screen.getByRole('link', { name: 'About' });
      expect(aboutLink).toBeInTheDocument();
      userEvent.click(aboutLink);
      const { pathname } = history.location;
      expect(pathname).toBe('/about');
    });

    test(
      'O terceiro link deve possuir Favorite Pokémons e rotear para "./favorites"',
      () => {
        const { history } = renderWithRouter(<App />);

        const favoriteLink = screen.getByRole('link', { name: 'Favorite Pokémons' });
        expect(favoriteLink).toBeInTheDocument();
        userEvent.click(favoriteLink);
        const { pathname } = history.location;
        expect(pathname).toBe('/favorites');
      },
    );
  });
