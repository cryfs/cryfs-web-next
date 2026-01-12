import React from 'react';
import Picture from 'next-export-optimize-images/picture';
import Button from 'react-bootstrap/Button';
import Link from "next/link";
import { logAnalyticsEvent } from './Analytics';
import styles from './Teaser.module.css';
import teaserImage from '../assets/images/teaser.jpg';
import logoImage from '../assets/images/logo.png';

{/*TODO Translate*/ }
const teaser_header = "Keep your data safe in the cloud";
const teaser_paragraph1 = "CryFS encrypts your files, so you can safely store them anywhere. It works well together with cloud services like Dropbox, iCloud, OneDrive and others.";

const onDownloadButtonClick = () => {
    logAnalyticsEvent('buttons', 'click_download_button');
};

const onTutorialButtonClick = () => {
    logAnalyticsEvent('buttons', 'click_tutorial_button');
};

const Teaser = () => (
    <>
        <section className={`${styles.mdTeaser} d-none d-lg-block`}>
            <div className="clearfix">
                <div className={styles.mdContent}>
                    <div className={styles.mdImage}>
                        {/* TODO: priority causes double image download (WebP + JPG) due to preload bug
                            https://github.com/dc7290/next-export-optimize-images/issues/1285 */}
                        <Picture
                            src={teaserImage}
                            alt=""
                            fill
                            sizes="2013px"
                            style={{ objectFit: 'cover', objectPosition: 'left top' }}
                            priority
                        />
                    </div>
                    <div className={`${styles.mdTitleText} lead text-center`}>
                        {/*TODO Translate*/}
                        <h1 className={styles.mdTitleTextH1}>{teaser_header}</h1>
                        <p className={styles.mdTitleTextP}>{teaser_paragraph1}</p>
                        <p className={styles.mdTitleTextP}>
                            <Link href="/#download" passHref legacyBehavior>
                                <Button as="a" variant="primary" size="lg" onClick={onDownloadButtonClick}>Download</Button>
                            </Link>
                            <Link href="/tutorial" passHref legacyBehavior>
                                <Button as="a" variant="info" size="lg" className={styles.tutorialButton} onClick={onTutorialButtonClick}>Tutorial</Button>
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </section>
        <section className={`${styles.smTeaser} d-block d-lg-none`}>
            <div className="clearfix">
                <div className={styles.smContent}>
                    <div className={`${styles.smImage} text-center`}>
                        <Picture src={logoImage} alt="Logo" width={200} height={150} />
                        <div className="lead text-center title-text">
                            <h1 className={styles.smTitleTextH1}>{teaser_header}</h1>
                            <p className={styles.smTitleTextP}>{teaser_paragraph1}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </>
);

export default Teaser;
