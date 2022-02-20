import React from 'react';
import { screen, render } from '@testing-library/react';
import NotFound from '../components/NotFound';

describe('Testa o componente <NotFound.js />.',
  () => {
    test('Testa se página contém um heading h2 com o texto correto', () => {
      render(<NotFound />);

      const h2 = screen.getByRole(
        'heading', { name: 'Page requested not found Crying emoji', level: 2 },
      );
      expect(h2).toBeInTheDocument();
    });

    test('Testa se a página contém a imagem com a URL correta', () => {
      render(<NotFound />);
      const url = 'https://media.giphy.com/media/kNSeTs31XBZ3G/giphy.gif';
      const img = screen.getByAltText(
        'Pikachu crying because the page requested was not found',
      );
      expect(img.src).toContain(url);
    });
  });
