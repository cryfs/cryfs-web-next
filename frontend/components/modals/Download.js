"use strict";

import React from 'react';
import { ModalBody, Container, Row, Col, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import { StyleSheet, css } from 'aphrodite/no-important'
import {Console, ConsoleCommand} from '../../components/Console'
import RouteHashBasedModal from './RouteHashBasedModal'
import {VersionNumber} from '../../config/CryfsVersion'
import UbuntuLogo from '../../assets/images/ubuntu.png'
import DebianLogo from '../../assets/images/debian.png'
import OtherLogo from '../../assets/images/other_os.png'
import classnames from 'classnames'
import {logAnalyticsEvent} from '../Analytics'

const style = StyleSheet.create({
    tabHeader: {
        cursor: 'pointer',
    },
    tabContent: {
        marginTop: '20px',
    },
    osBox: {
        marginTop: '10px',
        textAlign: 'center',
        cursor: 'pointer',
    },
    osName: {
        verticalAlign: 'middle',
        fontSize: 'x-large',
    },
    easyinstallCommand: {
        fontSize: '15px',
    },
})

class Tabs extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            activeTab: ((typeof this.props.initiallyActive == "undefined") ? 0 : this.props.initiallyActive),
        }
    }

    toggle = async (tabIndex) => {
        const tab_analytics_name = this.props.tabs()[tabIndex].analytics_name
        await logAnalyticsEvent('download', `click_${tab_analytics_name}_tab`)
        if (this.state.activeTab !== tabIndex) {
            this.setState({
                activeTab: tabIndex
            })
        }
    }

    renderTabHeaders = () => {
        let index = -1

        return this.props.tabs().map((tab) => {
            index += 1

            return ((index) => (
                <Col md="4" key={index}>
                    <NavItem className={css(style.tabHeader)}>
                        <NavLink className={classnames({active: this.state.activeTab === index})}
                                 onClick={async () => {await this.toggle(index)}}>
                            {tab.header}
                        </NavLink>
                    </NavItem>
                </Col>))(index)
        })
    }

    renderTabBodies = () => {
        let index = -1

        return this.props.tabs().map((tab) => {
            index += 1

            return ((index) => (
                <TabPane tabId={index} key={index}>
                    {tab.body}
                </TabPane>))(index)
        })
    }

    render = () => (
        <>
            <Nav tabs className="row">
                {this.renderTabHeaders()}
            </Nav>
            <TabContent activeTab={this.state.activeTab} className={css(style.tabContent)}>
                {this.renderTabBodies()}
            </TabContent>
        </>
    )
}

const tabs = () => [
    {
        analytics_name: 'ubuntu',
        header: (
            <Row className={css(style.osBox)}>
                <Col md="12">
                    <img src={UbuntuLogo} alt="Ubuntu" size="61x61" />
                </Col>
                <Col md="12" className={css(style.osName)}>
                    Ubuntu
                </Col>
            </Row>),
        body: (
            <>
                <h3>Easy Install</h3>
                <p>For Ubuntu 17.04 and later</p>
                <Console>
                    <ConsoleCommand className={css(style.easyinstallCommand)}>
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
            <Row className={css(style.osBox)}>
                <Col md="12">
                    <img src={DebianLogo} alt="Debian" size="50x61" />
                </Col>
                <Col md="12" className={css(style.osName)}>
                    Debian
                </Col>
            </Row>),
        body: (
            <>
                <h3>Easy Install</h3>
                <p>For Debian Stretch and later</p>
                <Console>
                    <ConsoleCommand className={css(style.easyinstallCommand)}>
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
            <Row className={css(style.osBox)}>
                <Col md="12">
                    <img src={OtherLogo} alt="Other" size="61x61" />
                </Col>
                <Col md="12" className={css(style.osName)}>
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
                    <ConsoleCommand className={css(style.easyinstallCommand)}>
                        brew install --cask macfuse
                    </ConsoleCommand>
                    <ConsoleCommand className={css(style.easyinstallCommand)}>
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
                        <span>(use newest Dokan_x64.msi or Dokan_x86.msi) and</span>
                    </li>
                    <li>
                        <a href="https://support.microsoft.com/en-us/help/2977003/the-latest-supported-visual-c-downloads">Microsoft Visual C++ Redistributable for Visual Studio 2019</a>
                    </li>
                </ul>
                <p>And then install CryFS:</p>
                <ul>
                    <li>
                        <a href="https://github.com/cryfs/cryfs/releases/download/0.11.4/cryfs-0.11.4-win64.msi">CryFS 64bit</a> (<a href="https://github.com/cryfs/cryfs/releases/download/0.11.4/cryfs-0.11.4-win64.msi.asc">signature</a>)
                        <span>&nbsp;</span>
                        <span>or</span>
                    </li>
                    <li>
                        <a href="https://github.com/cryfs/cryfs/releases/download/0.11.4/cryfs-0.11.4-win32.msi">CryFS 32bit</a> (<a href="https://github.com/cryfs/cryfs/releases/download/0.11.4/cryfs-0.11.4-win32.msi.asc">signature</a>)
                    </li>
                </ul>
            </>
        )
    },
]

const DownloadModal = () => (
    <RouteHashBasedModal hash="#download" header={`Download CryFS ${VersionNumber}`} showCloseButtonInFooter labelledBy="downloadModalTitle" size="lg">
        <ModalBody>
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
        </ModalBody>
    </RouteHashBasedModal>
)

export default DownloadModal
