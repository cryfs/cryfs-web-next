import { StyleSheet, css } from 'aphrodite/no-important'

const style = StyleSheet.create({
    console: {
        backgroundColor: 'black',
        color: '#eee',
        padding: '15px',
    },
    linestart: {
        color: '#008800',
        marginRight: '0.5em',
        // disallow selecting it
        '-webkit-touch-callout': 'none',
        '-webkit-user-select': 'none',
        '-khtml-user-select': 'none',
        '-moz-user-select': 'none',
        '-ms-user-select': 'none',
        'user-select': 'none',
    },
    line: {
        width: '100%',
    },
    output: {
        color: '#888',
    },
})

type ConsoleProps = {
    children: React.ReactNode
}

export const Console = (props: ConsoleProps) => (
    <pre className={css(style.console)}>
        {props.children}
    </pre>
)

type ConsoleCommandProps = {
    children: React.ReactNode
}

export const ConsoleCommand = (props: ConsoleCommandProps) => (
    <div className={css(style.line)} {...props}>
        <span className={css(style.linestart)}>$</span>
        {props.children}
    </div>
)

type ConsoleOutputProps = {
    children: React.ReactNode
}

export const ConsoleOutput = (props: ConsoleOutputProps) => (
    <div className={css(style.line, style.output)}>
        {props.children}
    </div>
)
