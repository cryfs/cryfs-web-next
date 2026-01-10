"use strict";

import { css, StyleSheet } from "aphrodite"
import React from 'react'
import type { AppProps } from 'next/app'

const styles = [
    StyleSheet.create({
        section: {
            paddingTop: '50px',
            paddingBottom: '50px',
            background: 'white',
            padding: '50px 0px',
        },
    }),
    StyleSheet.create({
        section: {
            paddingTop: '50px',
            paddingBottom: '50px',
            background: '#c2e1f2',
            padding: '50px 0px',
        },
    }),
]

type AlternatingSectionsProps = {
    start_index?: number
    children: React.ReactElement<{ className?: string }>[]
}

const AlternatingSections = (props: AlternatingSectionsProps) => {
    let styleIndex = (typeof props.start_index === 'undefined') ? 0 : props.start_index

    return <> {
        React.Children.map(props.children, (child: React.ReactElement<{ className?: string }>) => {
            let oldClassName = child.props.className
            if (oldClassName) {
                oldClassName += " "
            } else {
                oldClassName = ""
            }
            const style = styles[styleIndex]
            styleIndex = (styleIndex + 1) % styles.length
            return React.cloneElement(child, { className: oldClassName + css(style.section) })
        })
    } </>
}

export default AlternatingSections