import React from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldHalved, faDownload, faBook } from '@fortawesome/free-solid-svg-icons';
import { logAnalyticsEvent } from '../Analytics';
import styles from './HeroSection.module.css';

const onDownloadButtonClick = () => {
    logAnalyticsEvent('buttons', 'click_download_button');
};

const onTutorialButtonClick = () => {
    logAnalyticsEvent('buttons', 'click_tutorial_button');
};

const HeroSection = () => (
    <section className={styles.hero}>
        <div className={styles.heroBackground}>
            <div className={styles.heroGradient}></div>
            <div className={styles.heroPattern}></div>
        </div>
        <Container className={styles.heroContainer}>
            <div className={styles.heroContent}>
                <div className={styles.heroIcon}>
                    <FontAwesomeIcon icon={faShieldHalved} />
                </div>
                <h1 className={styles.heroTitle}>
                    Encrypt Your Cloud Storage
                </h1>
                <p className={styles.heroSubtitle}>
                    Keep your files private, even from your cloud provider.
                    CryFS encrypts everything locally before it ever leaves your computer.
                </p>
                <div className={styles.heroCta}>
                    <Link href="/#download" passHref legacyBehavior>
                        <Button
                            as="a"
                            variant="light"
                            size="lg"
                            className={styles.primaryButton}
                            onClick={onDownloadButtonClick}
                        >
                            <FontAwesomeIcon icon={faDownload} className={styles.buttonIcon} />
                            Download CryFS
                        </Button>
                    </Link>
                    <Link href="/tutorial" passHref legacyBehavior>
                        <Button
                            as="a"
                            variant="outline-light"
                            size="lg"
                            className={styles.secondaryButton}
                            onClick={onTutorialButtonClick}
                        >
                            <FontAwesomeIcon icon={faBook} className={styles.buttonIcon} />
                            Get Started
                        </Button>
                    </Link>
                </div>
                <div className={styles.heroStats}>
                    <div className={styles.stat}>
                        <span className={styles.statValue}>100%</span>
                        <span className={styles.statLabel}>Client-side encryption</span>
                    </div>
                    <div className={styles.statDivider}></div>
                    <div className={styles.stat}>
                        <span className={styles.statValue}>Open Source</span>
                        <span className={styles.statLabel}>LGPL licensed</span>
                    </div>
                    <div className={styles.statDivider}></div>
                    <div className={styles.stat}>
                        <span className={styles.statValue}>Free</span>
                        <span className={styles.statLabel}>Forever</span>
                    </div>
                </div>
            </div>
        </Container>
    </section>
);

export default HeroSection;
