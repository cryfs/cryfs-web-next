import React from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faHeart } from '@fortawesome/free-solid-svg-icons';
import { logAnalyticsEvent } from '../Analytics';
import styles from './CtaSection.module.css';

const onDownloadButtonClick = () => {
    logAnalyticsEvent('buttons', 'click_download_cta');
};

const onDonateButtonClick = () => {
    logAnalyticsEvent('buttons', 'click_donate_cta');
};

const CtaSection = () => (
    <section className={styles.section}>
        <Container>
            <div className={styles.content}>
                <h2 className={styles.title}>Ready to Secure Your Files?</h2>
                <p className={styles.description}>
                    Download CryFS today and take control of your cloud storage privacy.
                    Free, open source, and trusted by privacy-conscious users worldwide.
                </p>
                <div className={styles.buttons}>
                    <Link href="/#download" passHref legacyBehavior>
                        <Button
                            as="a"
                            variant="light"
                            size="lg"
                            className={styles.downloadButton}
                            onClick={onDownloadButtonClick}
                        >
                            <FontAwesomeIcon icon={faDownload} className={styles.buttonIcon} />
                            Download CryFS
                        </Button>
                    </Link>
                    <Link href="/#donate" passHref legacyBehavior>
                        <Button
                            as="a"
                            variant="outline-light"
                            size="lg"
                            className={styles.donateButton}
                            onClick={onDonateButtonClick}
                        >
                            <FontAwesomeIcon icon={faHeart} className={styles.buttonIcon} />
                            Support the Project
                        </Button>
                    </Link>
                </div>
            </div>
        </Container>
    </section>
);

export default CtaSection;
