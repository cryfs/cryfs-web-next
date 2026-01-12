"use strict";

import React from 'react'
import styles from './AlternatingSections.module.css';

const sectionClasses = [styles.sectionWhite, styles.sectionBlue]

type SectionProps = {
    className?: string
}

export type AlternatingSectionsProps = {
    start_index?: number
    children: React.ReactElement<SectionProps> | React.ReactElement<SectionProps>[]
}

const AlternatingSections = (props: AlternatingSectionsProps) => {
    const startIndex = props.start_index ?? 0

    return <> {
        React.Children.map(props.children, (child: React.ReactElement<SectionProps>, index: number) => {
            let oldClassName = child.props.className
            if (oldClassName) {
                oldClassName += " "
            } else {
                oldClassName = ""
            }
            const sectionClass = sectionClasses[(startIndex + index) % sectionClasses.length]
            return React.cloneElement(child, { className: oldClassName + sectionClass })
        })
    } </>
}

export default AlternatingSections