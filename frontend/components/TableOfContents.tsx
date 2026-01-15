import styles from './TableOfContents.module.css';

export type TocItem = {
    id: string;
    title: string;
    number?: number;
};

type TableOfContentsProps = {
    items: TocItem[];
    title?: string;
};

const TableOfContents = ({ items, title = "In this tutorial" }: TableOfContentsProps) => (
    <nav className={styles.toc} aria-label="Table of contents">
        <div className={styles.tocTitle}>{title}</div>
        <ol className={styles.tocList}>
            {items.map((item, index) => (
                <li key={item.id} className={styles.tocItem}>
                    <a href={`#${item.id}`} className={styles.tocLink}>
                        <span className={styles.tocNumber}>{item.number ?? index + 1}</span>
                        <span className={styles.tocText}>{item.title}</span>
                    </a>
                </li>
            ))}
        </ol>
    </nav>
);

export default TableOfContents;
