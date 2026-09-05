import { render, screen } from '@testing-library/react';
import Note from './Note';
import { expect } from 'vitest';

test('renders content', () => {
    const note = {
        content: 'Component testing is done with react-testing-library',
        important: true
    };

    render(<Note note={note} />);

    screen.debug();

    const element = screen.getByText(
        'Component testing is done with react-testing-library',
        { exact: false }
    );

    screen.debug(element);

    expect(element).toBeDefined();
});

test('does not render this', () => {
    const note = {
        content: 'This is a reminder',
        important: true 
    };

    render(<Note note={note} />);

    const element = screen.queryByText('do not want this to be rendered');
    expect(element).toBeNull();
});

test('renders content w CSS-selector querySelector', () => {
    const note = {
        content: 'Does not work anymore :(',
        important: true
    };

    const { container } = render(<Note note={note} />);

    const div = container.querySelector('.note');
    expect(div).toHaveTextContent('Does not work anymore :(');
});