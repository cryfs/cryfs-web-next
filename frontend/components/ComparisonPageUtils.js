"use strict";

import Table from 'react-bootstrap/Table'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes, faCircle } from '@fortawesome/free-solid-svg-icons'
import styles from './ComparisonPageUtils.module.css';

export { styles }

export const ComparisonTable = (props) => (
    <div className={styles.comparisonTable}>
        <Table striped responsive borderless>
            {props.children}
        </Table>
    </div>
)

export const ComparisonTableHead = (props) => (
    <thead>
        <tr className={styles.headerRow}>
            <th className={styles.headerTh} />
            {props.children}
        </tr>
    </thead>
)

export const ComparisonTableHeader = (props) => (
    <th className={`${styles.headerTh} ${styles.fsTypeHeaderTh}`}>
        <div className={styles.fsTypeHeaderDiv}>
            <span className={styles.fsTypeHeaderSpan}>
                {props.children}
            </span>
        </div>
    </th>
)

export const ComparisonTableBody = (props) => (
    <tbody>
        {props.children}
    </tbody>
)

export const ComparisonTableRow = (props) => (
    <tr className={styles.row}>
        <th>{props.title}</th>
        {props.children}
    </tr>
)

export const ComparisonTableCell = (props) => {
    let className
    let icon
    if (props.type == 'yes') {
        className = `${styles.cell} ${styles.comparisonIcon} ${styles.comparisonIconYes}`
        icon = faCheck
    } else if (props.type == 'no') {
        className = `${styles.cell} ${styles.comparisonIcon} ${styles.comparisonIconNo}`
        icon = faTimes
    } else if (props.type == 'half') {
        className = `${styles.cell} ${styles.comparisonIcon} ${styles.comparisonIconHalf}`
        icon = faCircle
    }
    return <td className={className}>
        <FontAwesomeIcon icon={icon} />
        {(typeof props.footnote != "undefined") &&
            <span className={styles.footnoteMark}>{props.footnote}</span>
        }
    </td>
}
