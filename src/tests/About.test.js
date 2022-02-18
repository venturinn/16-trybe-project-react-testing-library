import React from 'react';
import { screen, render } from '@testing-library/react';
import About from '../components/About';

describe('Testa o componente <About.js />.',
  () => {
    test('Teste se a página contém um heading h2 com o texto About Pokédex.', () => {
      render(<About />);

      const aboutLink = screen.getByRole('heading', { name: 'About Pokédex', level: 2 });
      expect(aboutLink).toBeInTheDocument();
    });
  });
