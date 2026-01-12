
import { render, screen } from '@testing-library/react';
import { Console, ConsoleCommand, ConsoleOutput } from './Console';

describe('Console', () => {
  describe('Console component', () => {
    it('renders children correctly', () => {
      render(<Console>Test content</Console>);
      expect(screen.getByText('Test content')).toBeInTheDocument();
    });

    it('renders as a pre element', () => {
      render(<Console>Content</Console>);
      const preElement = screen.getByText('Content').closest('pre');
      expect(preElement).toBeInTheDocument();
    });

    it('renders multiple children', () => {
      render(
        <Console>
          <span>Line 1</span>
          <span>Line 2</span>
        </Console>
      );
      expect(screen.getByText('Line 1')).toBeInTheDocument();
      expect(screen.getByText('Line 2')).toBeInTheDocument();
    });

    it('renders nested components', () => {
      render(
        <Console>
          <ConsoleCommand>echo hello</ConsoleCommand>
          <ConsoleOutput>hello</ConsoleOutput>
        </Console>
      );
      expect(screen.getByText('echo hello')).toBeInTheDocument();
      expect(screen.getByText('hello')).toBeInTheDocument();
    });
  });

  describe('ConsoleCommand component', () => {
    it('renders children correctly', () => {
      render(<ConsoleCommand>ls -la</ConsoleCommand>);
      expect(screen.getByText('ls -la')).toBeInTheDocument();
    });

    it('renders with $ prompt', () => {
      render(<ConsoleCommand>pwd</ConsoleCommand>);
      expect(screen.getByText('$')).toBeInTheDocument();
    });

    it('renders as a div element', () => {
      render(<ConsoleCommand>test</ConsoleCommand>);
      const container = screen.getByText('test').closest('div');
      expect(container).toBeInTheDocument();
    });

    it('renders complex commands', () => {
      render(<ConsoleCommand>sudo apt install cryfs</ConsoleCommand>);
      expect(screen.getByText('sudo apt install cryfs')).toBeInTheDocument();
    });

    it('renders with additional className', () => {
      render(<ConsoleCommand className="custom-class">cmd</ConsoleCommand>);
      expect(screen.getByText('cmd')).toBeInTheDocument();
    });
  });

  describe('ConsoleOutput component', () => {
    it('renders children correctly', () => {
      render(<ConsoleOutput>Output text</ConsoleOutput>);
      expect(screen.getByText('Output text')).toBeInTheDocument();
    });

    it('renders as a div element', () => {
      render(<ConsoleOutput>output</ConsoleOutput>);
      const container = screen.getByText('output').closest('div');
      expect(container).toBeInTheDocument();
    });

    it('renders multiline output', () => {
      render(
        <ConsoleOutput>
          Line 1{'\n'}Line 2
        </ConsoleOutput>
      );
      expect(screen.getByText(/Line 1/)).toBeInTheDocument();
    });

    it('renders without $ prompt', () => {
      const { container } = render(<ConsoleOutput>output</ConsoleOutput>);
      expect(container.textContent).not.toContain('$');
    });
  });

  describe('Integration', () => {
    it('renders a complete console session', () => {
      render(
        <Console>
          <ConsoleCommand>cryfs basedir mountdir</ConsoleCommand>
          <ConsoleOutput>CryFS Version 1.0.0</ConsoleOutput>
          <ConsoleCommand>ls mountdir</ConsoleCommand>
          <ConsoleOutput>file1.txt file2.txt</ConsoleOutput>
        </Console>
      );

      expect(screen.getByText('cryfs basedir mountdir')).toBeInTheDocument();
      expect(screen.getByText('CryFS Version 1.0.0')).toBeInTheDocument();
      expect(screen.getByText('ls mountdir')).toBeInTheDocument();
      expect(screen.getByText('file1.txt file2.txt')).toBeInTheDocument();
    });

    it('displays commands with prompts and outputs without', () => {
      const { container } = render(
        <Console>
          <ConsoleCommand>echo test</ConsoleCommand>
          <ConsoleOutput>test</ConsoleOutput>
        </Console>
      );

      // Find all $ symbols (should be 1 for the command)
      const promptElements = container.querySelectorAll('span');
      const prompts = Array.from(promptElements).filter(el => el.textContent === '$');
      expect(prompts).toHaveLength(1);
    });
  });
});
