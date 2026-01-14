import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldHalved, faCheckCircle, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import styles from './SecuritySection.module.css';

const securityFeatures = [
    'Formally verified security with published proofs',
    'AES-256-GCM authenticated encryption',
    'Zero-knowledge architecture',
    'No data leaves your device unencrypted',
    'Open source for full transparency',
    'Regular security audits and updates',
];

const SecuritySection = () => (
    <section className={styles.section}>
        <Container>
            <Row className="align-items-center">
                <Col lg="6" className={styles.contentCol}>
                    <div className={styles.content}>
                        <div className={styles.badge}>
                            <FontAwesomeIcon icon={faShieldHalved} />
                            <span>Security First</span>
                        </div>
                        <h2 className={styles.title}>Built for Security, Not Just Privacy</h2>
                        <p className={styles.description}>
                            CryFS was developed as part of a Master&apos;s thesis in computer science,
                            with formal security proofs. It&apos;s not just another encryption tool —
                            it&apos;s designed from the ground up to protect your data against real-world threats.
                        </p>
                        <ul className={styles.featureList}>
                            {securityFeatures.map((feature) => (
                                <li key={feature} className={styles.featureItem}>
                                    <FontAwesomeIcon icon={faCheckCircle} className={styles.checkIcon} />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                        <div className={styles.cta}>
                            <Link href="/comparison" passHref legacyBehavior>
                                <Button as="a" variant="primary" className={styles.compareButton}>
                                    Compare with Alternatives
                                    <FontAwesomeIcon icon={faArrowRight} className={styles.buttonIcon} />
                                </Button>
                            </Link>
                            <Button
                                variant="outline-secondary"
                                href="https://github.com/cryfs/cryfs"
                                className={styles.githubButton}
                            >
                                <FontAwesomeIcon icon={faGithub} className={styles.githubIcon} />
                                View on GitHub
                            </Button>
                        </div>
                    </div>
                </Col>
                <Col lg="6" className={styles.visualCol}>
                    <div className={styles.visual}>
                        <div className={styles.visualCard}>
                            <div className={styles.visualIcon}>
                                <FontAwesomeIcon icon={faShieldHalved} />
                            </div>
                            <div className={styles.visualTitle}>Zero-Knowledge Architecture</div>
                            <div className={styles.visualDescription}>
                                Your cloud provider never sees your decryption keys or unencrypted data.
                                Even if they&apos;re compromised, your files remain secure.
                            </div>
                            <div className={styles.visualDiagram}>
                                <div className={styles.diagramBox}>
                                    <span className={styles.diagramLabel}>Your Computer</span>
                                    <span className={styles.diagramSublabel}>Encryption happens here</span>
                                </div>
                                <div className={styles.diagramArrow}>
                                    <span className={styles.diagramArrowLabel}>Encrypted</span>
                                </div>
                                <div className={styles.diagramBox}>
                                    <span className={styles.diagramLabel}>Cloud Storage</span>
                                    <span className={styles.diagramSublabel}>Sees only encrypted blocks</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    </section>
);

export default SecuritySection;
