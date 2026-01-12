import React from 'react';
import Container from 'react-bootstrap/Container';
import styles from './ContentHeaderSection.module.css';

interface ContentHeaderSectionProps extends React.HTMLAttributes<HTMLElement> {
    title: string;
    subtitle?: string;
    children?: React.ReactNode;
}

const ContentHeaderSection = ({ title, subtitle, children, ...props }: ContentHeaderSectionProps) => (
    <section {...props}>
        <Container>
            <h1 className={styles.title}>{title}</h1>
            {subtitle !== undefined &&
                <p className={styles.subtitle}>{subtitle}</p>
            }
            {children}
        </Container>
    </section>
);

export default ContentHeaderSection;
