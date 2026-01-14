import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt, faLock, faCloudUploadAlt, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import styles from './HowItWorksSection.module.css';

const steps = [
    {
        number: '1',
        icon: faFileAlt,
        title: 'Create Your Files',
        description: 'Work with your files normally in your encrypted folder. Documents, photos, anything you want to protect.',
    },
    {
        number: '2',
        icon: faLock,
        title: 'CryFS Encrypts',
        description: 'CryFS automatically encrypts your files locally, including all metadata and folder structure.',
    },
    {
        number: '3',
        icon: faCloudUploadAlt,
        title: 'Sync Securely',
        description: 'Only encrypted data syncs to the cloud. Your provider sees nothing but encrypted blocks.',
    },
];

const HowItWorksSection = () => (
    <section className={styles.section}>
        <Container>
            <div className={styles.header}>
                <h2 className={styles.title}>How CryFS Works</h2>
                <p className={styles.subtitle}>
                    Simple setup, powerful protection. Your files are encrypted before they ever leave your computer.
                </p>
            </div>

            <div className={styles.stepsContainer}>
                <Row className={styles.stepsRow}>
                    {steps.map((step, index) => (
                        <Col lg="4" key={step.number} className={styles.stepCol}>
                            <div className={styles.step}>
                                <div className={styles.stepNumber}>{step.number}</div>
                                <div className={styles.stepIcon}>
                                    <FontAwesomeIcon icon={step.icon} />
                                </div>
                                <h3 className={styles.stepTitle}>{step.title}</h3>
                                <p className={styles.stepDescription}>{step.description}</p>
                            </div>
                            {index < steps.length - 1 && (
                                <div className={styles.connector}>
                                    <FontAwesomeIcon icon={faArrowRight} />
                                </div>
                            )}
                        </Col>
                    ))}
                </Row>
            </div>

            <div className={styles.cta}>
                <Link href="/howitworks" passHref legacyBehavior>
                    <Button as="a" variant="outline-primary" size="lg" className={styles.learnMoreButton}>
                        Learn More About How CryFS Works
                        <FontAwesomeIcon icon={faArrowRight} className={styles.buttonIcon} />
                    </Button>
                </Link>
            </div>
        </Container>
    </section>
);

export default HowItWorksSection;
