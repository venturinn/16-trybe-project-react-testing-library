import React from 'react';
import { screen, render } from '@testing-library/react';
import About from '../components/About';

describe('Testa o componente <About.js />.', () => {
  test('Teste se a página contém um heading h2 com o texto About Pokédex.', () => {
    render(<About />);
    const h2 = screen.getByRole('heading', { name: 'About Pokédex', level: 2 });
    expect(h2).toBeInTheDocument();
  });

  test('Testa se a página contém a imagem correta de uma Pokédex', () => {
    render(<About />);
    const url = 'https://cdn2.bulbagarden.net/upload/thumb/8/86/Gen_I_Pok%C3%A9dex.png/800px-Gen_I_Pok%C3%A9dex.png';
    const img = screen.getByAltText('Pokédex');
    expect(img.src).toContain(url);
  });

  test('Teste se a página contém dois parágrafos com texto sobre a Pokédex.', () => {
    render(<About />);
    const paragraph = screen.getAllByText(
      (_content, element) => element.tagName.toLowerCase() === 'p',
    );
    expect(paragraph).toHaveLength(2);
  });

  test('Teste se a página contém as informações sobre a Pokédex.', () => {
    render(<About />);
    const page = screen.getAllByText(/Pokédex/i);
    let pageLength = false;
    if (page.length > 0) { pageLength = true; }
    expect(pageLength).toBeTruthy();
  });
});
