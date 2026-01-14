import React from 'react';
import { render } from '@testing-library/react';
import JsonLd from './JsonLdSchema';
import type { Organization, SoftwareApplication, Article, WebSite, BreadcrumbList, HowTo } from '../types/jsonld';

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

  it('renders BreadcrumbList schema correctly', () => {
    const schema: BreadcrumbList = {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://www.cryfs.org',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Tutorial',
          item: 'https://www.cryfs.org/tutorial',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Installation',
        },
      ],
    };

    render(<JsonLd schema={schema} />);

    const content = getJsonLdContent() as { '@context': string } & BreadcrumbList;
    expect(content['@context']).toBe('https://schema.org');
    expect(content['@type']).toBe('BreadcrumbList');
    expect(content.itemListElement).toHaveLength(3);
    expect(content.itemListElement[0]).toEqual({
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://www.cryfs.org',
    });
    expect(content.itemListElement[1].position).toBe(2);
    expect(content.itemListElement[2].name).toBe('Installation');
    expect(content.itemListElement[2].item).toBeUndefined();
  });

  it('renders HowTo schema correctly', () => {
    const schema: HowTo = {
      '@type': 'HowTo',
      name: 'How to Install CryFS',
      description: 'Step-by-step guide to install and configure CryFS',
      step: [
        {
          '@type': 'HowToStep',
          name: 'Install CryFS',
          text: 'Install CryFS using your package manager',
          position: 1,
        },
        {
          '@type': 'HowToStep',
          name: 'Create encrypted directory',
          text: 'Run cryfs command to create an encrypted directory',
          url: 'https://www.cryfs.org/tutorial#create',
          position: 2,
        },
      ],
      totalTime: 'PT10M',
      tool: ['Terminal', 'Package manager'],
    };

    render(<JsonLd schema={schema} />);

    const content = getJsonLdContent() as { '@context': string } & HowTo;
    expect(content['@context']).toBe('https://schema.org');
    expect(content['@type']).toBe('HowTo');
    expect(content.name).toBe('How to Install CryFS');
    expect(content.description).toBe('Step-by-step guide to install and configure CryFS');
    expect(content.step).toHaveLength(2);
    expect(content.step[0]).toEqual({
      '@type': 'HowToStep',
      name: 'Install CryFS',
      text: 'Install CryFS using your package manager',
      position: 1,
    });
    expect(content.step[1].url).toBe('https://www.cryfs.org/tutorial#create');
    expect(content.totalTime).toBe('PT10M');
    expect(content.tool).toEqual(['Terminal', 'Package manager']);
  });

  it('renders HowTo schema with supply property', () => {
    const schema: HowTo = {
      '@type': 'HowTo',
      name: 'Encrypt Cloud Storage',
      step: [
        {
          '@type': 'HowToStep',
          name: 'Prepare',
          text: 'Prepare your environment',
        },
      ],
      supply: 'Cloud storage account',
    };

    render(<JsonLd schema={schema} />);

    const content = getJsonLdContent() as { '@context': string } & HowTo;
    expect(content.supply).toBe('Cloud storage account');
  });

  it('renders WebSite schema correctly', () => {
    const schema: WebSite = {
      '@type': 'WebSite',
      name: 'CryFS',
      url: 'https://www.cryfs.org',
      description: 'Cryptographic filesystem for cloud storage',
    };

    render(<JsonLd schema={schema} />);

    const content = getJsonLdContent() as { '@context': string } & WebSite;
    expect(content['@context']).toBe('https://schema.org');
    expect(content['@type']).toBe('WebSite');
    expect(content.name).toBe('CryFS');
    expect(content.url).toBe('https://www.cryfs.org');
    expect(content.description).toBe('Cryptographic filesystem for cloud storage');
  });

  it('renders combined schemas for a typical page', () => {
    const websiteSchema: WebSite = {
      '@type': 'WebSite',
      name: 'CryFS',
      url: 'https://www.cryfs.org',
    };

    const breadcrumbSchema: BreadcrumbList = {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://www.cryfs.org',
        },
      ],
    };

    const articleSchema: Article = {
      '@type': 'Article',
      headline: 'Getting Started with CryFS',
      description: 'Learn how to encrypt your cloud storage',
    };

    render(<JsonLd schema={[websiteSchema, breadcrumbSchema, articleSchema]} />);

    const content = getJsonLdContent() as { '@context': string; '@graph': unknown[] };
    expect(content['@context']).toBe('https://schema.org');
    expect(content['@graph']).toHaveLength(3);
    expect((content['@graph'][0] as WebSite)['@type']).toBe('WebSite');
    expect((content['@graph'][1] as BreadcrumbList)['@type']).toBe('BreadcrumbList');
    expect((content['@graph'][2] as Article)['@type']).toBe('Article');
  });
});
