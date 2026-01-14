import Head from 'next/head';
import type { JsonLdSchema } from '../types/jsonld';

interface JsonLdProps {
  schema: JsonLdSchema | JsonLdSchema[];
}

/**
 * Component to render JSON-LD structured data in the document head.
 * Supports single schema or array of schemas (rendered as @graph).
 */
const JsonLd = ({ schema }: JsonLdProps) => {
  const jsonLd = Array.isArray(schema)
    ? {
        '@context': 'https://schema.org',
        '@graph': schema,
      }
    : {
        '@context': 'https://schema.org',
        ...schema,
      };

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </Head>
  );
};

export default JsonLd;
