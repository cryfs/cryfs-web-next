import React, { useState, useMemo } from 'react';
import Modal from 'react-bootstrap/Modal';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Tab from 'react-bootstrap/Tab';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinux, faApple, faWindows, faUbuntu } from '@fortawesome/free-brands-svg-icons';
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
            <Col key={index} className={styles.tabCol}>
                <Nav.Item className={styles.tabHeader}>
                    <Nav.Link className={classnames({ active: activeTab === index })}
                        onClick={() => { toggle(index); }}>
                        {tab.header}
                    </Nav.Link>
                </Nav.Item>
            </Col>
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
            <Nav variant="tabs" className="row">
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
        analytics_name: 'debian_ubuntu',
        header: (
            <Row className={styles.osBox}>
                <Col md="12">
                    <FontAwesomeIcon icon={faUbuntu} className={styles.osIcon} aria-label="Debian/Ubuntu" />
                </Col>
                <Col md="12" className={styles.osName}>
                    Debian/Ubuntu
                </Col>
            </Row>),
        body: (
            <>
                <h3>Easy Install</h3>
                <p>CryFS is available in the official Debian and Ubuntu repositories.</p>
                <Console>
                    <ConsoleCommand className={styles.easyinstallCommand}>
                        sudo apt install cryfs
                    </ConsoleCommand>
                </Console>
            </>
        )
    },
    {
        analytics_name: 'linux',
        header: (
            <Row className={styles.osBox}>
                <Col md="12">
                    <FontAwesomeIcon icon={faLinux} className={styles.osIcon} aria-label="Linux" />
                </Col>
                <Col md="12" className={styles.osName}>
                    Other Linux
                </Col>
            </Row>),
        body: (
            <>
                <h3>Package Managers</h3>
                <p>
                    Many Linux distributions include CryFS in their package repositories. Check your distribution&apos;s package manager.
                </p>
                <h3>Build from Source</h3>
                <p>
                    For the latest version, you can <a href="https://github.com/cryfs/cryfs">build CryFS from source</a>.
                </p>
            </>
        )
    },
    {
        analytics_name: 'macos',
        header: (
            <Row className={styles.osBox}>
                <Col md="12">
                    <FontAwesomeIcon icon={faApple} className={styles.osIcon} aria-label="macOS" />
                </Col>
                <Col md="12" className={styles.osName}>
                    macOS
                </Col>
            </Row>),
        body: (
            <>
                <h3>Easy Install</h3>
                <p>
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
                <p>
                    Note: <a href="https://osxfuse.github.io/">macFUSE</a> is required for CryFS to work on macOS.
                </p>
                <h3>Build from Source</h3>
                <p>
                    For the latest version, you can <a href="https://github.com/cryfs/cryfs">build CryFS from source</a>.
                </p>
            </>
        )
    },
    {
        analytics_name: 'windows',
        header: (
            <Row className={styles.osBox}>
                <Col md="12">
                    <FontAwesomeIcon icon={faWindows} className={styles.osIcon} aria-label="Windows" />
                </Col>
                <Col md="12" className={styles.osName}>
                    Windows
                </Col>
            </Row>),
        body: (
            <>
                <h3>Download</h3>
                <p>Windows support is experimental. Please make regular backups of important data.</p>
                <p>
                    <a href="https://github.com/cryfs/cryfs/releases/download/1.0.3/cryfs-1.0.3.msi">CryFS {VersionNumber} (64-bit)</a> (<a href="https://github.com/cryfs/cryfs/releases/download/1.0.3/cryfs-1.0.3.msi.asc">signature</a>)
                </p>
                <h3>Prerequisites</h3>
                <ul>
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
                <Row>
                    <Col md="12">
                        <p>Select your operating system</p>
                    </Col>
                </Row>
                <Tabs tabs={tabs} initiallyActive={0} />
                <p>
                    For older releases, see <a href="https://github.com/cryfs/cryfs/releases">here</a>.
                </p>
            </Container>
        </Modal.Body>
    </RouteHashBasedModal>
);

export default DownloadModal;
