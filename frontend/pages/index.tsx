import Layout from '../components/Layout';
import AlternatingSections from '../components/AlternatingSections';
import DonateModal from '../components/modals/Donate';
import DownloadModal from '../components/modals/Download';
import Teaser from '../components/Teaser';
import NewsletterSection from '../components/sections/NewsletterSection';
import BulletsSection from '../components/sections/BulletsSection';
import ContactSection from '../components/sections/ContactSection';
import MetaTags from "../components/MetaTags";
import JsonLd from '../components/JsonLdSchema';
import type { SoftwareApplication, WebSite } from '../types/jsonld';
import { VersionNumber } from '../config/CryfsVersion';

const websiteSchema: WebSite = {
    '@type': 'WebSite',
    name: 'CryFS',
    url: 'https://www.cryfs.org',
};

const softwareSchema: SoftwareApplication = {
    '@type': 'SoftwareApplication',
    name: 'CryFS',
    description: 'CryFS encrypts your files locally before syncing to the cloud. Protect your data from hackers, breaches, and unauthorized access on Dropbox, Google Drive, iCloud, and more.',
    applicationCategory: 'SecurityApplication',
    operatingSystem: 'Linux, macOS, Windows',
    softwareVersion: VersionNumber,
    downloadUrl: 'https://www.cryfs.org/#download',
    isAccessibleForFree: true,
    license: 'https://www.gnu.org/licenses/lgpl-3.0.html',
    releaseNotes: 'https://github.com/cryfs/cryfs/blob/main/ChangeLog.txt',
    featureList: [
        'Encrypts file contents, file sizes, and directory structure',
        'Works with Dropbox, Google Drive, iCloud, OneDrive, and other cloud providers',
        'Protects against unauthorized modifications',
        'Open source and free to use',
    ],
    offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
    },
    author: {
        '@type': 'Person',
        name: 'Sebastian Messmer',
    },
};

const Index = () => (
    <Layout>
        {/* TODO translate tags in here*/}
        <MetaTags
            title="CryFS: Encrypt your cloud storage"
            url="https://www.cryfs.org"
            description="CryFS encrypts your files locally before syncing to the cloud. Protect your data from hackers, breaches, and unauthorized access on Dropbox, Google Drive, iCloud, and more."
        />
        <JsonLd schema={[websiteSchema, softwareSchema]} />

        <Teaser />

        <DownloadModal />
        <DonateModal />

        <AlternatingSections>
            <section><BulletsSection /></section>
            <section><NewsletterSection /></section>
            <section><ContactSection /></section>
        </AlternatingSections>
    </Layout>
);

export default Index;
