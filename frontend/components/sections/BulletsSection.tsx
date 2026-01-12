import React from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { faAngleDoubleRight, faComments, faLightbulb, faLock, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import styles from './BulletsSection.module.css';

interface BulletPointProps {
    icon: IconDefinition;
    title: string;
    details_link_target: string;
    external_link?: boolean;
    children?: React.ReactNode;
}

const BulletPoint = ({ icon, title, details_link_target, external_link, children }: BulletPointProps) => (
    <Col lg="4">
        <div className="text-center">
            <FontAwesomeIcon icon={icon} className={styles.icon} />
            <h2 className={styles.title}>{title}</h2>
            {children}
            <p>
                {!external_link ?
                    <Link href={details_link_target} passHref legacyBehavior>
                        <Button as="a" variant="outline-secondary">
                            {/*TODO Translate*/}
                            Details &nbsp;
                            <FontAwesomeIcon icon={faAngleDoubleRight} />
                        </Button>
                    </Link> :
                    <Button variant="outline-secondary" href={details_link_target}>
                        {/*TODO Translate*/}
                        Details &nbsp;
                        <FontAwesomeIcon icon={faAngleDoubleRight} />
                    </Button>
                }
            </p>
        </div>
    </Col>
);

const BulletsSection = () => (
    <Container>
        <Row>
            {/*TODO Translate*/}
            <BulletPoint title="Simple" icon={faLightbulb} details_link_target="/tutorial">
                <p>Set up in minutes and forget about it. CryFS runs silently in the background while you work with your files normally — no workflow changes needed.</p>
            </BulletPoint>
            <BulletPoint title="Secure" icon={faLock} details_link_target="/howitworks">
                <p>Nothing leaves your computer unencrypted. File contents, metadata, and folder structure are all protected — even if your cloud provider is breached.</p>
            </BulletPoint>
            <BulletPoint title="Free & Open Source" icon={faComments} details_link_target="http://www.gnu.org/philosophy/free-sw.html" external_link={true} >
                <p>Licensed under LGPL and fully <a href="https://github.com/cryfs/cryfs">open source on GitHub</a>. Inspect the code yourself, contribute improvements, or simply use it for free — forever.</p>
            </BulletPoint>
        </Row>
    </Container>
);

export default BulletsSection;
