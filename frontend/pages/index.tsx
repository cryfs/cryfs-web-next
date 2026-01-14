import Layout from '../components/Layout';
import DonateModal from '../components/modals/Donate';
import DownloadModal from '../components/modals/Download';
import HeroSection from '../components/sections/HeroSection';
import CloudProvidersSection from '../components/sections/CloudProvidersSection';
import HowItWorksSection from '../components/sections/HowItWorksSection';
import FeaturesSection from '../components/sections/FeaturesSection';
import SecuritySection from '../components/sections/SecuritySection';
import NewsletterSection from '../components/sections/NewsletterSection';
import ContactSection from '../components/sections/ContactSection';
import CtaSection from '../components/sections/CtaSection';
import MetaTags from "../components/MetaTags";
import styles from '../components/sections/LandingPage.module.css';

const Index = () => (
    <Layout>
        <MetaTags
            title="CryFS: Encrypt your cloud storage"
            url="https://www.cryfs.org"
            description="CryFS encrypts your files locally before syncing to the cloud. Protect your data from hackers, breaches, and unauthorized access on Dropbox, Google Drive, iCloud, and more."
        />

        <HeroSection />
        <CloudProvidersSection />

        <DownloadModal />
        <DonateModal />

        <HowItWorksSection />
        <FeaturesSection />
        <SecuritySection />
        <CtaSection />

        <section className={styles.newsletterSection}>
            <NewsletterSection />
        </section>
        <section className={styles.contactSection}>
            <ContactSection />
        </section>
    </Layout>
);

export default Index;
