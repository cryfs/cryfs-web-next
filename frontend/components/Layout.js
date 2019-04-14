"use strict";

import Head from 'next/head'
import '../assets/styles/bootstrap.scss'
import * as React from "react";
import Link from 'next/link'
import {
    Container,
    Row,
    Col,
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink} from 'reactstrap';
import { StyleSheet, css } from 'aphrodite/no-important'

if (typeof window !== 'undefined') {
    /* StyleSheet.rehydrate takes an array of rendered classnames,
    and ensures that the client side render doesn't generate
    duplicate style definitions in the <style data-aphrodite> tag */
    StyleSheet.rehydrate(window.__NEXT_DATA__.ids)
}

class MyNavBar extends React.Component {
    navbarStyle = StyleSheet.create({
        navbar: {
            fontSize: '1.2rem',
            paddingRight: '140px',
            paddingLeft: '15px',
            '@media (min-width: 768px)': {
                display: 'flex',
            },
        },
    })

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
        return <div>
            <Navbar expand="md" color="dark" dark>
                <div className={css(this.navbarStyle.navbar)}>
                    <NavbarToggler onClick={this.toggle} />
                    <NavbarBrand href="/">CryFS</NavbarBrand>
                    <Collapse isOpen={this.state.isOpen} navbar>
                        <Nav navbar>
                            <NavItem>
                                <Link href="/howitworks"><NavLink>How it works</NavLink></Link>
                            </NavItem>
                            <NavItem>
                                <Link href="/tutorial"><NavLink>Tutorial</NavLink></Link>
                            </NavItem>
                            <NavItem>
                                <Link href="/comparison"><NavLink>Compare</NavLink></Link>
                            </NavItem>
                            <NavItem>
                                <Link href="/"><NavLink>Download</NavLink></Link>
                            </NavItem>
                            <NavItem>
                                <Link href="/#donate"><NavLink>Donate</NavLink></Link>
                            </NavItem>
                        </Nav>
                    </Collapse>
                </div>
            </Navbar>
        </div>
    }
}

const githubRibbonStyle = StyleSheet.create({
    ribbon: {
        position: 'absolute',
        zIndex: 1000,
        top: 0,
        right: 0,
        border: 0,
    },
})

const GithubRibbon = props => (
    <a href="https://github.com/cryfs/cryfs">
        {/*TODO Translate*/}
        <img src={require("../assets/images/github_ribbon.png")}
             alt="Fork me on GitHub"
             data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_right_darkblue_121621.png"
             className={css(githubRibbonStyle.ribbon)} />
    </a>
)

const footerStyle = StyleSheet.create({
    footer: {
        height: '50px',
        color: 'white',
    },
    section: {
        paddingTop: '20px',
        background: 'black',
    },
})

const Footer = props => (
    <section className={css(footerStyle.section)}>
        <Container>
            <footer className={css(footerStyle.footer)}>
                <Row>
                    <Col md="8">Copyright © 2016-present &mdash; Sebastian Messmer</Col>
                    <Col md="2">
                        {/*TODO Change to data-layout="button_count", once we have some likes*/}
                        <div id="fb-like"
                             className="fb-like"
                             data-href="https://www.facebook.com/cryfs.org"
                             data-width="200"
                             data-layout="button"
                             data-action="like"
                             data-show-faces="true"
                             data-share="true" />
                    </Col>
                    <Col md="2">
                        <div className="text-right">
                            {/*TODO Translate*/}
                            <Link href={"/legal_notice"}><a>Legal Notice</a></Link>
                        </div>
                    </Col>
                </Row>
            </footer>
        </Container>
    </section>
)

const Layout = props => (
    <div>
        <Head>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="shortcut icon" type="image/png" href={require("../assets/images/favicon.png")} />
            <link rel="apple-touch-icon" type="image/png" href={require("../assets/images/favicon.png")} />
        </Head>
        <MyNavBar />
        <GithubRibbon />
        {props.children}
        <Footer />
    </div>
)

export default Layout
