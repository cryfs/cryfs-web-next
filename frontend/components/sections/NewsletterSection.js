"use strict";

import { css, StyleSheet } from "aphrodite";
import { Col, Collapse, Container, Form, FormGroup, Input, Label } from "reactstrap";
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
            <h2>Let us notify you when CryFS is stable!</h2>
            <div className={css(style.registrationBox)}>
                <Form inline className="justify-content-center">
                    <FormGroup>
                        <Label for="inputEmail" className="sr-only">Email Address:</Label>
                        <Input type="email" name="email" id="inputEmail" placeholder="Enter email" required={true}
                            autoComplete="off" value={this.state.email} onChange={this.onEmailChange} />
                    </FormGroup>
                    <Col md={{ size: '2', offset: 0 }}>
                        <FormGroup>
                            <AsyncButton type="Submit" onClick={this.onSubmit} color="primary" block={true}>
                                Get Notified &nbsp;
                                <FontAwesomeIcon icon={faAngleDoubleRight} />
                            </AsyncButton>
                        </FormGroup>
                    </Col>
                </Form>
                <Collapse isOpen={this.state.notification != ''} className={css(style.notificationArea)}>
                    {/*TODO Translate*/}
                    <Collapse isOpen={this.state.notification == 'success'} className={`lead ${css(style.notification_success)}`}>
                        Thank you. You&apos;ll get a confirmation email shortly.
                    </Collapse>
                    <Collapse isOpen={this.state.notification == 'error_invalid_email'} className={`lead ${css(style.notification_error)}`}>
                        Invalid email address.
                    </Collapse>
                    <Collapse isOpen={this.state.notification == 'error_unsubscribed'} className={`lead ${css(style.notification_error)}`}>
                        You&apos;ve unsubscribed before and we can&apos;t resubscribe you to protect against spam. Please send an
                        email to messmer@cryfs.org.
                    </Collapse>
                    <Collapse isOpen={this.state.notification == 'error_unknown'} className={`lead ${css(style.notification_error)}`}>
                        An error occurred. Please subscribe by sending an email to messmer@cryfs.org.
                    </Collapse>
                </Collapse>
            </div>
        </Container>
    }
}

export default NewsletterSection
