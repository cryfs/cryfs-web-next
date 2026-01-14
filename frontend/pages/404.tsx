import Layout from '../components/Layout';
import AlternatingSections from '../components/AlternatingSections';
import ContentHeaderSection from '../components/ContentHeaderSection';
import MetaTags from '../components/MetaTags';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faSearch } from '@fortawesome/free-solid-svg-icons';
import styles from './404.module.css';

const NotFoundPage = () => (
    <Layout>
        <MetaTags
            title="Page Not Found - CryFS"
            url="https://www.cryfs.org/404"
            description="The page you are looking for could not be found."
        />

        <AlternatingSections>
            <ContentHeaderSection
                title="404"
                subtitle="Page Not Found"
            />

            <section>
                <Container className={styles.content}>
                    <div className={styles.iconWrapper}>
                        <FontAwesomeIcon icon={faSearch} className={styles.icon} />
                    </div>

                    <p className={styles.message}>
                        Sorry, the page you are looking for doesn&apos;t exist or has been moved.
                    </p>

                    <p className={styles.suggestion}>
                        You might want to check if the URL is correct, or head back to the homepage
                        to find what you&apos;re looking for.
                    </p>

                    <div className={styles.actions}>
                        <Link href="/" passHref legacyBehavior>
                            <Button variant="primary" size="lg">
                                <FontAwesomeIcon icon={faHome} className="me-2" />
                                Back to Homepage
                            </Button>
                        </Link>
                    </div>
                </Container>
            </section>
        </AlternatingSections>
    </Layout>
);

export default NotFoundPage;
