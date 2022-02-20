import React from 'react';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import App from '../App';
import pokemons from '../data'; // Simula "Resultado" API

const renderWithRouter = (component) => {
  const history = createMemoryHistory();
  return {
    ...render(<Router history={ history }>{component}</Router>),
    history,
  };
};

afterEach(() => jest.clearAllMocks());

describe('Testa o componente <Pokedex.js />', () => {
  test('Testa se página contém um heading h2 com o texto correto', () => {
    renderWithRouter(<App />);

    const h2 = screen.getByRole('heading', {
      name: 'Encountered pokémons',
      level: 2,
    });
    expect(h2).toBeInTheDocument();
  });

  test('Testa se é exibido o próximo Pokémon da lista corretamente.', () => {
    renderWithRouter(<App />);

    // O botão All precisa estar sempre visível.
    const buttonAll = screen.getByRole('button', { name: /all/i });
    expect(buttonAll).toBeInTheDocument();

    const testIdName = 'pokemon-name';

    const fistPokemon = screen.getByText(pokemons[0].name);
    expect(fistPokemon).toBeInTheDocument();

    const onlyOnePokemon = screen.getAllByTestId(testIdName);
    expect(onlyOnePokemon).toHaveLength(1); // Apenas Teste se é mostrado apenas um Pokémon por vez.

    const nextPokemon = screen.getByRole('button', { name: /próximo pokémon/i });
    expect(nextPokemon).toBeInTheDocument();

    for (let index = 0; index <= pokemons.length; index += 1) {
      if (index < pokemons.length) { // Os próximos Pokémons da lista devem ser mostrados, um a um, ao clicar sucessivamente no botão
        const pokemon = screen.getByText(pokemons[index].name);
        expect(pokemon).toBeInTheDocument();
        userEvent.click(nextPokemon);

        const onlyOnePokemon2 = screen.getAllByTestId(testIdName);
        expect(onlyOnePokemon2).toHaveLength(1);
      } else { // O primeiro Pokémon da lista deve ser mostrado ao clicar no botão, se estiver no último Pokémon da lista
        const pokemon = screen.getByText(pokemons[0].name);
        expect(pokemon).toBeInTheDocument();
        const onlyOnePokemon2 = screen.getAllByTestId(testIdName);
        expect(onlyOnePokemon2).toHaveLength(1);
      }
    }
  });

  test('Teste se a Pokédex tem os botões de filtro.', () => {
    renderWithRouter(<App />);

    // O botão All precisa estar sempre visível
    const buttonAll = screen.getByRole('button', { name: /all/i });
    expect(buttonAll).toBeInTheDocument();

    for (let index = 0; index < pokemons.length; index += 1) { // O texto do botão deve corresponder ao nome do tipo, ex. Psychic;
      const nextPokemon = screen.getByRole('button', { name: pokemons[index].type });
      expect(nextPokemon).toBeInTheDocument();
    }

    const typeButtons = screen.getAllByTestId('pokemon-type-button');

    let quantType = [];
    const typeQuant = () => {
      const types = pokemons.map((pokemon) => pokemon.type);

      // ref. https://pt.stackoverflow.com/questions/16483/remover-elementos-repetido-dentro-de-um-array-em-javascript
      quantType = types.filter((element, i) => types.indexOf(element) === i);
      return quantType.length;
    };

    expect(typeButtons).toHaveLength(typeQuant()); // Deve existir um botão de filtragem para cada tipo de Pokémon, sem repetição.

    quantType.forEach((type) => {
      const typeButton = screen.getByRole('button', { name: type });

      const filteredPokemons = pokemons.filter((pokemon) => pokemon.type === type);
      const nextPokemon = screen.getByRole('button', { name: /próximo pokémon/i });
      expect(nextPokemon).toBeInTheDocument();

      // Refatorar lógica index iniciando com "1"!
      for (let index = 1; index <= filteredPokemons.length; index += 1) {
        userEvent.click(typeButton);

        if (index < filteredPokemons.length) {
          const pokemon = screen.getByText(filteredPokemons[index - 1].name);
          expect(pokemon).toBeInTheDocument();
          userEvent.click(nextPokemon);
        } else {
          const pokemon = screen.getByText(filteredPokemons[0].name);
          expect(pokemon).toBeInTheDocument();
        }
      }
    });
  });

  test('Teste se a Pokédex contém um botão para resetar o filtro', () => {
    renderWithRouter(<App />);

    // O botão All precisa estar sempre visível
    const buttonAll = screen.getByRole('button', { name: /all/i });
    const buttonPsychic = screen.getByRole('button', { name: /psychic/i });
    userEvent.click(buttonPsychic);
    userEvent.click(buttonAll);

    const nextPokemon = screen.getByRole('button', { name: /próximo pokémon/i });

    for (let index = 0; index <= pokemons.length; index += 1) {
      if (index < pokemons.length) {
        const pokemon = screen.getByText(pokemons[index].name);
        expect(pokemon).toBeInTheDocument();
        userEvent.click(nextPokemon);
      } else {
        const pokemon = screen.getByText(pokemons[0].name);
        expect(pokemon).toBeInTheDocument();
      }
    }
  });
});
