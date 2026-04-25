import WordGame from '@/components/games/word-match/WordGame';
import Navbar from '@/components/layout/Navbar';

export const metadata = {
  title: 'Thẻ Từ Vựng - Kids Learn Hub',
  description: 'Học từ vựng tiếng Anh qua hình ảnh sinh động.',
};

export default function WordMatchPage() {
  return (
    <main>
      <Navbar />
      <section className="section">
        <div className="container">
          <WordGame />
        </div>
      </section>
    </main>
  );
}
