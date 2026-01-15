import styles from './TutorialStep.module.css';

type TutorialStepProps = {
    number: number;
    title: string;
    id: string;
    children: React.ReactNode;
};

const TutorialStep = ({ number, title, id, children }: TutorialStepProps) => (
    <div className={styles.step}>
        <h2 id={id} className={styles.stepHeader}>
            <span className={styles.stepNumber}>{number}</span>
            <span className={styles.stepTitle}>{title}</span>
        </h2>
        <div className={styles.stepContent}>
            {children}
        </div>
    </div>
);

export default TutorialStep;
