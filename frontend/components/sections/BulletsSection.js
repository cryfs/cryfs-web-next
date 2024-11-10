"use strict";

import { css, StyleSheet } from "aphrodite";
import { Button, Col, Container, Row } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { faAngleDoubleRight, faComments, faLightbulb, faLock } from "@fortawesome/free-solid-svg-icons";

const bulletStyle = StyleSheet.create({
    icon: {
        fontSize: '150px',
    },
    title: {
        marginTop: '20px',
        marginBottom: '20px',
    },
})

const BulletPoint = (props) => (
    <Col lg="4">
        <div className="text-center">
            <FontAwesomeIcon icon={props.icon} className={css(bulletStyle.icon)} />
            <h2 className={css(bulletStyle.title)}>{props.title}</h2>
            {props.children}
            <p>
                {(!props.external_link) ?
                    <Link passHref href={props.details_link_target}>
                        <Button outline color="secondary">
                            {/*TODO Translate*/}
                            Details &nbsp;
                            <FontAwesomeIcon icon={faAngleDoubleRight} />
                        </Button>
                    </Link> :
                    <Button outline color="secondary" href={props.details_link_target}>
                        {/*TODO Translate*/}
                        Details &nbsp;
                        <FontAwesomeIcon icon={faAngleDoubleRight} />
                    </Button>
                }
            </p>
        </div>
    </Col>
)

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
)

export default BulletsSection;
