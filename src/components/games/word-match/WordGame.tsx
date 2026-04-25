'use client';

import { useState } from 'react';
import WordCard from './WordCard';
import styles from './WordGame.module.css';
import Link from 'next/link';

interface Vocabulary {
  emoji: string;
  en: string;
  vi: string;
  category: string;
}

const VOCABULARY: Vocabulary[] = [
  // Animals
  { emoji: '🦁', en: 'Lion', vi: 'Sư tử', category: 'animals' },
  { emoji: '🐘', en: 'Elephant', vi: 'Con voi', category: 'animals' },
  { emoji: '🦒', en: 'Giraffe', vi: 'Hươu cao cổ', category: 'animals' },
  { emoji: '🦓', en: 'Zebra', vi: 'Ngựa vằn', category: 'animals' },
  { emoji: '🐢', en: 'Turtle', vi: 'Con rùa', category: 'animals' },
  { emoji: '🦋', en: 'Butterfly', vi: 'Con bướm', category: 'animals' },
  { emoji: '🐒', en: 'Monkey', vi: 'Con khỉ', category: 'animals' },
  { emoji: '🐼', en: 'Panda', vi: 'Gấu trúc', category: 'animals' },
  { emoji: '🐨', en: 'Koala', vi: 'Gấu túi', category: 'animals' },
  { emoji: '🐧', en: 'Penguin', vi: 'Chim cánh cụt', category: 'animals' },
  { emoji: '🐯', en: 'Tiger', vi: 'Con hổ', category: 'animals' },
  { emoji: '🦊', en: 'Fox', vi: 'Con cáo', category: 'animals' },
  { emoji: '🦉', en: 'Owl', vi: 'Con cú', category: 'animals' },
  { emoji: '🦈', en: 'Shark', vi: 'Cá mập', category: 'animals' },
  { emoji: '🐬', en: 'Dolphin', vi: 'Cá heo', category: 'animals' },
  { emoji: '🐙', en: 'Octopus', vi: 'Bạch tuộc', category: 'animals' },
  { emoji: '🦘', en: 'Kangaroo', vi: 'Chuột túi', category: 'animals' },
  
  // Fruits
  { emoji: '🍎', en: 'Apple', vi: 'Quả táo', category: 'fruits' },
  { emoji: '🍌', en: 'Banana', vi: 'Quả chuối', category: 'fruits' },
  { emoji: '🍉', en: 'Watermelon', vi: 'Dưa hấu', category: 'fruits' },
  { emoji: '🍇', en: 'Grapes', vi: 'Quả nho', category: 'fruits' },
  { emoji: '🍓', en: 'Strawberry', vi: 'Dâu tây', category: 'fruits' },
  { emoji: '🥝', en: 'Kiwi', vi: 'Quả kiwi', category: 'fruits' },
  { emoji: '🍍', en: 'Pineapple', vi: 'Quả dứa', category: 'fruits' },
  { emoji: '🍒', en: 'Cherry', vi: 'Quả anh đào', category: 'fruits' },
  { emoji: '🍊', en: 'Orange', vi: 'Quả cam', category: 'fruits' },
  { emoji: '🍋', en: 'Lemon', vi: 'Quả chanh', category: 'fruits' },
  { emoji: '🥭', en: 'Mango', vi: 'Quả xoài', category: 'fruits' },
  { emoji: '🍈', en: 'Melon', vi: 'Quả dưa', category: 'fruits' },
  { emoji: '🍐', en: 'Pear', vi: 'Quả lê', category: 'fruits' },
  { emoji: '🥥', en: 'Coconut', vi: 'Quả dừa', category: 'fruits' },
  { emoji: '🫐', en: 'Blueberry', vi: 'Quả việt quất', category: 'fruits' },
  { emoji: '🍑', en: 'Peach', vi: 'Quả đào', category: 'fruits' },
  { emoji: '🥑', en: 'Avocado', vi: 'Quả bơ', category: 'fruits' },
  { emoji: '🍅', en: 'Tomato', vi: 'Quả cà chua', category: 'fruits' },

  // Vehicles
  { emoji: '🚗', en: 'Car', vi: 'Ô tô', category: 'vehicles' },
  { emoji: '🚀', en: 'Rocket', vi: 'Tên lửa', category: 'vehicles' },
  { emoji: '🚲', en: 'Bicycle', vi: 'Xe đạp', category: 'vehicles' },
  { emoji: '🚁', en: 'Helicopter', vi: 'Trực thăng', category: 'vehicles' },
  { emoji: '⛵', en: 'Sailboat', vi: 'Thuyền buồm', category: 'vehicles' },
  { emoji: '🚂', en: 'Train', vi: 'Tàu hỏa', category: 'vehicles' },
  { emoji: '🚌', en: 'Bus', vi: 'Xe buýt', category: 'vehicles' },
  { emoji: '✈️', en: 'Airplane', vi: 'Máy bay', category: 'vehicles' },
  { emoji: '🚑', en: 'Ambulance', vi: 'Xe cứu thương', category: 'vehicles' },
  { emoji: '🚒', en: 'Fire Truck', vi: 'Xe cứu hỏa', category: 'vehicles' },
  { emoji: '🚢', en: 'Ship', vi: 'Tàu thủy', category: 'vehicles' },
  { emoji: '🏍️', en: 'Motorcycle', vi: 'Xe máy', category: 'vehicles' },
  { emoji: '🚜', en: 'Tractor', vi: 'Máy kéo', category: 'vehicles' },
  { emoji: '🚤', en: 'Speedboat', vi: 'Tàu cao tốc', category: 'vehicles' },

  // Weather
  { emoji: '☀️', en: 'Sun', vi: 'Mặt trời', category: 'weather' },
  { emoji: '☁️', en: 'Cloud', vi: 'Đám mây', category: 'weather' },
  { emoji: '🌧️', en: 'Rain', vi: 'Cơn mưa', category: 'weather' },
  { emoji: '❄️', en: 'Snow', vi: 'Tuyết', category: 'weather' },
  { emoji: '🌩️', en: 'Thunder', vi: 'Sấm sét', category: 'weather' },
  { emoji: '🌈', en: 'Rainbow', vi: 'Cầu vồng', category: 'weather' },
  { emoji: '🌬️', en: 'Wind', vi: 'Gió', category: 'weather' },
  { emoji: '🌋', en: 'Volcano', vi: 'Núi lửa', category: 'weather' },
  { emoji: '🌊', en: 'Wave', vi: 'Sóng biển', category: 'weather' },
  { emoji: '🌪️', en: 'Tornado', vi: 'Lốc xoáy', category: 'weather' },

  // Sports
  { emoji: '⚽', en: 'Soccer', vi: 'Bóng đá', category: 'sports' },
  { emoji: '🏀', en: 'Basketball', vi: 'Bóng rổ', category: 'sports' },
  { emoji: '🎾', en: 'Tennis', vi: 'Quần vợt', category: 'sports' },
  { emoji: '🏐', en: 'Volleyball', vi: 'Bóng chuyền', category: 'sports' },
  { emoji: '🎿', en: 'Skiing', vi: 'Trượt tuyết', category: 'sports' },
  { emoji: '🎱', en: 'Billiards', vi: 'Bi-a', category: 'sports' },
  { emoji: '🎯', en: 'Darts', vi: 'Phi tiêu', category: 'sports' },
  { emoji: '🎳', en: 'Bowling', vi: 'Bowling', category: 'sports' },
  { emoji: '🥊', en: 'Boxing', vi: 'Quyền anh', category: 'sports' },
  { emoji: '🥋', en: 'Martial Arts', vi: 'Võ thuật', category: 'sports' },

  // Objects
  { emoji: '🏠', en: 'House', vi: 'Ngôi nhà', category: 'objects' },
  { emoji: '🎨', en: 'Palette', vi: 'Bảng màu', category: 'objects' },
  { emoji: '🎸', en: 'Guitar', vi: 'Đàn ghi-ta', category: 'objects' },
  { emoji: '📚', en: 'Books', vi: 'Sách', category: 'objects' },
  { emoji: '🎁', en: 'Gift', vi: 'Quà tặng', category: 'objects' },
  { emoji: '🧸', en: 'Teddy Bear', vi: 'Gấu bông', category: 'objects' },
];

const CATEGORIES = [
  { id: 'all', label: 'Tất cả', icon: '🌟' },
  { id: 'animals', label: 'Động vật', icon: '🦁' },
  { id: 'fruits', label: 'Trái cây', icon: '🍎' },
  { id: 'vehicles', label: 'Phương tiện', icon: '🚀' },
  { id: 'weather', label: 'Thời tiết', icon: '🌈' },
  { id: 'sports', label: 'Thể thao', icon: '⚽' },
  { id: 'objects', label: 'Đồ vật', icon: '🧸' },
];

export default function WordGame() {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredVocab = activeCategory === 'all' 
    ? VOCABULARY 
    : VOCABULARY.filter(v => v.category === activeCategory);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Thẻ Từ Vựng Thông Minh</h1>
      <p>Nhấn vào từng thẻ để học từ vựng tiếng Anh và tiếng Việt nhé!</p>

      <div className={styles.controls}>
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            className={`${styles.categoryBtn} ${activeCategory === cat.id ? styles.active : ''}`}
            onClick={() => setActiveCategory(cat.id)}
          >
            <span className={styles.categoryIcon}>{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </div>

      <div className={styles.grid}>
        {filteredVocab.map((vocab, index) => (
          <WordCard 
            key={`${vocab.en}-${index}`}
            emoji={vocab.emoji}
            en={vocab.en}
            vi={vocab.vi}
          />
        ))}
      </div>

      <div className={styles.footer}>
        <Link href="/">
          <button className={styles.backBtn}>← Quay lại trang chủ</button>
        </Link>
      </div>
    </div>
  );
}
