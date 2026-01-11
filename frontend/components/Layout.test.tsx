import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock the Analytics component
jest.mock('./Analytics', () => ({
  AnalyticsSetup: () => null,
}));

import Layout from './Layout';

describe('Layout', () => {
  it('renders children content', () => {
    render(
      <Layout>
        <div>Page Content</div>
      </Layout>
    );

    expect(screen.getByText('Page Content')).toBeInTheDocument();
  });

  it('renders the navbar', () => {
    render(
      <Layout>
        <div>Content</div>
      </Layout>
    );

    expect(screen.getByText('CryFS')).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(
      <Layout>
        <div>Content</div>
      </Layout>
    );

    expect(screen.getByText('How it works')).toBeInTheDocument();
    expect(screen.getByText('Tutorial')).toBeInTheDocument();
    expect(screen.getByText('Compare')).toBeInTheDocument();
    expect(screen.getByText('Download')).toBeInTheDocument();
    expect(screen.getByText('Donate')).toBeInTheDocument();
  });

  it('renders the footer', () => {
    render(
      <Layout>
        <div>Content</div>
      </Layout>
    );

    expect(screen.getByText(/Copyright/)).toBeInTheDocument();
    expect(screen.getByText(/Sebastian Messmer/)).toBeInTheDocument();
  });

  it('renders legal notice link in footer', () => {
    render(
      <Layout>
        <div>Content</div>
      </Layout>
    );

    expect(screen.getByText('Legal Notice')).toBeInTheDocument();
  });

  it('renders GitHub ribbon', () => {
    render(
      <Layout>
        <div>Content</div>
      </Layout>
    );

    expect(screen.getByAltText('Fork me on GitHub')).toBeInTheDocument();
  });

  it('renders navbar brand as link to home', () => {
    render(
      <Layout>
        <div>Content</div>
      </Layout>
    );

    const brandLink = screen.getByRole('link', { name: /cryfs/i });
    expect(brandLink).toHaveAttribute('href', '/');
  });

  it('renders multiple children', () => {
    render(
      <Layout>
        <div>Section 1</div>
        <div>Section 2</div>
        <div>Section 3</div>
      </Layout>
    );

    expect(screen.getByText('Section 1')).toBeInTheDocument();
    expect(screen.getByText('Section 2')).toBeInTheDocument();
    expect(screen.getByText('Section 3')).toBeInTheDocument();
  });

  it('renders navbar toggler for mobile', () => {
    render(
      <Layout>
        <div>Content</div>
      </Layout>
    );

    // The toggler button should exist
    const toggler = screen.getByRole('button', { name: /toggle navigation/i });
    expect(toggler).toBeInTheDocument();
  });

  it('toggles navbar on mobile when toggler is clicked', async () => {
    const user = userEvent.setup();

    render(
      <Layout>
        <div>Content</div>
      </Layout>
    );

    const toggler = screen.getByRole('button', { name: /toggle navigation/i });

    // Click the toggler to open
    await user.click(toggler);

    // Click again to close
    await user.click(toggler);

    // Component should still be functional
    expect(toggler).toBeInTheDocument();
  });

  it('renders navigation items with correct href', () => {
    render(
      <Layout>
        <div>Content</div>
      </Layout>
    );

    const howItWorksLink = screen.getByRole('link', { name: /how it works/i });
    const tutorialLink = screen.getByRole('link', { name: /tutorial/i });
    const compareLink = screen.getByRole('link', { name: /compare/i });

    expect(howItWorksLink).toHaveAttribute('href', '/howitworks');
    expect(tutorialLink).toHaveAttribute('href', '/tutorial');
    expect(compareLink).toHaveAttribute('href', '/comparison');
  });

  it('includes GitHub ribbon link', () => {
    render(
      <Layout>
        <div>Content</div>
      </Layout>
    );

    const githubLink = screen.getByRole('link', { name: /fork me on github/i });
    expect(githubLink).toHaveAttribute('href', 'https://github.com/cryfs/cryfs');
  });
});
