
import styles from './Divider.module.css'

export default function Divider({spacing}) {
    return (
        <div className={styles.divider} style={{height: `${spacing}rem`}}/>
    )
}