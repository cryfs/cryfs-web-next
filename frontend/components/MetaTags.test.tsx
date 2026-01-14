import React from 'react';
import { render } from '@testing-library/react';
import MetaTags from './MetaTags';

// Helper to query meta tags from document.head
const getMetaContent = (property: string): string | null => {
  const meta = document.head.querySelector<HTMLMetaElement>(`meta[property="${property}"]`);
  return meta?.content ?? null;
};

const getMetaName = (name: string): string | null => {
  const meta = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  return meta?.content ?? null;
};

describe('MetaTags', () => {
  beforeEach(() => {
    // Clear any meta tags from previous tests
    document.head.innerHTML = '';
  });

  it('renders without crashing', () => {
    render(
      <MetaTags
        title="Test Title"
        url="https://example.com"
        description="Test description"
      />
    );
    // If we get here without throwing, the component rendered successfully
  });

  it('renders with required props', () => {
    render(
      <MetaTags
        title="CryFS - Secure Cloud Storage"
        url="https://cryfs.org"
        description="Encrypt your Dropbox with CryFS"
      />
    );

    expect(getMetaContent('og:title')).toBe('CryFS - Secure Cloud Storage');
    expect(getMetaContent('og:url')).toBe('https://cryfs.org');
    expect(getMetaContent('og:description')).toBe('Encrypt your Dropbox with CryFS');
    expect(getMetaName('description')).toBe('Encrypt your Dropbox with CryFS');
  });

  it('renders title element', () => {
    render(
      <MetaTags
        title="Page Title"
        url="https://example.com"
        description="Description"
      />
    );

    expect(document.head.querySelector('title')?.textContent).toBe('Page Title');
  });

  it('defaults og:type to website when not provided', () => {
    render(
      <MetaTags
        title="Test"
        url="https://example.com"
        description="Description"
      />
    );

    expect(getMetaContent('og:type')).toBe('website');
  });

  it('uses provided og:type', () => {
    render(
      <MetaTags
        title="Test"
        url="https://example.com"
        description="Description"
        type="article"
      />
    );

    expect(getMetaContent('og:type')).toBe('article');
  });

  it('renders article author meta tag for article type', () => {
    render(
      <MetaTags
        title="Blog Post"
        url="https://example.com/blog"
        description="Blog description"
        type="article"
      />
    );

    expect(getMetaContent('article:author')).toBe('https://www.facebook.com/sebastian.messmer');
  });

  it('does not render article author meta tag for non-article types', () => {
    render(
      <MetaTags
        title="Test"
        url="https://example.com"
        description="Description"
        type="website"
      />
    );

    expect(getMetaContent('article:author')).toBeNull();
  });

  it('does not render article author meta tag when type is undefined', () => {
    render(
      <MetaTags
        title="Test"
        url="https://example.com"
        description="Description"
      />
    );

    expect(getMetaContent('article:author')).toBeNull();
  });

  it('renders og:image meta tag', () => {
    render(
      <MetaTags
        title="Test"
        url="https://example.com"
        description="Description"
      />
    );

    expect(getMetaContent('og:image')).toBeTruthy();
  });

  it('renders Twitter Card meta tags', () => {
    render(
      <MetaTags
        title="CryFS - Secure Cloud Storage"
        url="https://cryfs.org"
        description="Encrypt your Dropbox with CryFS"
      />
    );

    expect(getMetaName('twitter:card')).toBe('summary_large_image');
    expect(getMetaName('twitter:title')).toBe('CryFS - Secure Cloud Storage');
    expect(getMetaName('twitter:description')).toBe('Encrypt your Dropbox with CryFS');
    expect(getMetaName('twitter:image')).toBeTruthy();
  });

  it('handles special characters in title and description', () => {
    render(
      <MetaTags
        title="CryFS & Security <Features>"
        url="https://example.com"
        description="Encrypt your files & folders safely"
      />
    );

    expect(getMetaContent('og:title')).toBe('CryFS & Security <Features>');
    expect(getMetaContent('og:description')).toBe('Encrypt your files & folders safely');
  });

  it('handles URLs with query parameters', () => {
    render(
      <MetaTags
        title="Test"
        url="https://example.com/page?param=value"
        description="Description"
      />
    );

    expect(getMetaContent('og:url')).toBe('https://example.com/page?param=value');
  });

  it('handles URLs with hash fragments', () => {
    render(
      <MetaTags
        title="Test"
        url="https://example.com/page#section"
        description="Description"
      />
    );

    expect(getMetaContent('og:url')).toBe('https://example.com/page#section');
  });
});
