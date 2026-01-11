import styles from './Console.module.css';

type ConsoleProps = {
    children: React.ReactNode
}

export const Console = (props: ConsoleProps) => (
    <pre className={styles.console}>
        {props.children}
    </pre>
)

type ConsoleCommandProps = {
    children: React.ReactNode
}

export const ConsoleCommand = (props: ConsoleCommandProps) => (
    <div className={styles.line} {...props}>
        <span className={styles.linestart}>$</span>
        {props.children}
    </div>
)

type ConsoleOutputProps = {
    children: React.ReactNode
}

export const ConsoleOutput = (props: ConsoleOutputProps) => (
    <div className={`${styles.line} ${styles.output}`}>
        {props.children}
    </div>
)
