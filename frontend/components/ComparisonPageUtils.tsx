import React from 'react';
import Table from 'react-bootstrap/Table';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes, faCircle, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import styles from './ComparisonPageUtils.module.css';

export { styles };

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
    return (
        <td className={className}>
            <FontAwesomeIcon icon={icon} />
            {footnote !== undefined &&
                <span className={styles.footnoteMark}>{footnote}</span>
            }
        </td>
    );
};
