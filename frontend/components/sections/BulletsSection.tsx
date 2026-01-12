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
                <p>Easy to setup and works with a lot of cloud storage providers. It runs in the background - you won&apos;t notice it when accessing your files in your daily workflow.</p>
            </BulletPoint>
            <BulletPoint title="Secure" icon={faLock} details_link_target="/howitworks">
                <p>Your data only leaves your computer in encrypted form. File contents, metadata and directory structure are all secure from someone who hacked your cloud.</p>
            </BulletPoint>
            <BulletPoint title="Free & Open Source" icon={faComments} details_link_target="http://www.gnu.org/philosophy/free-sw.html" external_link={true} >
                <p>Released under LGPL and available on <a href="https://github.com/cryfs/cryfs">GitHub</a>. Free to use for everyone. Its security is verifiable and the community can work on improvements.</p>
            </BulletPoint>
        </Row>
    </Container>
);

export default BulletsSection;
