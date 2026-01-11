"use strict";

import Head from 'next/head'
import Image from 'next-export-optimize-images/image'
import React from 'react';
import Link from 'next/link'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { AnalyticsSetup } from '../components/Analytics'
import styles from './Layout.module.css';
import githubRibbon from '../assets/images/github_ribbon.png';
import favicon from '../assets/images/favicon.png';

class MyNavBar extends React.Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            isOpen: false
        };
    }
    toggle = () => {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }
    render = () => {
        return <Navbar expand="md" bg="dark" data-bs-theme="dark">
            <div className={styles.navbar}>
                <Navbar.Toggle onClick={this.toggle} aria-controls="main-navbar" />
                <Navbar.Brand href="/"><div className={styles.brand}>CryFS</div></Navbar.Brand>
                <Navbar.Collapse in={this.state.isOpen} id="main-navbar">
                    <Nav>
                        <Nav.Item>
                            <Link legacyBehavior passHref href="/howitworks"><Nav.Link className={styles.link}>How it works</Nav.Link></Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Link legacyBehavior passHref href="/tutorial"><Nav.Link className={styles.link}>Tutorial</Nav.Link></Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Link legacyBehavior passHref href="/comparison"><Nav.Link className={styles.link}>Compare</Nav.Link></Link>
                        </Nav.Item>
                        <Nav.Item className="d-none d-md-block">
                            <Link legacyBehavior passHref href="/#download"><Nav.Link className={styles.link}>Download</Nav.Link></Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Link legacyBehavior passHref href="/#donate"><Nav.Link className={styles.link}>Donate</Nav.Link></Link>
                        </Nav.Item>
                    </Nav>
                </Navbar.Collapse>
            </div>
        </Navbar>
    }
}

const GithubRibbon = props => (
    <a href="https://github.com/cryfs/cryfs">
        {/*TODO Translate*/}
        <Image
            src={githubRibbon}
            alt="Fork me on GitHub"
            data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_right_darkblue_121621.png"
            className={styles.ribbon}
        />
    </a>
)

const Footer = props => (
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
)

const Layout = (props) => (
    <>
        <Head>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="shortcut icon" type="image/png" href={favicon.src} />
            <link rel="apple-touch-icon" type="image/png" href={favicon.src} />
        </Head>
        <AnalyticsSetup /> { /* AnalyticsSetup must be in Layout and not in _document because otherwise componentDidMount isn't executed */}
        <MyNavBar />
        <GithubRibbon />
        {props.children}
        <Footer />
    </>
)

export default Layout