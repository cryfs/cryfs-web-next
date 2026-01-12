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
                        token: 'fd0kAn1zns',
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
            <h2>Contact Us</h2>
            <div className={styles.content}>
                <Col md={{ span: 6, offset: 3 }}>
                    <Form>
                        {/*TODO Translate*/}
                        <Row>
                            <Col md="12">
                                <Form.Group>
                                    <Form.Label htmlFor="contact_form_message" className="visually-hidden">Message:</Form.Label>
                                    <textarea id="contact_form_message" name="message" className="form-control"
                                        style={{ height: '140px' }} required={true}
                                        placeholder="Your message to us. We're looking forward to your feedback, ideas and criticism. Please be blunt."
                                        value={message} onChange={handleMessageChange} />
                                </Form.Group>
                            </Col>
                            <Col md="8">
                                <Form.Group>
                                    <Form.Label htmlFor="contact_form_email" className="visually-hidden">Your Email:</Form.Label>
                                    <Form.Control type="email" name="email" id="contact_form_email"
                                        placeholder="Your email address (optional)" autoComplete="off"
                                        value={email} onChange={handleEmailChange} />
                                </Form.Group>
                            </Col>
                            <Col md={{ span: 4, offset: 0 }}>
                                <Form.Group>
                                    <AsyncButton type="submit" onClick={send} variant="primary" block={true}>
                                        Send &nbsp;
                                        <FontAwesomeIcon icon={faAngleDoubleRight} />
                                    </AsyncButton>
                                </Form.Group>
                            </Col>
                            <div className="clearfix" />
                            <Col md="12">
                                <Collapse in={notification !== ''}
                                    className={styles.notificationArea ?? ''}>
                                    <div>
                                        <Collapse in={notification === 'success'}
                                            className={`lead ${styles.notificationSuccess ?? ''}`}>
                                            <div>Thank you.</div>
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
                            </Col>
                        </Row>
                    </Form>
                </Col>
            </div>
        </Container>
    );
}

export default ContactSection;
