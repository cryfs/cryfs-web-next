import React, { useState, useMemo } from 'react';
import Picture from 'next-export-optimize-images/picture';
import Modal from 'react-bootstrap/Modal';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Tab from 'react-bootstrap/Tab';
import { Console, ConsoleCommand } from '../../components/Console';
import RouteHashBasedModal from './RouteHashBasedModal';
import { VersionNumber } from '../../config/CryfsVersion';
import UbuntuLogo from '../../assets/images/ubuntu.png';
import DebianLogo from '../../assets/images/debian.png';
import OtherLogo from '../../assets/images/other_os.png';
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
            <Col md="4" key={index}>
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
        analytics_name: 'ubuntu',
        header: (
            <Row className={styles.osBox}>
                <Col md="12">
                    <Picture src={UbuntuLogo} alt="Ubuntu" width={61} height={61} />
                </Col>
                <Col md="12" className={styles.osName}>
                    Ubuntu
                </Col>
            </Row>),
        body: (
            <>
                <h3>Easy Install</h3>
                <p>For Ubuntu 17.04 and later</p>
                <Console>
                    <ConsoleCommand className={styles.easyinstallCommand}>
                        sudo apt install cryfs
                    </ConsoleCommand>
                </Console>
                <h3>Alternative: Build from source</h3>
                <p>
                    Follow the instructions <a href="https://github.com/cryfs/cryfs">here</a> for building CryFS from source.
                    You can for example choose this path if you want a version that is newer than the one in the software repositories of your operating system.
                </p>
            </>
        )
    },
    {
        analytics_name: 'debian',
        header: (
            <Row className={styles.osBox}>
                <Col md="12">
                    <Picture src={DebianLogo} alt="Debian" width={50} height={61} />
                </Col>
                <Col md="12" className={styles.osName}>
                    Debian
                </Col>
            </Row>),
        body: (
            <>
                <h3>Easy Install</h3>
                <p>For Debian Stretch and later</p>
                <Console>
                    <ConsoleCommand className={styles.easyinstallCommand}>
                        sudo apt install cryfs
                    </ConsoleCommand>
                </Console>
                <h3>Alternative: Build from source</h3>
                <p>
                    Follow the instructions <a href="https://github.com/cryfs/cryfs">here</a> for building CryFS from source.
                    You can for example choose this path if you want a version that is newer than the one in the software repositories of your operating system.
                </p>
            </>
        )
    },
    {
        analytics_name: 'other',
        header: (
            <Row className={styles.osBox}>
                <Col md="12">
                    <Picture src={OtherLogo} alt="Other" width={61} height={61} />
                </Col>
                <Col md="12" className={styles.osName}>
                    Other
                </Col>
            </Row>),
        body: (
            <>
                <h3>Other Linux</h3>
                <p>
                    If your linux is based on Debian, you could try the Debian or Ubuntu packages from their software repositories. You can also <a href="https://github.com/cryfs/cryfs">build CryFS from source</a>.
                </p>
                <h3>Mac OS X</h3>
                <p>
                    You can install CryFS using Homebrew. Try:
                </p>
                <Console>
                    <ConsoleCommand className={styles.easyinstallCommand}>
                        brew install --cask macfuse
                    </ConsoleCommand>
                    <ConsoleCommand className={styles.easyinstallCommand}>
                        brew install cryfs/tap/cryfs
                    </ConsoleCommand>
                </Console>
                <h3>Windows</h3>
                <p>Windows support is highly experimental. Please take caution and make regular backups.</p>
                <p>First install:</p>
                <ul>
                    <li>
                        <a href="https://github.com/dokan-dev/dokany/releases">DokanY</a>
                        <span>&nbsp;</span>
                        <span>(tested with DokanY 2.2.0.1000, but newer versions might work as well) and</span>
                    </li>
                    <li>
                        <a href="https://support.microsoft.com/en-us/help/2977003/the-latest-supported-visual-c-downloads">Microsoft Visual C++ Redistributable for Visual Studio 2022</a>
                    </li>
                </ul>
                <p>And then install CryFS:</p>
                <ul>
                    <li>
                        <a href="https://github.com/cryfs/cryfs/releases/download/1.0.3/cryfs-1.0.3.msi">CryFS x64</a> (<a href="https://github.com/cryfs/cryfs/releases/download/1.0.3/cryfs-1.0.3.msi.asc">signature</a>)
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
