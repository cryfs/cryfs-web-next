"use strict";

import { withRouter } from "next/dist/client/router";
import Url from "url-parse";
import { Modal, ModalHeader, ModalFooter, Button } from "reactstrap";
import { RoutingListener } from '../RoutingListener'
import React from 'react';

class RouteHashBasedModal extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            show: new Url(props.router.asPath).hash == this.props.hash
        }

        this.routingListener = new RoutingListener(props.router.asPath)
        this.routingListener.addListener(this.onRouteChangeComplete)
    }

    toggle = () => {
        // When we're supposed to toggle it, we just change the URL.
        // The routing listener will then trigger onRouteChangeComplete,
        // which will take care of the actual showing/hiding of the modal.
        if (this.state.show) {
            const url = new Url(this.routingListener.url)
            url.set('hash', '')
            const newUrl = url.toString()
            this.props.router.replace(newUrl)
        } else {
            const url = new Url(this.routingListener.url)
            url.set('hash', this.props.hash)
            const newUrl = url.toString()
            this.props.router.replace(newUrl)
        }
    }

    onRouteChangeComplete = (url) => {
        const url_ = new Url(url)
        this.setState({
            show: url_.hash == this.props.hash,
        })
    }

    componentWillUnmount = () => {
        this.routingListener.finish()
    }

    render = () => {
        let { labelledBy, header, showCloseButtonInFooter, ...forwardProps } = this.props

        return <Modal isOpen={this.state.show} toggle={this.toggle} {...forwardProps}>
            {(typeof this.props.header != 'undefined') &&
                <ModalHeader id={labelledBy} toggle={this.toggle}>
                    {header}
                </ModalHeader>
            }
            {this.props.children}
            {(showCloseButtonInFooter) &&
                <ModalFooter>
                    <Button outline color="secondary" onClick={this.toggle}>Close</Button>
                </ModalFooter>
            }
        </Modal>
    }
}

const RouteHashBasedModalWithRouter = withRouter(RouteHashBasedModal)

export default RouteHashBasedModalWithRouter
