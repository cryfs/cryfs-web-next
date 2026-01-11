"use strict";

import Button from 'react-bootstrap/Button';
import Link from "next/link";
import { logAnalyticsEvent } from './Analytics'
import styles from './Teaser.module.css';

{/*TODO Translate*/ }
const teaser_header = "Keep your data safe in the cloud"
const teaser_paragraph1 = "CryFS encrypts your files, so you can safely store them anywhere. It works well together with cloud services like Dropbox, iCloud, OneDrive and others."

const onDownloadButtonClick = async () => {
    await logAnalyticsEvent('buttons', 'click_download_button')
}

const onTutorialButtonClick = async () => {
    await logAnalyticsEvent('buttons', 'click_tutorial_button')
}

const Teaser = () => (
    <>
        <section className={`${styles.mdTeaser} d-none d-lg-block`}>
            <div className="clearfix">
                <div className={styles.mdContent}>
                    <div className={styles.mdImage} />
                    <div className={`${styles.mdTitleText} lead text-center`}>
                        {/*TODO Translate*/}
                        <h1 className={styles.mdTitleTextH1}>{teaser_header}</h1>
                        <p className={styles.mdTitleTextP}>{teaser_paragraph1}</p>
                        <p className={styles.mdTitleTextP}>
                            <Link passHref href="/#download">
                                <Button variant="primary" size="lg" onClick={onDownloadButtonClick}>Download</Button>
                            </Link>
                            <Link passHref href="/tutorial">
                                <Button variant="info" size="lg" className={styles.tutorialButton} onClick={onTutorialButtonClick}>Tutorial</Button>
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
                        <img src={require('../assets/images/logo.png')} alt="Logo" width="200" height="150" />
                        <div className="lead text-center title-text">
                            <h1 className={styles.smTitleTextH1}>{teaser_header}</h1>
                            <p className={styles.smTitleTextP}>{teaser_paragraph1}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </>
)

export default Teaser