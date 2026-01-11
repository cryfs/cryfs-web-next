"use strict";

import { css, StyleSheet } from "aphrodite";
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
import React from 'react';

const style = StyleSheet.create({
    notificationArea: {
        marginTop: '30px',
    },
    notification_success: {
        color: 'green',
        marginTop: '10px',
        marginBottom: '10px',
    },
    notification_error: {
        color: 'red',
        marginTop: '10px',
        marginBottom: '10px',
    },
    notification_spinner: {
        color: '#909090',
        marginTop: '10px',
        marginBottom: '10px',
    },
    registrationBox: {
        textAlign: 'center',
        marginTop: '20px',
    },
})

class NewsletterSection extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            email: '',
        }
    }

    onEmailChange = (val) => {
        this.setState({
            email: val.target.value,
        })
    }

    onSubmit = async () => {
        this.setState({
            notification: '',
        })

        await logAnalyticsEvent('interested_user_form', 'click')

        try {
            const response = await fetch('https://backend.cryfs.org/newsletter/register', {
                method: 'POST',
                header: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: this.state.email,
                    token: 'fd0kAn1zns',
                }),
            })

            if (response.ok) {
                await logAnalyticsEvent('interested_user_form', 'success')
                this.setState({
                    notification: 'success',
                })
            } else {
                await logAnalyticsEvent('interested_user_form', 'error')
                const body = await response.json()
                const reason = body['error']
                if (reason === 'invalid-email') {
                    this.setState({
                        notification: 'error_invalid_email',
                    })
                } else if (reason === 'unsubscribed') {
                    this.setState({
                        notification: 'error_unsubscribed',
                    })
                } else {
                    console.log(`Unknown error response: ${reason}`)
                    this.setState({
                        notification: 'error_unknown',
                    })
                }
            }
        } catch (err) {
            this.setState({
                notification: 'error_unknown',
            })
        }
    }

    render = () => {
        return <Container className="text-center">
            {/*TODO Translate*/}
            <h2>Get notified when there are updates!</h2>
            <div className={css(style.registrationBox)}>
                <Form className="justify-content-center">
                    <Row>
                        <Col md={{ span: 4, offset: 3 }}>
                            <Form.Group>
                                <Form.Label htmlFor="inputEmail" className="visually-hidden">Email Address:</Form.Label>
                                <Form.Control type="email" name="email" id="inputEmail" placeholder="Enter email" required={true}
                                    autoComplete="off" value={this.state.email} onChange={this.onEmailChange} />
                            </Form.Group>
                        </Col>
                        <Col md={{ span: 2, offset: 0 }}>
                            <Form.Group>
                                <AsyncButton type="Submit" onClick={this.onSubmit} variant="primary" block={true}>
                                    Get Notified &nbsp;
                                    <FontAwesomeIcon icon={faAngleDoubleRight} />
                                </AsyncButton>
                            </Form.Group>
                        </Col>
                    </Row>
                </Form>
                <Collapse in={this.state.notification != ''} className={css(style.notificationArea)}>
                    <div>
                        {/*TODO Translate*/}
                        <Collapse in={this.state.notification == 'success'} className={`lead ${css(style.notification_success)}`}>
                            <div>Thank you. You&apos;ll get a confirmation email shortly.</div>
                        </Collapse>
                        <Collapse in={this.state.notification == 'error_invalid_email'} className={`lead ${css(style.notification_error)}`}>
                            <div>Invalid email address.</div>
                        </Collapse>
                        <Collapse in={this.state.notification == 'error_unsubscribed'} className={`lead ${css(style.notification_error)}`}>
                            <div>You&apos;ve unsubscribed before and we can&apos;t resubscribe you to protect against spam. Please send an
                            email to messmer@cryfs.org.</div>
                        </Collapse>
                        <Collapse in={this.state.notification == 'error_unknown'} className={`lead ${css(style.notification_error)}`}>
                            <div>An error occurred. Please subscribe by sending an email to messmer@cryfs.org.</div>
                        </Collapse>
                    </div>
                </Collapse>
            </div>
        </Container>
    }
}

export default NewsletterSection
