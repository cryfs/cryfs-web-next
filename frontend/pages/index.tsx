import Layout from '../components/Layout';
import AlternatingSections from '../components/AlternatingSections';
import DonateModal from '../components/modals/Donate';
import DownloadModal from '../components/modals/Download';
import Teaser from '../components/Teaser';
import NewsletterSection from '../components/sections/NewsletterSection';
import BulletsSection from '../components/sections/BulletsSection';
import ContactSection from '../components/sections/ContactSection';
import MetaTags from "../components/MetaTags";

const Index = () => (
    <Layout>
        {/* TODO translate tags in here*/}
        <MetaTags
            title="CryFS: Encrypt your cloud storage"
            url="https://www.cryfs.org"
            description="CryFS encrypts your files locally before syncing to the cloud. Protect your data from hackers, breaches, and unauthorized access on Dropbox, Google Drive, iCloud, and more."
        />

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
