import React from 'react';
import Table from 'react-bootstrap/Table';
import Card from 'react-bootstrap/Card';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes, faCircle, faThumbsUp, faThumbsDown, faExclamationTriangle, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import styles from './ComparisonPageUtils.module.css';

export { styles };

// Quick Overview Table Components
type VerdictType = 'recommended' | 'good' | 'decent' | 'local-only' | 'not-recommended';

interface QuickOverviewRowProps {
    tool: string;
    toolId: string;
    verdict: VerdictType;
    description: string;
}

const verdictConfig: Record<VerdictType, { label: string; className: string; icon: IconDefinition }> = {
    'recommended': { label: 'Recommended', className: styles.verdictRecommended ?? '', icon: faThumbsUp },
    'good': { label: 'Good choice', className: styles.verdictGood ?? '', icon: faThumbsUp },
    'decent': { label: 'Decent option', className: styles.verdictDecent ?? '', icon: faCircle },
    'local-only': { label: 'Local only', className: styles.verdictLocalOnly ?? '', icon: faExclamationTriangle },
    'not-recommended': { label: 'Not recommended', className: styles.verdictNotRecommended ?? '', icon: faThumbsDown },
};

export const QuickOverviewTable = ({ children }: ChildrenProps) => (
    <div className={styles.quickOverviewTable}>
        <Table responsive className={styles.quickOverviewTableInner}>
            <thead>
                <tr>
                    <th className={styles.quickOverviewHeaderTool}>Tool</th>
                    <th className={styles.quickOverviewHeaderVerdict}>Verdict</th>
                    <th className={styles.quickOverviewHeaderDesc}>Description</th>
                </tr>
            </thead>
            <tbody>
                {children}
            </tbody>
        </Table>
    </div>
);

export const QuickOverviewRow = ({ tool, toolId, verdict, description }: QuickOverviewRowProps) => {
    const config = verdictConfig[verdict];
    return (
        <tr className={styles.quickOverviewRow}>
            <td className={styles.quickOverviewTool}>
                <a href={`#${toolId}`}><strong>{tool}</strong></a>
            </td>
            <td className={styles.quickOverviewVerdict}>
                <span className={`${styles.verdictBadge} ${config.className}`}>
                    <FontAwesomeIcon icon={config.icon} className={styles.verdictIcon} />
                    {config.label}
                </span>
            </td>
            <td className={styles.quickOverviewDesc}>{description}</td>
        </tr>
    );
};

// Tool Card Component for consistent section styling
interface ToolCardProps {
    children: React.ReactNode;
    highlighted?: boolean;
}

export const ToolCard = ({ children, highlighted }: ToolCardProps) => (
    <Card className={`${styles.toolCard} ${highlighted ? styles.toolCardHighlighted : ''}`}>
        <Card.Body>
            {children}
        </Card.Body>
    </Card>
);

interface ChildrenProps {
    children?: React.ReactNode;
}

export const ComparisonTable = ({ children }: ChildrenProps) => (
    <div className={styles.comparisonTable}>
        <Table striped responsive borderless>
            {children}
        </Table>
    </div>
);

export const ComparisonTableHead = ({ children }: ChildrenProps) => (
    <thead>
        <tr className={styles.headerRow}>
            <th className={styles.headerTh} />
            {children}
        </tr>
    </thead>
);

export const ComparisonTableHeader = ({ children }: ChildrenProps) => (
    <th className={`${styles.headerTh} ${styles.fsTypeHeaderTh}`}>
        <div className={styles.fsTypeHeaderDiv}>
            <span className={styles.fsTypeHeaderSpan}>
                {children}
            </span>
        </div>
    </th>
);

export const ComparisonTableBody = ({ children }: ChildrenProps) => (
    <tbody>
        {children}
    </tbody>
);

interface ComparisonTableRowProps extends ChildrenProps {
    title: string;
}

export const ComparisonTableRow = ({ title, children }: ComparisonTableRowProps) => (
    <tr className={styles.row}>
        <th>{title}</th>
        {children}
    </tr>
);

interface ComparisonTableCellProps {
    type: 'yes' | 'no' | 'half';
    footnote?: string | number;
}

export const ComparisonTableCell = ({ type, footnote }: ComparisonTableCellProps) => {
    let className: string;
    let icon: IconDefinition;
    if (type === 'yes') {
        className = `${styles.cell} ${styles.comparisonIcon} ${styles.comparisonIconYes}`;
        icon = faCheck;
    } else if (type === 'no') {
        className = `${styles.cell} ${styles.comparisonIcon} ${styles.comparisonIconNo}`;
        icon = faTimes;
    } else {
        className = `${styles.cell} ${styles.comparisonIcon} ${styles.comparisonIconHalf}`;
        icon = faCircle;
    }
    // Extract letter from footnote (e.g., "a)" -> "a")
    const footnoteId = footnote?.toString().replace(/[^a-z]/gi, '').toLowerCase();
    return (
        <td className={className}>
            <FontAwesomeIcon icon={icon} />
            {footnote !== undefined &&
                <a href={`#footnote-${footnoteId}`} className={styles.footnoteMark}>{footnote}</a>
            }
        </td>
    );
};

// Footnote list item component with ID for linking
interface FootnoteItemProps {
    id: string;
    children: React.ReactNode;
}

export const FootnoteItem = ({ id, children }: FootnoteItemProps) => (
    <li id={`footnote-${id}`} className={styles.footnotesLi}>
        {children}
    </li>
);
