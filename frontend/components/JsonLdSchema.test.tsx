import React from 'react';
import { render } from '@testing-library/react';
import JsonLd from './JsonLdSchema';
import type { Organization, SoftwareApplication, Article, WebSite } from '../types/jsonld';

// Helper to get JSON-LD script content from document.head
const getJsonLdContent = (): unknown => {
  const script = document.head.querySelector<HTMLScriptElement>('script[type="application/ld+json"]');
  if (!script?.textContent) return null;
  return JSON.parse(script.textContent);
};

describe('JsonLdSchema', () => {
  beforeEach(() => {
    // Clear any scripts from previous tests
    document.head.innerHTML = '';
  });

  it('renders without crashing', () => {
    const schema: Organization = {
      '@type': 'Organization',
      name: 'Test Org',
      url: 'https://example.com',
    };

    render(<JsonLd schema={schema} />);
    // If we get here without throwing, the component rendered successfully
  });

  it('renders Organization schema correctly', () => {
    const schema: Organization = {
      '@type': 'Organization',
      name: 'CryFS',
      url: 'https://www.cryfs.org',
      description: 'Cloud encryption software',
    };

    render(<JsonLd schema={schema} />);

    const content = getJsonLdContent() as { '@context': string } & Organization;
    expect(content['@context']).toBe('https://schema.org');
    expect(content['@type']).toBe('Organization');
    expect(content.name).toBe('CryFS');
    expect(content.url).toBe('https://www.cryfs.org');
    expect(content.description).toBe('Cloud encryption software');
  });

  it('renders Organization schema with logo ImageObject', () => {
    const schema: Organization = {
      '@type': 'Organization',
      name: 'CryFS',
      url: 'https://www.cryfs.org',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.cryfs.org/logo.png',
        width: 200,
        height: 200,
      },
    };

    render(<JsonLd schema={schema} />);

    const content = getJsonLdContent() as { '@context': string } & Organization;
    expect(content.logo).toEqual({
      '@type': 'ImageObject',
      url: 'https://www.cryfs.org/logo.png',
      width: 200,
      height: 200,
    });
  });

  it('renders SoftwareApplication schema correctly', () => {
    const schema: SoftwareApplication = {
      '@type': 'SoftwareApplication',
      name: 'CryFS',
      applicationCategory: 'SecurityApplication',
      operatingSystem: 'Linux, macOS',
      softwareVersion: '1.0.0',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
    };

    render(<JsonLd schema={schema} />);

    const content = getJsonLdContent() as { '@context': string } & SoftwareApplication;
    expect(content['@context']).toBe('https://schema.org');
    expect(content['@type']).toBe('SoftwareApplication');
    expect(content.name).toBe('CryFS');
    expect(content.applicationCategory).toBe('SecurityApplication');
    expect(content.operatingSystem).toBe('Linux, macOS');
    expect(content.softwareVersion).toBe('1.0.0');
    expect(content.offers).toEqual({
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    });
  });

  it('renders Article schema correctly', () => {
    const schema: Article = {
      '@type': 'Article',
      headline: 'How CryFS Works',
      description: 'Learn about CryFS encryption',
      author: {
        '@type': 'Person',
        name: 'Sebastian Messmer',
      },
      publisher: {
        '@type': 'Organization',
        name: 'CryFS',
        url: 'https://www.cryfs.org',
      },
    };

    render(<JsonLd schema={schema} />);

    const content = getJsonLdContent() as { '@context': string } & Article;
    expect(content['@context']).toBe('https://schema.org');
    expect(content['@type']).toBe('Article');
    expect(content.headline).toBe('How CryFS Works');
    expect(content.author).toEqual({
      '@type': 'Person',
      name: 'Sebastian Messmer',
    });
  });

  it('renders multiple schemas as @graph', () => {
    const websiteSchema: WebSite = {
      '@type': 'WebSite',
      name: 'CryFS',
      url: 'https://www.cryfs.org',
    };

    const softwareSchema: SoftwareApplication = {
      '@type': 'SoftwareApplication',
      name: 'CryFS',
      applicationCategory: 'SecurityApplication',
    };

    render(<JsonLd schema={[websiteSchema, softwareSchema]} />);

    const content = getJsonLdContent() as { '@context': string; '@graph': unknown[] };
    expect(content['@context']).toBe('https://schema.org');
    expect(content['@graph']).toHaveLength(2);
    expect(content['@graph'][0]).toEqual(websiteSchema);
    expect(content['@graph'][1]).toEqual(softwareSchema);
  });

  it('renders valid JSON that can be parsed', () => {
    const schema: Organization = {
      '@type': 'Organization',
      name: 'Test with "quotes" and special chars: <>&',
      url: 'https://example.com',
    };

    render(<JsonLd schema={schema} />);

    // Should not throw when parsing
    const content = getJsonLdContent();
    expect(content).not.toBeNull();
  });

  it('renders script tag with correct type attribute', () => {
    const schema: Organization = {
      '@type': 'Organization',
      name: 'Test',
      url: 'https://example.com',
    };

    render(<JsonLd schema={schema} />);

    const script = document.head.querySelector('script[type="application/ld+json"]');
    expect(script).not.toBeNull();
  });
});
