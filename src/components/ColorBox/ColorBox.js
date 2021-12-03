import styles from './ColorBox.module.css';

export default function ColorBox(props) {
    const {color, children} = props;

    return (
        <div
            { ...props }
            style={{backgroundColor: color}}
            className={props.className ? `${props.className} ${styles.colorBox}` : styles.colorBox}
        >
            {children}
        </div>
    )
}