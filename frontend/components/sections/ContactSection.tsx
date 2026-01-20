import React, { useState, ChangeEvent } from 'react';
import Col from 'react-bootstrap/Col';
import Collapse from 'react-bootstrap/Collapse';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDoubleRight } from "@fortawesome/free-solid-svg-icons";
import AsyncButton from '../AsyncButton';
import { logAnalyticsEvent } from '../Analytics';
import styles from './ContactSection.module.css';

function ContactSection() {
    const [notification, setNotification] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const send = async () => {
        setNotification('');

        logAnalyticsEvent('contact_form', 'click');

        try {
            if (message === '') {
                logAnalyticsEvent('contact_form', 'error');
                setNotification('error:empty');
            } else {
                const response = await fetch('https://backend.cryfs.org/contact/send', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: email,
                        message: message,
                        token: '6BK2tEU6Cv',
                    }),
                });

                if (response.ok) {
                    logAnalyticsEvent('contact_form', 'success');
                    setNotification('success');
                } else {
                    logAnalyticsEvent('contact_form', 'error');
                    setNotification('error');
                }
            }
        } catch {
            setNotification('error');
        }
    };

    const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };

    const handleMessageChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(event.target.value);
    };

    return (
        <Container className="text-center">
            <div className={styles.header}>
                <h2 className={styles.title}>Contact Us</h2>
                <p className={styles.subtitle}>We&apos;d love to hear from you. Questions, feedback, or ideas are all welcome.</p>
            </div>
            <div className={styles.content}>
                <Row className="justify-content-center">
                    <Col md={8} lg={6}>
                        <Form>
                            {/*TODO Translate*/}
                            <Form.Group className={styles.formGroup}>
                                <Form.Label htmlFor="contact_form_message" className="visually-hidden">Message:</Form.Label>
                                <textarea id="contact_form_message" name="message" className={`form-control ${styles.textarea ?? ''}`}
                                    required={true}
                                    placeholder="Your message to us. We're looking forward to your feedback, ideas and criticism. Please be blunt."
                                    value={message} onChange={handleMessageChange} />
                            </Form.Group>
                            <Row>
                                <Col md={8}>
                                    <Form.Group className={styles.formGroup}>
                                        <Form.Label htmlFor="contact_form_email" className="visually-hidden">Your Email:</Form.Label>
                                        <Form.Control type="email" name="email" id="contact_form_email"
                                            placeholder="Your email address (optional)" autoComplete="off"
                                            value={email} onChange={handleEmailChange} className={styles.emailInput ?? ''} />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group className={styles.formGroup}>
                                        <AsyncButton type="submit" onClick={send} variant="primary" block={true} className={styles.submitButton ?? ''}>
                                            Send &nbsp;
                                            <FontAwesomeIcon icon={faAngleDoubleRight} />
                                        </AsyncButton>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Collapse in={notification !== ''}
                                className={styles.notificationArea ?? ''}>
                                <div>
                                    <Collapse in={notification === 'success'}
                                        className={`lead ${styles.notificationSuccess ?? ''}`}>
                                        <div>Thank you for your message!</div>
                                    </Collapse>
                                    <Collapse in={notification === 'error:empty'}
                                        className={`lead ${styles.notificationError ?? ''}`}>
                                        <div>Please enter a message to send.</div>
                                    </Collapse>
                                    <Collapse in={notification === 'error'}
                                        className={`lead ${styles.notificationError ?? ''}`}>
                                        <div>Sorry, there was an error sending your message.</div>
                                    </Collapse>
                                </div>
                            </Collapse>
                        </Form>
                    </Col>
                </Row>
            </div>
        </Container>
    );
}

export default ContactSection;
