"use strict";

import Container from 'react-bootstrap/Container'
import styles from './ContentHeaderSection.module.css';

const ContentHeaderSection = (props) => (
    <section {...props}>
        <Container>
            <h1 className={styles.title}>{props.title}</h1>
            {(typeof props.subtitle != 'undefined') &&
                <p className={styles.subtitle}>{props.subtitle}</p>
            }
            {props.children}
        </Container>
    </section>
)

export default ContentHeaderSection;