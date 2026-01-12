import React from 'react';
import Modal from 'react-bootstrap/Modal';
import RouteHashBasedModal from './RouteHashBasedModal';
import Script from 'next/script';
import styles from './Donate.module.css';

const DonateModal = () => (
    <RouteHashBasedModal hash="#donate" labelledBy="donateModalTitle" className={styles.dialog}>
        <Script src="https://donorbox.org/widget.js" type="text/javascript" />
        <Modal.Body>
            <div className="text-center">
                <iframe
                    className={styles.iframe}
                    src="https://donorbox.org/embed/cryfs?amount=25&recurring=true&show_content=true"
                    seamless={true}
                    name="donorbox"
                    frameBorder="0"
                    scrolling="no"
                    allowFullScreen
                />
            </div>
        </Modal.Body>
    </RouteHashBasedModal>
);

export default DonateModal;
