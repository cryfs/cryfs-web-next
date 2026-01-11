"use strict";

import React from 'react';
import Modal from 'react-bootstrap/Modal';
import { StyleSheet, css } from 'aphrodite/no-important'
import RouteHashBasedModal from './RouteHashBasedModal'
import Script from 'next/script'

const style = StyleSheet.create({
    dialog: {
        width: 'auto',
        display: 'table',
        backgroundColor: 'white',
    },
    iframe: {
        height: '685px',
        width: 'auto',
        maxWidth: '500px',
        minWidth: '375px',
        '@media (min-width: 768px)': {
            minWidth: '375px',
        },
        '@media (max-width: 768px)': {
            minWidth: '310px',
        },
        maxHeight: 'none!important',
    }
})

const DonateModal = () => (
    <RouteHashBasedModal hash="#donate" labelledBy="donateModalTitle" className={css(style.dialog)}>
        <Script src="https://donorbox.org/widget.js" type="text/javascript" />
        <Modal.Body>
            <div className="text-center">
                <iframe
                    className={css(style.iframe)}
                    src="https://donorbox.org/embed/cryfs?amount=25&recurring=true&show_content=true"
                    seamless="seamless"
                    name="donorbox"
                    frameBorder="0"
                    scrolling="no"
                    allowpaymentrequest="allowpaymentrequest"
                />
            </div>
        </Modal.Body>
    </RouteHashBasedModal>
)

export default DonateModal
