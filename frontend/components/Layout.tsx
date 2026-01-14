import Head from 'next/head';
import Picture from 'next-export-optimize-images/picture';
import React, { useState } from 'react';
import Link from 'next/link';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { AnalyticsSetup } from '../components/Analytics';
import JsonLd from '../components/JsonLdSchema';
import type { Organization } from '../types/jsonld';
import styles from './Layout.module.css';
import githubRibbon from '../assets/images/github_ribbon.png';
import favicon from '../assets/images/favicon.png';
import logo from '../assets/images/logo.png';

function MyNavBar() {
    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => {
        setIsOpen(!isOpen);
    };

    return (
        <Navbar expand="md" bg="dark" data-bs-theme="dark" sticky="top">
            <div className={styles.navbar}>
                <Navbar.Toggle onClick={toggle} aria-controls="main-navbar" />
                <Navbar.Brand href="/"><div className={styles.brand}>CryFS</div></Navbar.Brand>
                <Navbar.Collapse in={isOpen} id="main-navbar">
                    <Nav>
                        <Nav.Item>
                            <Nav.Link as={Link} href="/howitworks" className={styles.link}>How it works</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link as={Link} href="/tutorial" className={styles.link}>Tutorial</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link as={Link} href="/comparison" className={styles.link}>Compare</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link as={Link} href="/#download" className={styles.link}>Download</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link as={Link} href="/#donate" className={styles.link}>Donate</Nav.Link>
                        </Nav.Item>
                    </Nav>
                </Navbar.Collapse>
            </div>
        </Navbar>
    );
}

const GithubRibbon = () => (
    <a href="https://github.com/cryfs/cryfs">
        {/*TODO Translate*/}
        <Picture
            src={githubRibbon}
            alt="Fork me on GitHub"
            data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_right_darkblue_121621.png"
            className={styles.ribbon}
        />
    </a>
);

const Footer = () => (
    <section className={styles.footerSection}>
        <Container>
            <footer className={styles.footer}>
                <Row>
                    <Col md="10">Copyright © 2016-present &mdash; Sebastian Messmer</Col>
                    <Col md="2">
                        <div className="text-right">
                            {/*TODO Translate*/}
                            <Link href={"/legal_notice"}>Legal Notice</Link>
                        </div>
                    </Col>
                </Row>
            </footer>
        </Container>
    </section>
);

interface LayoutProps {
    children?: React.ReactNode;
}

const organizationSchema: Organization = {
    '@type': 'Organization',
    name: 'CryFS',
    url: 'https://www.cryfs.org',
    logo: {
        '@type': 'ImageObject',
        url: 'https://www.cryfs.org' + logo.src,
        width: logo.width,
        height: logo.height,
    },
    description: 'Free open-source cloud encryption software that encrypts your files locally before syncing to Dropbox, Google Drive, or other cloud providers.',
};

const Layout = ({ children }: LayoutProps) => (
    <>
        <Head>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="shortcut icon" type="image/png" href={favicon.src} />
            <link rel="apple-touch-icon" type="image/png" href={favicon.src} />
        </Head>
        <JsonLd schema={organizationSchema} />
        <AnalyticsSetup /> { /* AnalyticsSetup must be in Layout and not in _document because otherwise componentDidMount isn't executed */}
        <MyNavBar />
        <GithubRibbon />
        {children}
        <Footer />
    </>
);

export default Layout;
