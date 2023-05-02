"use strict";

// TODO Convert this file to typescript. But we need reactstrap v9 for that because of https://github.com/reactstrap/reactstrap/issues/2501

import { Container } from 'reactstrap'
import { StyleSheet, css } from 'aphrodite/no-important'

const style = StyleSheet.create({
    title: {
        fontSize: '4.5rem',
    },
    subtitle: {
        fontSize: '1.7rem',
    },
})

const ContentHeaderSection = (props) => (
    <section {...props}>
        <Container>
            <h1 className={css(style.title)}>{props.title}</h1>
            {(typeof props.subtitle != 'undefined') &&
                <p className={css(style.subtitle)}>{props.subtitle}</p>
            }
            {props.children}
        </Container>
    </section>
)

export default ContentHeaderSection;