import Navbar from '@/components/layout/Navbar';
import MemoryGame from '@/components/games/memory-match/MemoryGame';
import styles from './page.module.css';

export default function MemoryMatchPage() {
  return (
    <main>
      <Navbar />
      
      <section className={styles.gameHeader}>
        <div className="container">
          <h1 className="title">🧩 Tìm Cặp Hình Giống Nhau</h1>
          <p className={styles.description}>Bé hãy lật các thẻ bài để tìm ra những cặp bạn động vật giống nhau nhé!</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <MemoryGame />
        </div>
      </section>

      <div className={styles.tips}>
        <div className="container">
          <div className={styles.tipsContent}>
            <h3>💡 Mẹo cho Bé:</h3>
            <p>Hãy cố gắng ghi nhớ vị trí của các bạn động vật khi thẻ bài được lật lên nhé!</p>
          </div>
        </div>
      </div>
    </main>
  );
}
