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
    children: React.ReactNode;
    className?: string;
}

export const ConsoleCommand = ({ children, className }: ConsoleCommandProps) => (
    <div className={`${styles.line} ${className || ''}`}>
        <span className={styles.linestart}>$</span>
        {children}
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
