import Navbar from '@/components/layout/Navbar';
import Link from 'next/link';


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
    id: 'word-match',
    title: 'Thẻ Từ Vựng',
    description: 'Học từ vựng tiếng Anh qua hình ảnh sinh động và vui nhộn.',
    icon: '🗂️',
    color: 'var(--blue)',
    href: '/games/word-match'
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
      
      <section className="py-[100px] text-center bg-[radial-gradient(circle_at_top_right,#FFF1F1,transparent),radial-gradient(circle_at_bottom_left,#F0FFF4,transparent)] md:py-[60px]">
        <div className="container">
          <div className="max-w-[800px] mx-auto">
            <h1 className="title">Chào Mừng Bé Đến Với <br /><span className="text-primary">Kids Learn Hub</span></h1>
            <p className="text-[1.25rem] text-[#666] mb-10 leading-relaxed">Nơi học tập trở nên thú vị hơn bao giờ hết với những trò chơi trí tuệ đỉnh cao!</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-5 px-6 sm:px-0">
              <button className="bg-primary text-white px-10 py-4 rounded-full text-lg font-bold shadow-[0_4px_12px_rgba(255,107,107,0.3)] transition-transform duration-200 hover:scale-105 active:scale-95">Chơi Ngay 🚀</button>
              <button className="bg-white text-foreground px-10 py-4 rounded-full text-lg font-bold border-2 border-[#EEE] transition-all duration-200 hover:border-blue hover:text-blue active:scale-95">Khám Phá Thêm</button>
            </div>

          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="text-center text-[2.5rem] mb-[50px]">Trò Chơi Nổi Bật</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {GAMES.map((game) => (
              <Link href={game.href} key={game.id} className="p-8 text-center flex flex-col items-center card animate-pop">
                <div className="w-20 h-20 rounded-md flex items-center justify-center text-[2.5rem] mb-6 text-white shadow-[0_8px_16px_rgba(0,0,0,0.1)]" style={{ backgroundColor: game.color }}>
                  {game.icon}
                </div>
                <h3 className="text-2xl mb-3">{game.title}</h3>
                <p className="text-[#666] leading-relaxed mb-6">{game.description}</p>
                <div className="mt-auto font-bold text-primary">
                  <span>Khám phá →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-10 border-t border-[#EEE] text-center text-[#888] mt-[60px]">
        <div className="container">
          <p>© 2026 Kids Learn Hub - Kiến tạo tương lai bằng niềm vui!</p>
        </div>
      </footer>
    </main>
  );
}
