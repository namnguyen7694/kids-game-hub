import Navbar from '@/components/layout/Navbar';
import Link from 'next/link';
import styles from './page.module.css';

const GAMES = [
  {
    id: 'memory-match',
    title: 'Tìm Cặp Hình',
    description: 'Rèn luyện trí nhớ bằng cách tìm các cặp hình giống nhau.',
    icon: '🧩',
    color: 'var(--primary)',
    href: '/games/memory-match'
  },
  {
    id: 'logic-puzzles',
    title: 'Giải Mã Logic',
    description: 'Thử thách tư duy với những câu đố logic hóc búa.',
    icon: '🧠',
    color: 'var(--blue)',
    href: '#'
  },
  {
    id: 'math-adventure',
    title: 'Toán Học Vui',
    description: 'Vừa chơi vừa học cộng trừ nhân chia siêu tốc.',
    icon: '🔢',
    color: 'var(--secondary)',
    href: '#'
  }
];

export default function Home() {
  return (
    <main>
      <Navbar />
      
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroContent}>
            <h1 className="title">Chào Mừng Bé Đến Với <br /><span>Kids Learn Hub</span></h1>
            <p className={styles.heroSub}>Nơi học tập trở nên thú vị hơn bao giờ hết với những trò chơi trí tuệ đỉnh cao!</p>
            <div className={styles.heroActions}>
              <button className={styles.primaryBtn}>Chơi Ngay 🚀</button>
              <button className={styles.secondaryBtn}>Khám Phá Thêm</button>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className={styles.sectionTitle}>Trò Chơi Nổi Bật</h2>
          <div className={styles.grid}>
            {GAMES.map((game) => (
              <Link href={game.href} key={game.id} className={`${styles.gameCard} card animate-pop`}>
                <div className={styles.gameIcon} style={{ backgroundColor: game.color }}>
                  {game.icon}
                </div>
                <h3>{game.title}</h3>
                <p>{game.description}</p>
                <div className={styles.cardFooter}>
                  <span>Khám phá →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className="container">
          <p>© 2026 Kids Learn Hub - Kiến tạo tương lai bằng niềm vui!</p>
        </div>
      </footer>
    </main>
  );
}
