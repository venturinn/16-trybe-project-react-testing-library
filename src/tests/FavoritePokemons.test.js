import React from 'react';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import App from '../App';
import FavoritePokemons from '../components/FavoritePokemons';

const renderWithRouter = (component) => {
  const history = createMemoryHistory();
  return ({
    ...render(<Router history={ history }>{component}</Router>), history,
  });
};

// https://testing-library.com/docs/example-update-props/
describe('Testa o componente <FavoritePokemons.js />', () => {
  test('Teste se é exibido na tela a mensagem No favorite pokemon found.', () => {
    render(<FavoritePokemons pokemons={ [] } />);
    const notFound = screen.getByText('No favorite pokemon found');
    expect(notFound).toBeInTheDocument();
  });

  test('Teste se é exibido todos os cards de pokémons favoritados.', () => {
    renderWithRouter(<App />);

    // Acessa os detalhes do primeiro Pokémon e favorita
    const moreDetailsLink = screen.getByRole('link', { name: 'More details' });
    userEvent.click(moreDetailsLink);

    const favoriteCheckbox = screen.getByRole(
      'checkbox', { name: /pokémon favoritado\?/i },
    );
    userEvent.click(favoriteCheckbox);

    // Retorna para o Home
    const homeLink = screen.getByRole('link', { name: /home/i });
    userEvent.click(homeLink);

    // Passa para o próximo Pokémon, acessa os detalhes e favorita
    const nextPokemonButton = screen.getByRole('button', { name: /próximo pokémon/i });
    userEvent.click(nextPokemonButton);

    const moreDetailsLink2 = screen.getByRole('link', { name: 'More details' });
    userEvent.click(moreDetailsLink2);

    const favoriteCheckbox2 = screen.getByRole(
      'checkbox', { name: /pokémon favoritado\?/i },
    );
    userEvent.click(favoriteCheckbox2);

    // Acessa a página de favoritos e verifica se os dois Pokémons estão presentes
    const favoriteLink = screen.getByRole('link', { name: /favorite pokémons/i });
    userEvent.click(favoriteLink);

    const favoritePokemon = screen.getByText(/pikachu/i);
    expect(favoritePokemon).toBeInTheDocument();

    const favoritePokemon2 = screen.getByText(/charmander/i);
    expect(favoritePokemon2).toBeInTheDocument();

    // Outra solução adotada para testar:
    // Cada card possui 2 imagens, como foram adicionados 2 cads, esperasse encontrar 4 imagens no documento:
    const TOTAL_IMG = 4;
    const totalImg = screen.getAllByRole('img');
    expect(totalImg).toHaveLength(TOTAL_IMG);
  });
});
