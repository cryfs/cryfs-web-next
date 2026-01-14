import Layout from '../components/Layout';
import MetaTags from '../components/MetaTags';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Link from 'next/link';
import Picture from 'next-export-optimize-images/picture';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faBook, faLock, faDownload } from '@fortawesome/free-solid-svg-icons';
import logoImage from '../assets/images/logo.png';
import styles from './404.module.css';

const NotFoundPage = () => (
    <Layout>
        <MetaTags
            title="Page Not Found - CryFS"
            url="https://www.cryfs.org/404"
            description="The page you are looking for could not be found."
        />

        <section className={styles.heroSection}>
            <Container>
                <div className={styles.content}>
                    <div className={styles.logoWrapper}>
                        <Picture src={logoImage} alt="CryFS Logo" width={120} height={90} />
                    </div>

                    <h1 className={styles.errorCode}>404</h1>
                    <h2 className={styles.errorTitle}>Page Not Found</h2>

                    <p className={styles.errorMessage}>
                        The page you&apos;re looking for doesn&apos;t exist or has been moved.
                    </p>

                    <div className={styles.primaryAction}>
                        <Link href="/" passHref legacyBehavior>
                            <Button as="a" variant="primary" size="lg" className={styles.homeButton}>
                                <FontAwesomeIcon icon={faHome} className="me-2" />
                                Back to Homepage
                            </Button>
                        </Link>
                    </div>

                    <div className={styles.divider}>
                        <span>or explore</span>
                    </div>

                    <Row className={styles.quickLinks}>
                        <Col xs={12} sm={4} className={styles.linkCol}>
                            <Link href="/tutorial" className={styles.quickLink}>
                                <FontAwesomeIcon icon={faBook} className={styles.linkIcon} />
                                <span>Tutorial</span>
                            </Link>
                        </Col>
                        <Col xs={12} sm={4} className={styles.linkCol}>
                            <Link href="/howitworks" className={styles.quickLink}>
                                <FontAwesomeIcon icon={faLock} className={styles.linkIcon} />
                                <span>How It Works</span>
                            </Link>
                        </Col>
                        <Col xs={12} sm={4} className={styles.linkCol}>
                            <Link href="/#download" className={styles.quickLink}>
                                <FontAwesomeIcon icon={faDownload} className={styles.linkIcon} />
                                <span>Download</span>
                            </Link>
                        </Col>
                    </Row>
                </div>
            </Container>
        </section>
    </Layout>
);

export default NotFoundPage;
