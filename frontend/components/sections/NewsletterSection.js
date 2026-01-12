"use strict";

import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Collapse from 'react-bootstrap/Collapse';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDoubleRight } from "@fortawesome/free-solid-svg-icons";
import fetch from 'unfetch'
import AsyncButton from "../AsyncButton";
import { logAnalyticsEvent } from '../Analytics'
import React, { useState } from 'react';
import styles from './NewsletterSection.module.css';

function NewsletterSection() {
    const [email, setEmail] = useState('');
    const [notification, setNotification] = useState('');

    const onEmailChange = (val) => {
        setEmail(val.target.value);
    };

    const onSubmit = async () => {
        setNotification('');

        await logAnalyticsEvent('interested_user_form', 'click');

        try {
            const response = await fetch('https://backend.cryfs.org/newsletter/register', {
                method: 'POST',
                header: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: email,
                    token: 'fd0kAn1zns',
                }),
            });

            if (response.ok) {
                await logAnalyticsEvent('interested_user_form', 'success');
                setNotification('success');
            } else {
                await logAnalyticsEvent('interested_user_form', 'error');
                const body = await response.json();
                const reason = body['error'];
                if (reason === 'invalid-email') {
                    setNotification('error_invalid_email');
                } else if (reason === 'unsubscribed') {
                    setNotification('error_unsubscribed');
                } else {
                    console.log(`Unknown error response: ${reason}`);
                    setNotification('error_unknown');
                }
            }
        } catch (err) {
            setNotification('error_unknown');
        }
    };

    return (
        <Container className="text-center">
            {/*TODO Translate*/}
            <h2>Get notified when there are updates!</h2>
            <div className={styles.registrationBox}>
                <Form className="justify-content-center">
                    <Row>
                        <Col md={{ span: 4, offset: 3 }}>
                            <Form.Group>
                                <Form.Label htmlFor="inputEmail" className="visually-hidden">Email Address:</Form.Label>
                                <Form.Control type="email" name="email" id="inputEmail" placeholder="Enter email" required={true}
                                    autoComplete="off" value={email} onChange={onEmailChange} />
                            </Form.Group>
                        </Col>
                        <Col md={{ span: 2, offset: 0 }}>
                            <Form.Group>
                                <AsyncButton type="Submit" onClick={onSubmit} variant="primary" block={true}>
                                    Get Notified &nbsp;
                                    <FontAwesomeIcon icon={faAngleDoubleRight} />
                                </AsyncButton>
                            </Form.Group>
                        </Col>
                    </Row>
                </Form>
                <Collapse in={notification !== ''} className={styles.notificationArea}>
                    <div>
                        {/*TODO Translate*/}
                        <Collapse in={notification === 'success'} className={`lead ${styles.notificationSuccess}`}>
                            <div>Thank you. You&apos;ll get a confirmation email shortly.</div>
                        </Collapse>
                        <Collapse in={notification === 'error_invalid_email'} className={`lead ${styles.notificationError}`}>
                            <div>Invalid email address.</div>
                        </Collapse>
                        <Collapse in={notification === 'error_unsubscribed'} className={`lead ${styles.notificationError}`}>
                            <div>You&apos;ve unsubscribed before and we can&apos;t resubscribe you to protect against spam. Please send an
                            email to messmer@cryfs.org.</div>
                        </Collapse>
                        <Collapse in={notification === 'error_unknown'} className={`lead ${styles.notificationError}`}>
                            <div>An error occurred. Please subscribe by sending an email to messmer@cryfs.org.</div>
                        </Collapse>
                    </div>
                </Collapse>
            </div>
        </Container>
    );
}

export default NewsletterSection
