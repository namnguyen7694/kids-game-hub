"use client";

import { useState } from "react";
import WordCard from "./WordCard";
import styles from "./WordGame.module.css";
import Link from "next/link";
import { VOCABULARY, CATEGORIES } from "../../../../constants";

export default function WordGame() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredVocab = activeCategory === "all" ? VOCABULARY : VOCABULARY.filter((v) => v.category === activeCategory);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Thẻ Từ Vựng Thông Minh</h1>
      <p>Nhấn vào từng thẻ để học từ vựng tiếng Anh và tiếng Việt nhé!</p>

      <div className={styles.controls}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            className={`${styles.categoryBtn} ${activeCategory === cat.id ? styles.active : ""}`}
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
            phonetic={vocab.phonetic}
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
