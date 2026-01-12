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
            title="CryFS: A cryptographic filesystem for the cloud"
            url="https://www.cryfs.org"
            description="CryFS encrypts your Dropbox and protects you against hackers and data leaks. It also works well together with other cloud providers."
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
