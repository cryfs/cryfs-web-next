import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faLock,
    faFolderTree,
    faCubes,
    faFingerprint,
    faGaugeHigh,
    faCode,
} from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import styles from './FeaturesSection.module.css';

interface Feature {
    icon: IconDefinition;
    title: string;
    description: string;
}

const features: Feature[] = [
    {
        icon: faLock,
        title: 'Complete Encryption',
        description: 'File contents, metadata, filenames, and folder structure are all encrypted. Nothing readable leaves your device.',
    },
    {
        icon: faFolderTree,
        title: 'Hidden Directory Structure',
        description: 'Unlike other tools, CryFS hides your folder hierarchy. Attackers cannot see how your files are organized.',
    },
    {
        icon: faCubes,
        title: 'Block-Based Storage',
        description: 'Files are split into encrypted blocks, hiding file sizes. Large files sync efficiently with incremental updates.',
    },
    {
        icon: faFingerprint,
        title: 'Authenticated Encryption',
        description: 'Using AES-256-GCM, your data is protected from tampering. Any unauthorized changes are detected immediately.',
    },
    {
        icon: faGaugeHigh,
        title: 'High Performance',
        description: 'Optimized for speed with minimal overhead. Work with your encrypted files as smoothly as regular files.',
    },
    {
        icon: faCode,
        title: 'Open Source',
        description: 'Fully open source under LGPL. Review the code, verify the security, and contribute improvements on GitHub.',
    },
];

const FeaturesSection = () => (
    <section className={styles.section}>
        <Container>
            <div className={styles.header}>
                <h2 className={styles.title}>Why Choose CryFS</h2>
                <p className={styles.subtitle}>
                    Purpose-built for cloud storage encryption with security features other tools lack.
                </p>
            </div>

            <Row className={styles.featuresGrid}>
                {features.map((feature) => (
                    <Col lg="4" md="6" key={feature.title} className={styles.featureCol}>
                        <div className={styles.feature}>
                            <div className={styles.iconWrapper}>
                                <FontAwesomeIcon icon={feature.icon} className={styles.icon} />
                            </div>
                            <h3 className={styles.featureTitle}>{feature.title}</h3>
                            <p className={styles.featureDescription}>{feature.description}</p>
                        </div>
                    </Col>
                ))}
            </Row>
        </Container>
    </section>
);

export default FeaturesSection;
