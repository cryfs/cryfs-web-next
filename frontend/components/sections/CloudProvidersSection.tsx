import React from 'react';
import Container from 'react-bootstrap/Container';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDropbox, faGoogleDrive, faApple, faMicrosoft } from '@fortawesome/free-brands-svg-icons';
import { faCloud } from '@fortawesome/free-solid-svg-icons';
import styles from './CloudProvidersSection.module.css';

const providers = [
    { name: 'Dropbox', icon: faDropbox },
    { name: 'Google Drive', icon: faGoogleDrive },
    { name: 'iCloud', icon: faApple },
    { name: 'OneDrive', icon: faMicrosoft },
    { name: 'Any Cloud', icon: faCloud },
];

const CloudProvidersSection = () => (
    <section className={styles.section}>
        <Container>
            <p className={styles.label}>Works seamlessly with</p>
            <div className={styles.providers}>
                {providers.map((provider) => (
                    <div key={provider.name} className={styles.provider}>
                        <FontAwesomeIcon icon={provider.icon} className={styles.icon} />
                        <span className={styles.name}>{provider.name}</span>
                    </div>
                ))}
            </div>
        </Container>
    </section>
);

export default CloudProvidersSection;
