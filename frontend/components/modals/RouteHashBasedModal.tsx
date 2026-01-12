import { useRouter } from "next/router";
import Url from "url-parse";
import Modal, { ModalProps } from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { RoutingListener } from '../RoutingListener';
import React, { useState, useEffect, useRef, useCallback } from 'react';

interface RouteHashBasedModalProps extends Omit<ModalProps, 'show' | 'onHide'> {
    hash: string;
    labelledBy?: string;
    header?: string;
    showCloseButtonInFooter?: boolean;
    children?: React.ReactNode;
}

function RouteHashBasedModal({ hash, labelledBy, header, showCloseButtonInFooter, children, ...forwardProps }: RouteHashBasedModalProps) {
    const router = useRouter();
    const [show, setShow] = useState(() => new Url(router.asPath).hash === hash);
    const routingListenerRef = useRef<RoutingListener | null>(null);
    const currentUrlRef = useRef(router.asPath);

    const toggle = useCallback(() => {
        // When we're supposed to toggle it, we just change the URL.
        // The routing listener will then trigger onRouteChangeComplete,
        // which will take care of the actual showing/hiding of the modal.
        const currentShow = new Url(currentUrlRef.current).hash === hash;
        if (currentShow) {
            const url = new Url(currentUrlRef.current);
            url.set('hash', '');
            const newUrl = url.toString();
            router.replace(newUrl);
        } else {
            const url = new Url(currentUrlRef.current);
            url.set('hash', hash);
            const newUrl = url.toString();
            router.replace(newUrl);
        }
    }, [hash, router]);

    useEffect(() => {
        const onRouteChangeComplete = (url: string) => {
            currentUrlRef.current = url;
            const url_ = new Url(url);
            setShow(url_.hash === hash);
        };

        routingListenerRef.current = new RoutingListener(router.asPath);
        routingListenerRef.current.addListener(onRouteChangeComplete);

        return () => {
            if (routingListenerRef.current) {
                routingListenerRef.current.finish();
            }
        };
    }, [hash, router.asPath]);

    return (
        <Modal show={show} onHide={toggle} {...forwardProps}>
            {header !== undefined &&
                <Modal.Header id={labelledBy} closeButton>
                    <Modal.Title>{header}</Modal.Title>
                </Modal.Header>
            }
            {children}
            {showCloseButtonInFooter &&
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={toggle}>Close</Button>
                </Modal.Footer>
            }
        </Modal>
    );
}

export default RouteHashBasedModal;
