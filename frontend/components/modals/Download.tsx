import React, { useState, useMemo } from 'react';
import Modal from 'react-bootstrap/Modal';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Tab from 'react-bootstrap/Tab';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinux, faApple, faWindows } from '@fortawesome/free-brands-svg-icons';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { Console, ConsoleCommand } from '../../components/Console';
import RouteHashBasedModal from './RouteHashBasedModal';
import { VersionNumber } from '../../config/CryfsVersion';
import classnames from 'classnames';
import { logAnalyticsEvent } from '../Analytics';
import styles from './Download.module.css';

interface TabDefinition {
    analytics_name: string;
    header: React.ReactNode;
    body: React.ReactNode;
}

interface TabsProps {
    tabs: () => TabDefinition[];
    initiallyActive?: number;
}

function Tabs({ tabs: tabsFunc, initiallyActive }: TabsProps) {
    const [activeTab, setActiveTab] = useState(initiallyActive === undefined ? 0 : initiallyActive);
    const tabs = useMemo(() => tabsFunc(), [tabsFunc]);

    const toggle = (tabIndex: number) => {
        const tab = tabs[tabIndex];
        if (!tab) return;
        logAnalyticsEvent('download', `click_${tab.analytics_name}_tab`);
        if (activeTab !== tabIndex) {
            setActiveTab(tabIndex);
        }
    };

    const renderTabHeaders = () => {
        return tabs.map((tab, index) => (
            <div key={index} className={styles.tabCol}>
                <Nav.Item className={styles.tabHeader}>
                    <Nav.Link className={classnames({ active: activeTab === index })}
                        onClick={() => { toggle(index); }}>
                        {tab.header}
                    </Nav.Link>
                </Nav.Item>
            </div>
        ));
    };

    const renderTabBodies = () => {
        return tabs.map((tab, index) => (
            <Tab.Pane eventKey={index} key={index}>
                {tab.body}
            </Tab.Pane>
        ));
    };

    return (
        <Tab.Container activeKey={activeTab}>
            <Nav variant="tabs" className={styles.tabNav}>
                {renderTabHeaders()}
            </Nav>
            <Tab.Content className={styles.tabContent}>
                {renderTabBodies()}
            </Tab.Content>
        </Tab.Container>
    );
}

const tabs = (): TabDefinition[] => [
    {
        analytics_name: 'linux',
        header: (
            <div className={styles.osBox}>
                <FontAwesomeIcon icon={faLinux} className={styles.osIcon} aria-label="Linux" />
                <div className={styles.osName}>Linux</div>
            </div>
        ),
        body: (
            <>
                <h3 className={styles.sectionHeading}>Debian / Ubuntu</h3>
                <p className={styles.infoText}>CryFS is available in the official Debian and Ubuntu repositories.</p>
                <Console>
                    <ConsoleCommand className={styles.easyinstallCommand}>
                        sudo apt install cryfs
                    </ConsoleCommand>
                </Console>
                <h3 className={styles.sectionHeading}>Other Distributions</h3>
                <p className={styles.infoText}>
                    Many Linux distributions include CryFS in their package repositories. Check your distribution&apos;s package manager.
                </p>
                <h3 className={styles.sectionHeading}>Build from Source</h3>
                <p className={styles.infoText}>
                    For the latest version, you can <a href="https://github.com/cryfs/cryfs">build CryFS from source</a>.
                </p>
            </>
        )
    },
    {
        analytics_name: 'macos',
        header: (
            <div className={styles.osBox}>
                <FontAwesomeIcon icon={faApple} className={styles.osIcon} aria-label="macOS" />
                <div className={styles.osName}>macOS</div>
            </div>
        ),
        body: (
            <>
                <h3 className={styles.sectionHeading}>Easy Install</h3>
                <p className={styles.infoText}>
                    Install CryFS using <a href="https://brew.sh/">Homebrew</a>:
                </p>
                <Console>
                    <ConsoleCommand className={styles.easyinstallCommand}>
                        brew install --cask macfuse
                    </ConsoleCommand>
                    <ConsoleCommand className={styles.easyinstallCommand}>
                        brew install cryfs/tap/cryfs
                    </ConsoleCommand>
                </Console>
                <p className={styles.infoText}>
                    Note: <a href="https://osxfuse.github.io/">macFUSE</a> is required for CryFS to work on macOS.
                </p>
                <h3 className={styles.sectionHeading}>Build from Source</h3>
                <p className={styles.infoText}>
                    For the latest version, you can <a href="https://github.com/cryfs/cryfs">build CryFS from source</a>.
                </p>
            </>
        )
    },
    {
        analytics_name: 'windows',
        header: (
            <div className={styles.osBox}>
                <FontAwesomeIcon icon={faWindows} className={styles.osIcon} aria-label="Windows" />
                <div className={styles.osName}>Windows</div>
            </div>
        ),
        body: (
            <>
                <h3 className={styles.sectionHeading}>Download</h3>
                <p className={styles.warningText}>Windows support is experimental. Please make regular backups of important data.</p>
                <p>
                    <a href="https://github.com/cryfs/cryfs/releases/download/1.0.3/cryfs-1.0.3.msi" className={styles.downloadButton}>
                        <FontAwesomeIcon icon={faDownload} />
                        CryFS {VersionNumber} (64-bit)
                    </a>
                    <a href="https://github.com/cryfs/cryfs/releases/download/1.0.3/cryfs-1.0.3.msi.asc" className={styles.signatureLink}>signature</a>
                </p>
                <h3 className={styles.sectionHeading}>Prerequisites</h3>
                <ul className={styles.prerequisitesList}>
                    <li>
                        <a href="https://github.com/dokan-dev/dokany/releases">DokanY</a> (version 2.2.0 or later)
                    </li>
                    <li>
                        <a href="https://support.microsoft.com/en-us/help/2977003/the-latest-supported-visual-c-downloads">Microsoft Visual C++ Redistributable for Visual Studio 2022</a>
                    </li>
                </ul>
            </>
        )
    },
];

const DownloadModal = () => (
    <RouteHashBasedModal hash="#download" header={`Download CryFS ${VersionNumber}`} showCloseButtonInFooter labelledBy="downloadModalTitle" size="lg">
        <Modal.Body>
            <Container fluid>
                <p className={styles.selectOsText}>Select your operating system</p>
                <Tabs tabs={tabs} initiallyActive={0} />
                <p className={styles.olderReleases}>
                    For older releases, see <a href="https://github.com/cryfs/cryfs/releases">here</a>.
                </p>
            </Container>
        </Modal.Body>
    </RouteHashBasedModal>
);

export default DownloadModal;
