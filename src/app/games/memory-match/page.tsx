import Navbar from '@/components/layout/Navbar';
import MemoryGame from '@/components/games/memory-match/MemoryGame';
export default function MemoryMatchPage() {
  return (
    <main>
      <Navbar />
      
      <section className="bg-white pt-[60px] pb-5 text-center">
        <div className="container">
          <h1 className="title">🧩 Tìm Cặp Hình Giống Nhau</h1>
          <p className="text-[1.25rem] text-[#666] max-w-[600px] mx-auto">Bé hãy lật các thẻ bài để tìm ra những cặp bạn động vật giống nhau nhé!</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <MemoryGame />
        </div>
      </section>

      <div className="pb-[80px]">
        <div className="container">
          <div className="bg-[#FFF9DB] p-8 rounded-md border-2 border-dashed border-[#FAB005] text-center">
            <h3 className="text-[#E67E22] mb-2">💡 Mẹo cho Bé:</h3>
            <p className="text-[#666]">Hãy cố gắng ghi nhớ vị trí của các bạn động vật khi thẻ bài được lật lên nhé!</p>
          </div>
        </div>
      </div>
    </main>
  );
}

