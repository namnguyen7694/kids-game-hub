import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={`${styles.container} container`}>
        <Link href="/" className={styles.logo}>
          <span className={styles.icon}>🎮</span>
          Kids<span>Learn</span>Hub
        </Link>
        <div className={styles.links}>
          <Link href="/" className={styles.link}>Trang chủ</Link>
          <Link href="/games/memory-match" className={`${styles.link} ${styles.active}`}>Trò chơi</Link>
          <button className={styles.cta}>Bắt đầu học!</button>
        </div>
      </div>
    </nav>
  );
}
