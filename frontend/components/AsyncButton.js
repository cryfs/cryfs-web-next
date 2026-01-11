"use strict";

import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSpinner} from "@fortawesome/free-solid-svg-icons";
import React from 'react';

// A button that has a onClick handler attached which potentially takes a bit more time.
// The button will disable itself and show a progress spinner while running the onClick handler.
class AsyncButton extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            running: false,
        }

        const {onClick, block, className, ...forwardProps} = props
        this.onClick = onClick
        // In React Bootstrap 2.x, block prop is removed. Use w-100 class instead.
        this.className = block ? `w-100 ${className || ''}`.trim() : className
        this.forwardProps = forwardProps
    }

    clickHandler = async (event) => {
        event.preventDefault()

        if (this.state.running) {
            // Already running. Somehow it got triggered twice. Ignore it.
            console.log("Button onClick handler already running. Ignore second trigger.")
            return
        }

        this.setState({
            running: true,
        })

        try {
            await this.props.onClick(event)
        } finally {
            this.setState({
                running: false,
            })
        }
    }

    render = () => (
        <Button onClick={this.clickHandler} disabled={this.state.running} className={this.className} {...this.forwardProps}>
            <Collapse in={!this.state.running}>
                <span>{this.props.children}</span>
            </Collapse>
            <Collapse in={this.state.running}>
                <span><FontAwesomeIcon icon={faSpinner} className="fa-pulse" /></span>
            </Collapse>
        </Button>
    )
}

export default AsyncButton
