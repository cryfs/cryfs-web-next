"use strict";

import React from 'react'
import styles from './AlternatingSections.module.css';

const sectionClasses = [styles.sectionWhite, styles.sectionBlue]

type AlternatingSectionsProps = {
    start_index?: number
    children: React.ReactElement[]
}

const AlternatingSections = (props: AlternatingSectionsProps) => {
    let styleIndex = (typeof props.start_index === 'undefined') ? 0 : props.start_index

    return <> {
        React.Children.map(props.children, (child: React.ReactElement) => {
            let oldClassName = child.props.className
            if (oldClassName) {
                oldClassName += " "
            } else {
                oldClassName = ""
            }
            const sectionClass = sectionClasses[styleIndex]
            styleIndex = (styleIndex + 1) % sectionClasses.length
            return React.cloneElement(child, { className: oldClassName + sectionClass })
        })
    } </>
}

export default AlternatingSections