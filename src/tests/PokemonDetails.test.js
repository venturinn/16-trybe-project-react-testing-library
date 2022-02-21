import React from 'react';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import pokemons from '../data'; // Simula "Resultado" API
import App from '../App';

const renderWithRouter = (component) => {
  const history = createMemoryHistory();
  return ({
    ...render(<Router history={ history }>{component}</Router>), history,
  });
};

const nameLinkMoreDetails = 'More details';

describe('Testa o componente <PokemonDetails.js />',
  () => {
    test('Testa se as informações detalhadas do Pokémon são mostradas', () => {
      renderWithRouter(<App />);

      const { name, summary, id } = pokemons[0];

      // Acessa os detalhes do primeiro Pokémon (Pikachu)
      const moreDetailsLink = screen.getByRole('link', { name: nameLinkMoreDetails });
      userEvent.click(moreDetailsLink);

      const detailsTitle = screen.getByText(`${name} Details`);
      expect(detailsTitle).toBeInTheDocument(); // A página deve conter um texto <name> Details, onde <name> é o nome do Pokémon;

      const detailsH2 = screen.getByRole('heading', { name: 'Summary', level: 2 });
      expect(detailsH2).toBeInTheDocument(); // A seção de detalhes deve conter um heading h2 com o texto Summary.

      // ref. https://testing-library.com/docs/queries/about/#priority
      const paragraph = screen.getByText(
        (content, element) => element.tagName.toLowerCase() === 'p'
        && content.startsWith(summary),
      );
      expect(paragraph).toBeInTheDocument(); // A seção de detalhes deve conter um parágrafo com o resumo do Pokémon específico sendo visualizado.

      const pokemonDetailsLink = screen.getAllByRole('link');
      pokemonDetailsLink.forEach((link) => {
        expect(link.href).not.toBe(`http://localhost/pokemons/${id}`); // Não deve existir o link de navegação para os detalhes do Pokémon selecionado.
      });
    });

    test('Testa se existe na página os mapas contendo as localizações do pokémon', () => {
      renderWithRouter(<App />);

      // Acessa os detalhes do primeiro Pokémon (Pikachu)
      const moreDetailsLink = screen.getByRole('link', { name: nameLinkMoreDetails });
      userEvent.click(moreDetailsLink);

      const { name, foundAt } = pokemons[0];

      const detailsH2 = screen.getByRole(
        'heading', { name: `Game Locations of ${name}`, level: 2 },
      );
      expect(detailsH2).toBeInTheDocument(); // Na seção de detalhes deverá existir um heading h2 com o texto Game Locations of <name>; onde <name> é o nome do Pokémon exibido.

      const locationImgs = screen.getAllByAltText(`${name} location`);
      expect(locationImgs).toHaveLength(foundAt.length); // Todas as localizações do Pokémon devem ser mostradas na seção de detalhes;

      foundAt.forEach((local, index) => { // Devem ser exibidos, o nome da localização e uma imagem do mapa em cada localização;
        const locationName = screen.getByText(local.location);
        expect(locationName).toBeInTheDocument();

        expect(locationImgs[index].src).toContain(local.map);
      });
    });

    test('Testa se o usuário pode favoritar um pokémon na página de detalhes.', () => {
      renderWithRouter(<App />);

      // Acessa os detalhes do primeiro Pokémon (Pikachu)
      const moreDetailsLink = screen.getByRole('link', { name: nameLinkMoreDetails });
      userEvent.click(moreDetailsLink);

      const { name } = pokemons[0];

      const checkboxLabel = screen.getByText(
        (content, element) => element.tagName.toLowerCase() === 'label'
        && content.startsWith('Pokémon favoritado?'),
      );
      expect(checkboxLabel).toBeInTheDocument(); // O label do checkbox deve conter o texto Pokémon favoritado?;

      const favoriteCheckbox = screen.getByRole(
        'checkbox', { name: /pokémon favoritado\?/i },
      );
      userEvent.click(favoriteCheckbox); // Cliques alternados no checkbox devem adicionar e remover respectivamente o Pokémon da lista de favoritos;
      userEvent.click(favoriteCheckbox);
      userEvent.click(favoriteCheckbox);

      const pokemonStarImg = screen.queryByAltText(`${name} is marked as favorite`);
      expect(pokemonStarImg.src).toContain('/star-icon.svg');

      userEvent.click(favoriteCheckbox);

      const pokemonStarImg2 = screen.queryByAltText(`${name} is marked as favorite`);
      expect(pokemonStarImg2).toBe(null);
    });
  });
