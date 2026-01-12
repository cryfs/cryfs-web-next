import Button from 'react-bootstrap/Button';
import type { ButtonVariant } from 'react-bootstrap/types';
import Collapse from 'react-bootstrap/Collapse';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import React, { useState } from 'react';

interface AsyncButtonProps {
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
    block?: boolean;
    children?: React.ReactNode;
    className?: string;
    type?: 'button' | 'submit' | 'reset';
    variant?: ButtonVariant;
}

// A button that has a onClick handler attached which potentially takes a bit more time.
// The button will disable itself and show a progress spinner while running the onClick handler.
function AsyncButton({ onClick, block, className, children, type, variant }: AsyncButtonProps): React.ReactElement {
    const [running, setRunning] = useState(false);

    // In React Bootstrap 2.x, block prop is removed. Use w-100 class instead.
    const buttonClassName = block ? `w-100 ${className ?? ''}`.trim() : (className ?? '');

    const clickHandler = async (event: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
        event.preventDefault();

        if (running) {
            // Already running. Somehow it got triggered twice. Ignore it.
            console.log("Button onClick handler already running. Ignore second trigger.");
            return;
        }

        setRunning(true);

        try {
            await onClick(event);
        } finally {
            setRunning(false);
        }
    };

    return (
        <Button
            onClick={clickHandler}
            disabled={running}
            className={buttonClassName}
            {...(type ? { type } : {})}
            {...(variant ? { variant } : {})}
        >
            <Collapse in={!running}>
                <span>{children}</span>
            </Collapse>
            <Collapse in={running}>
                <span><FontAwesomeIcon icon={faSpinner} className="fa-pulse" /></span>
            </Collapse>
        </Button>
    );
}

export default AsyncButton;
