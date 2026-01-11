"use strict";

import Col from 'react-bootstrap/Col';
import Collapse from 'react-bootstrap/Collapse';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleDoubleRight} from "@fortawesome/free-solid-svg-icons";
import fetch from 'unfetch'
import AsyncButton from '../AsyncButton'
import {logAnalyticsEvent} from '../Analytics'
import React from 'react';
import styles from './ContactSection.module.css';

class ContactSection extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            notification: '',
            email: '',
            message: '',
        }
    }

    send = async () => {
        this.setState({
            notification: '',
        })

        await logAnalyticsEvent('contact_form', 'click')

        try {
            if (this.state.message == '') {
                await logAnalyticsEvent('contact_form', 'error')
                this.setState({
                    notification: 'error:empty',
                })
            } else {
                const response = await fetch('https://backend.cryfs.org/contact/send', {
                    method: 'POST',
                    header: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        email: this.state.email,
                        message: this.state.message,
                        token: 'fd0kAn1zns',
                    }),
                })

                if (response.ok) {
                    await logAnalyticsEvent('contact_form', 'success')
                    this.setState({
                        notification: 'success',
                    })
                } else {
                    await logAnalyticsEvent('contact_form', 'error')
                    this.setState({
                        notification: 'error',
                    })
                }
            }
        } catch (err) {
            this.setState({
                notification: 'error',
            })
        }
    }

    setEmail = (event) => {
        this.setState({email: event.target.value})
    }

    setMessage = (event) => {
        this.setState({message: event.target.value})
    }

    render = () => (
        <Container className="text-center">
            <h2>Contact Us</h2>
            <div className={styles.content}>
                <Col md={{span: 6, offset: 3}}>
                    <Form>
                        {/*TODO Translate*/}
                        <Row>
                            <Col md="12">
                                <Form.Group>
                                    <Form.Label htmlFor="contact_form_message" className="visually-hidden">Message:</Form.Label>
                                    <textarea id="contact_form_message" name="message" className="form-control"
                                              style={{height: '140px'}} required={true}
                                              placeholder="Your message to us. We're looking forward to your feedback, ideas and criticism. Please be blunt."
                                              value={this.state.message} onChange={this.setMessage}/>
                                </Form.Group>
                            </Col>
                            <Col md="8">
                                <Form.Group>
                                    <Form.Label htmlFor="contact_form_email" className="visually-hidden">Your Email:</Form.Label>
                                    <Form.Control type="email" name="email" id="contact_form_email"
                                           placeholder="Your email address (optional)" autoComplete="off"
                                           value={this.state.email} onChange={this.setEmail}/>
                                </Form.Group>
                            </Col>
                            <Col md={{span: 4, offset: 0}}>
                                <Form.Group>
                                    <AsyncButton type="Submit" onClick={this.send} variant="primary" block={true}>
                                        Send &nbsp;
                                        <FontAwesomeIcon icon={faAngleDoubleRight}/>
                                    </AsyncButton>
                                </Form.Group>
                            </Col>
                            <div className="clearfix"/>
                            <Col md="12">
                                <Collapse in={this.state.notification != ''}
                                          className={styles.notificationArea}>
                                    <div>
                                        <Collapse in={this.state.notification == 'success'}
                                                  className={`lead ${styles.notificationSuccess}`}>
                                            <div>Thank you.</div>
                                        </Collapse>
                                        <Collapse in={this.state.notification == 'error:empty'}
                                                  className={`lead ${styles.notificationError}`}>
                                            <div>Please enter a message to send.</div>
                                        </Collapse>
                                        <Collapse in={this.state.notification == 'error'}
                                                  className={`lead ${styles.notificationError}`}>
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
    )
}

export default ContactSection
