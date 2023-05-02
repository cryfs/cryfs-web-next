"use strict";

// TODO Convert this file to typescript. But we need reactstrap v9 for that because of https://github.com/reactstrap/reactstrap/issues/2501

import { StyleSheet, css } from 'aphrodite/no-important'
import { Table } from 'reactstrap'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes, faCircle } from '@fortawesome/free-solid-svg-icons'

export const style = StyleSheet.create({
    image: {
        maxWidth: '100%',
        marginTop: '5px',
        marginBottom: '30px',
        width: '100%',
    },
    footnotes: {
        counterReset: 'list',
    },
    footnotesLi: {
        listStyle: 'none',
        position: 'relative',
        ':before': {
            counterIncrement: 'list',
            content: 'counter(list, lower-alpha) ") "',
            position: 'absolute',
            left: '-1.4em',
        }
    },
})

const tableStyle = StyleSheet.create({
    comparisonTable: {
        marginLeft: 'auto',
        marginRight: 'auto',
        '@media (min-width: 992px)': { // is-min-md
            width: '900px',
        },
        '@media (min-width: 768px) and (max-width: 991px)': { // is-sm
            width: '600px',
        },
        '@media (max-width: 767px)': { // is-xs
            //Don't set width - use auto scaling.
        },
    },
    comparisonIcon: {
        position: 'relative', // Needed for the footnotes to be positioned correctly
        textAlign: 'center',
        '@media (min-width: 992px)': { // is-min-md
            width: '45px',
            fontSize: '25px',
        },
        '@media (min-width: 768px) and (max-width: 991px)': { // is-sm
            width: '45px',
            fontSize: '15px',
        },
        '@media (max-width: 767px)': { // is-xs
            width: '20px',
            fontSize: '15px',
        },
    },
    comparisonIconYes: {
        backgroundColor: '#dff0d8',
        color: 'green',
    },
    comparisonIconNo: {
        backgroundColor: '#f2dede',
        color: 'red',
    },
    comparisonIconHalf: {
        backgroundColor: '#fcf8e3',
        color: 'orange',
    },
    headerTh: {
        '@media (max-width: 767px)': { // is-xs
            paddingLeft: '0px',
            paddingRight: '0px',
        },
    },
    fsTypeHeaderTh: {
        '@media (max-width: 767px)': { // is-xs
            height: '140px',
            whiteSpace: 'nowrap',
        },
    },
    fsTypeHeaderDiv: {
        '@media (max-width: 767px)': { // is-xs
            transform: 'rotate(270deg)',
            width: '30px',
        },
    },
    fsTypeHeaderSpan: {
        borderBottom: '1px solid #ccc',
        padding: '5px 10px',
    },
    headerRow: {
        borderBottom: '2px solid #ddd',
    },
    row: {
        borderTop: '1px solid #ddd',
    },
    cell: {
        '@media (max-width: 767px)': { // is-xs
            paddingLeft: '0px',
            paddingRight: '0px',
        },
    },
    footnoteMark: {
        position: 'absolute',
        top: '10px',
        fontSize: '10px',
    },
})

export const ComparisonTable = (props) => (
    <div className={css(tableStyle.comparisonTable)}>
        <Table striped responsive borderless>
            {props.children}
        </Table>
    </div>
)

export const ComparisonTableHead = (props) => (
    <thead>
        <tr className={css(tableStyle.headerRow)}>
            <th className={css(tableStyle.headerTh)} />
            {props.children}
        </tr>
    </thead>
)

export const ComparisonTableHeader = (props) => (
    <th className={css(tableStyle.headerTh, tableStyle.fsTypeHeaderTh)}>
        <div className={css(tableStyle.fsTypeHeaderDiv)}>
            <span className={css(tableStyle.fsTypeHeaderSpan)}>
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
    <tr className={css(tableStyle.row)}>
        <th>{props.title}</th>
        {props.children}
    </tr>
)

export const ComparisonTableCell = (props) => {
    let className
    let icon
    if (props.type == 'yes') {
        className = css(tableStyle.cell, tableStyle.comparisonIcon, tableStyle.comparisonIconYes)
        icon = faCheck
    } else if (props.type == 'no') {
        className = css(tableStyle.cell, tableStyle.comparisonIcon, tableStyle.comparisonIconNo)
        icon = faTimes
    } else if (props.type == 'half') {
        className = css(tableStyle.cell, tableStyle.comparisonIcon, tableStyle.comparisonIconHalf)
        icon = faCircle
    }
    return <td className={className}>
        <FontAwesomeIcon icon={icon} />
        {(typeof props.footnote != "undefined") &&
            <span className={css(tableStyle.footnoteMark)}>{props.footnote}</span>
        }
    </td>
}
