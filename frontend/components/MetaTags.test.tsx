import React from 'react';
import { render } from '@testing-library/react';
import MetaTags from './MetaTags';

// The Head component is mocked, so we need to test what gets passed to it
describe('MetaTags', () => {
  it('renders without crashing', () => {
    render(
      <MetaTags
        title="Test Title"
        url="https://example.com"
        description="Test description"
      />
    );
  });

  it('renders with required props', () => {
    const { container } = render(
      <MetaTags
        title="CryFS - Secure Cloud Storage"
        url="https://cryfs.org"
        description="Encrypt your Dropbox with CryFS"
      />
    );

    // Check that meta tags are rendered
    expect(container.querySelector('meta[property="og:title"]')).toHaveAttribute(
      'content',
      'CryFS - Secure Cloud Storage'
    );
    expect(container.querySelector('meta[property="og:url"]')).toHaveAttribute(
      'content',
      'https://cryfs.org'
    );
    expect(container.querySelector('meta[property="og:description"]')).toHaveAttribute(
      'content',
      'Encrypt your Dropbox with CryFS'
    );
    expect(container.querySelector('meta[name="description"]')).toHaveAttribute(
      'content',
      'Encrypt your Dropbox with CryFS'
    );
  });

  it('renders title element', () => {
    const { container } = render(
      <MetaTags
        title="Page Title"
        url="https://example.com"
        description="Description"
      />
    );

    expect(container.querySelector('title')).toHaveTextContent('Page Title');
  });

  it('defaults og:type to website when not provided', () => {
    const { container } = render(
      <MetaTags
        title="Test"
        url="https://example.com"
        description="Description"
      />
    );

    expect(container.querySelector('meta[property="og:type"]')).toHaveAttribute(
      'content',
      'website'
    );
  });

  it('uses provided og:type', () => {
    const { container } = render(
      <MetaTags
        title="Test"
        url="https://example.com"
        description="Description"
        type="article"
      />
    );

    expect(container.querySelector('meta[property="og:type"]')).toHaveAttribute(
      'content',
      'article'
    );
  });

  it('renders article author meta tag for article type', () => {
    const { container } = render(
      <MetaTags
        title="Blog Post"
        url="https://example.com/blog"
        description="Blog description"
        type="article"
      />
    );

    expect(container.querySelector('meta[property="article:author"]')).toHaveAttribute(
      'content',
      'https://www.facebook.com/sebastian.messmer'
    );
  });

  it('does not render article author meta tag for non-article types', () => {
    const { container } = render(
      <MetaTags
        title="Test"
        url="https://example.com"
        description="Description"
        type="website"
      />
    );

    expect(container.querySelector('meta[property="article:author"]')).not.toBeInTheDocument();
  });

  it('does not render article author meta tag when type is undefined', () => {
    const { container } = render(
      <MetaTags
        title="Test"
        url="https://example.com"
        description="Description"
      />
    );

    expect(container.querySelector('meta[property="article:author"]')).not.toBeInTheDocument();
  });

  it('renders og:image meta tag', () => {
    const { container } = render(
      <MetaTags
        title="Test"
        url="https://example.com"
        description="Description"
      />
    );

    expect(container.querySelector('meta[property="og:image"]')).toBeInTheDocument();
  });

  it('handles special characters in title and description', () => {
    const { container } = render(
      <MetaTags
        title="CryFS & Security <Features>"
        url="https://example.com"
        description="Encrypt your files & folders safely"
      />
    );

    expect(container.querySelector('meta[property="og:title"]')).toHaveAttribute(
      'content',
      'CryFS & Security <Features>'
    );
    expect(container.querySelector('meta[property="og:description"]')).toHaveAttribute(
      'content',
      'Encrypt your files & folders safely'
    );
  });

  it('handles URLs with query parameters', () => {
    const { container } = render(
      <MetaTags
        title="Test"
        url="https://example.com/page?param=value"
        description="Description"
      />
    );

    expect(container.querySelector('meta[property="og:url"]')).toHaveAttribute(
      'content',
      'https://example.com/page?param=value'
    );
  });

  it('handles URLs with hash fragments', () => {
    const { container } = render(
      <MetaTags
        title="Test"
        url="https://example.com/page#section"
        description="Description"
      />
    );

    expect(container.querySelector('meta[property="og:url"]')).toHaveAttribute(
      'content',
      'https://example.com/page#section'
    );
  });
});
