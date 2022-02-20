import React from 'react';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import Pokemon from '../components/Pokemon';
import pokemons from '../data'; // Simula "Resultado" API

const renderWithRouter = (component) => {
  const history = createMemoryHistory();
  return ({
    ...render(<Router history={ history }>{component}</Router>), history,
  });
};

describe('Testa o componente <Pokemon.js />',
  () => {
    test('Teste se é renderizado as informações corretas de determinado pokémon.', () => {
      renderWithRouter(<Pokemon isFavorite showDetailsLink pokemon={ pokemons[0] } />);
      const { averageWeight: { value, measurementUnit },
        name, type, image } = pokemons[0];

      const pokemonName = screen.getByText(name);
      expect(pokemonName).toBeInTheDocument(); // O nome correto do Pokémon deve ser mostrado na tela;

      const pokemonType = screen.getByText(type);
      expect(pokemonType).toBeInTheDocument(); // O tipo correto do pokémon deve ser mostrado na tela.

      const pokemonAverage = screen.getByText(
        `Average weight: ${value} ${measurementUnit}`,
      );
      expect(pokemonAverage).toBeInTheDocument(); // O peso médio do pokémon deve ser exibido

      const pokemonImg = screen.getByAltText(`${name} sprite`);
      expect(pokemonImg.src).toContain(image); // A imagem do Pokémon deve ser exibida
    });

    test('Testa se o card do Pokémon indicado contém um link de navegação', () => {
      renderWithRouter(<Pokemon isFavorite showDetailsLink pokemon={ pokemons[0] } />);
      const { id } = pokemons[0];

      const pokemonDetailsLink = screen.getByRole('link');
      expect(pokemonDetailsLink.href).toBe(`http://localhost/pokemons/${id}`); // A imagem do Pokémon deve ser exibida
    });

    test('Testa redirecionamento para a página de detalhes do Pokémon', () => {
      const { history } = renderWithRouter(
        <Pokemon isFavorite showDetailsLink pokemon={ pokemons[0] } />,
      );
      const { id } = pokemons[0];
      const pokemonDetailsLink = screen.getByRole('link', { name: /more details/i });
      userEvent.click(pokemonDetailsLink);
      const { pathname } = history.location;
      expect(pathname).toBe(`/pokemons/${id}`);
    });

    test('Teste se existe um ícone de estrela nos Pokémons favoritados.', () => {
      renderWithRouter(<Pokemon isFavorite showDetailsLink pokemon={ pokemons[0] } />);
      const { name } = pokemons[0];

      const pokemonDetailsLink = screen.getByRole('link', { name: /more details/i });
      userEvent.click(pokemonDetailsLink);

      const pokemonStarImg = screen.getByAltText(`${name} is marked as favorite`);
      expect(pokemonStarImg.src).toContain('/star-icon.svg');
    });
  });
