/**
 * TypeScript types for JSON-LD structured data (Schema.org)
 */

// Base types
export interface Thing {
  '@type': string;
  name?: string;
  url?: string;
  description?: string;
  image?: string | ImageObject;
}

export interface ImageObject {
  '@type': 'ImageObject';
  url: string;
  width?: number;
  height?: number;
}

// Organization schema
export interface Organization extends Thing {
  '@type': 'Organization';
  name: string;
  url: string;
  logo?: string | ImageObject;
}

// Person schema
export interface Person extends Thing {
  '@type': 'Person';
  name: string;
}

// WebSite schema
export interface WebSite extends Thing {
  '@type': 'WebSite';
  name: string;
  url: string;
}

// SoftwareApplication schema
export interface SoftwareApplication extends Thing {
  '@type': 'SoftwareApplication';
  name: string;
  applicationCategory?: string;
  operatingSystem?: string;
  offers?: Offer;
  downloadUrl?: string;
  softwareVersion?: string;
  author?: Person | Organization;
  isAccessibleForFree?: boolean;
  license?: string;
  featureList?: string | string[];
  releaseNotes?: string;
}

export interface Offer {
  '@type': 'Offer';
  price: string;
  priceCurrency: string;
}

// Article schema
export interface Article extends Thing {
  '@type': 'Article';
  headline: string;
  author?: Person | Organization;
  publisher?: Organization;
  datePublished?: string;
  dateModified?: string;
}

// BreadcrumbList schema
export interface BreadcrumbList {
  '@type': 'BreadcrumbList';
  itemListElement: BreadcrumbItem[];
}

export interface BreadcrumbItem {
  '@type': 'ListItem';
  position: number;
  name: string;
  item?: string;
}

// HowTo schema
export interface HowTo extends Thing {
  '@type': 'HowTo';
  name: string;
  step: HowToStep[];
  totalTime?: string;
  tool?: string | string[];
  supply?: string | string[];
}

export interface HowToStep {
  '@type': 'HowToStep';
  name: string;
  text: string;
  url?: string;
  position?: number;
}

// Union type for all supported schemas
export type JsonLdSchema =
  | Organization
  | WebSite
  | SoftwareApplication
  | Article
  | BreadcrumbList
  | HowTo;

// Wrapper with @context
export interface JsonLdWithContext {
  '@context': 'https://schema.org';
  '@graph'?: JsonLdSchema[];
}
