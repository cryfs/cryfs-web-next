import React, { useState, ChangeEvent } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Collapse from 'react-bootstrap/Collapse';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDoubleRight } from "@fortawesome/free-solid-svg-icons";
import AsyncButton from "../AsyncButton";
import { logAnalyticsEvent } from '../Analytics';
import styles from './NewsletterSection.module.css';

function NewsletterSection() {
    const [email, setEmail] = useState('');
    const [notification, setNotification] = useState('');

    const onEmailChange = (val: ChangeEvent<HTMLInputElement>) => {
        setEmail(val.target.value);
    };

    const onSubmit = async () => {
        setNotification('');

        logAnalyticsEvent('interested_user_form', 'click');

        try {
            const response = await fetch('https://backend.cryfs.org/newsletter/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: email,
                    token: '6BK2tEU6Cv',
                }),
            });

            if (response.ok) {
                logAnalyticsEvent('interested_user_form', 'success');
                setNotification('success');
            } else {
                logAnalyticsEvent('interested_user_form', 'error');
                const body = await response.json() as { error?: string };
                const reason = body.error;
                if (reason === 'invalid-email') {
                    setNotification('error_invalid_email');
                } else if (reason === 'unsubscribed') {
                    setNotification('error_unsubscribed');
                } else {
                    console.log(`Unknown error response: ${reason}`);
                    setNotification('error_unknown');
                }
            }
        } catch {
            setNotification('error_unknown');
        }
    };

    return (
        <Container className="text-center">
            {/*TODO Translate*/}
            <div className={styles.header}>
                <h2 className={styles.title}>Stay Updated</h2>
                <p className={styles.subtitle}>Get notified about new releases and security news</p>
            </div>
            <div className={styles.registrationBox}>
                <Form className="justify-content-center">
                    <Row className="justify-content-center">
                        <Col md={5} lg={4}>
                            <Form.Group>
                                <Form.Label htmlFor="inputEmail" className="visually-hidden">Email Address:</Form.Label>
                                <Form.Control type="email" name="email" id="inputEmail" placeholder="Enter your email address" required={true}
                                    autoComplete="off" value={email} onChange={onEmailChange} className={styles.emailInput ?? ''} />
                            </Form.Group>
                        </Col>
                        <Col md={3} lg={2}>
                            <Form.Group>
                                <AsyncButton type="submit" onClick={onSubmit} variant="primary" block={true} className={styles.submitButton ?? ''}>
                                    Subscribe &nbsp;
                                    <FontAwesomeIcon icon={faAngleDoubleRight} />
                                </AsyncButton>
                            </Form.Group>
                        </Col>
                    </Row>
                </Form>
                <Collapse in={notification !== ''} className={styles.notificationArea ?? ''}>
                    <div>
                        {/*TODO Translate*/}
                        <Collapse in={notification === 'success'} className={`lead ${styles.notificationSuccess ?? ''}`}>
                            <div>Thank you. You&apos;ll get a confirmation email shortly.</div>
                        </Collapse>
                        <Collapse in={notification === 'error_invalid_email'} className={`lead ${styles.notificationError ?? ''}`}>
                            <div>Invalid email address.</div>
                        </Collapse>
                        <Collapse in={notification === 'error_unsubscribed'} className={`lead ${styles.notificationError ?? ''}`}>
                            <div>You&apos;ve unsubscribed before and we can&apos;t resubscribe you to protect against spam. Please send an
                                email to messmer@cryfs.org.</div>
                        </Collapse>
                        <Collapse in={notification === 'error_unknown'} className={`lead ${styles.notificationError ?? ''}`}>
                            <div>An error occurred. Please subscribe by sending an email to messmer@cryfs.org.</div>
                        </Collapse>
                    </div>
                </Collapse>
            </div>
        </Container>
    );
}

export default NewsletterSection;
