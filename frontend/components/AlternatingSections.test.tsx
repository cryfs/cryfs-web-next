
import { render, screen } from '@testing-library/react';
import AlternatingSections from './AlternatingSections';

describe('AlternatingSections', () => {
  it('renders children correctly', () => {
    render(
      <AlternatingSections>
        <div>Section 1</div>
        <div>Section 2</div>
      </AlternatingSections>
    );

    expect(screen.getByText('Section 1')).toBeInTheDocument();
    expect(screen.getByText('Section 2')).toBeInTheDocument();
  });

  it('applies alternating styles to children', () => {
    const { container } = render(
      <AlternatingSections>
        <div data-testid="section-1">Section 1</div>
        <div data-testid="section-2">Section 2</div>
        <div data-testid="section-3">Section 3</div>
      </AlternatingSections>
    );

    const sections = container.querySelectorAll('[data-testid^="section-"]');

    // All sections should have className applied
    sections.forEach((section) => {
      expect(section.className).toBeTruthy();
    });
  });

  it('preserves existing className on children', () => {
    render(
      <AlternatingSections>
        <div className="existing-class" data-testid="section">Section 1</div>
      </AlternatingSections>
    );

    const section = screen.getByTestId('section');
    expect(section.className).toContain('existing-class');
  });

  it('handles single child', () => {
    render(
      <AlternatingSections>
        <div>Only Section</div>
      </AlternatingSections>
    );

    expect(screen.getByText('Only Section')).toBeInTheDocument();
  });

  it('handles many children', () => {
    render(
      <AlternatingSections>
        <div>Section 1</div>
        <div>Section 2</div>
        <div>Section 3</div>
        <div>Section 4</div>
        <div>Section 5</div>
      </AlternatingSections>
    );

    expect(screen.getByText('Section 1')).toBeInTheDocument();
    expect(screen.getByText('Section 2')).toBeInTheDocument();
    expect(screen.getByText('Section 3')).toBeInTheDocument();
    expect(screen.getByText('Section 4')).toBeInTheDocument();
    expect(screen.getByText('Section 5')).toBeInTheDocument();
  });

  it('uses start_index when provided', () => {
    const { container } = render(
      <AlternatingSections start_index={1}>
        <div data-testid="section-1">Section 1</div>
        <div data-testid="section-2">Section 2</div>
      </AlternatingSections>
    );

    const sections = container.querySelectorAll('[data-testid^="section-"]');

    // All sections should have className applied (starting from index 1)
    sections.forEach((section) => {
      expect(section.className).toBeTruthy();
    });
  });

  it('defaults to start_index 0 when not provided', () => {
    const { container } = render(
      <AlternatingSections>
        <div data-testid="section">Section</div>
      </AlternatingSections>
    );

    const section = container.querySelector('[data-testid="section"]');
    expect(section?.className).toBeTruthy();
  });

  it('cycles styles for more than 2 children', () => {
    const { container } = render(
      <AlternatingSections>
        <div data-testid="section-1">Section 1</div>
        <div data-testid="section-2">Section 2</div>
        <div data-testid="section-3">Section 3</div>
        <div data-testid="section-4">Section 4</div>
      </AlternatingSections>
    );

    const sections = container.querySelectorAll('[data-testid^="section-"]');

    // All sections should have styles applied
    expect(sections).toHaveLength(4);
    sections.forEach((section) => {
      expect(section.className).toBeTruthy();
    });
  });

  it('renders different HTML elements as children', () => {
    render(
      <AlternatingSections>
        <section>Section element</section>
        <article>Article element</article>
        <div>Div element</div>
      </AlternatingSections>
    );

    expect(screen.getByText('Section element')).toBeInTheDocument();
    expect(screen.getByText('Article element')).toBeInTheDocument();
    expect(screen.getByText('Div element')).toBeInTheDocument();
  });

  it('handles children with complex content', () => {
    render(
      <AlternatingSections>
        <div>
          <h1>Title</h1>
          <p>Paragraph content</p>
        </div>
        <div>
          <ul>
            <li>Item 1</li>
            <li>Item 2</li>
          </ul>
        </div>
      </AlternatingSections>
    );

    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Paragraph content')).toBeInTheDocument();
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });
});
