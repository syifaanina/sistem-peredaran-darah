import React, { useEffect, useRef, useState } from 'react';
import './quiz.css';

export const questions = [
  { text: 'Pada gambar, nomor 3 dan 4 menunjukkan bagian jantung yang disebut ....', options: ['Serambi kanan dan bilik kanan', 'Serambi kiri dan bilik kiri', 'Bilik kanan dan serambi kiri', 'Serambi kanan dan serambi kiri'], correct: 1, explanation: 'Nomor 3 menunjukkan serambi kiri dan nomor 4 menunjukkan bilik kiri.' },
  { text: 'Berdasarkan gambar, urutan peredaran darah besar yang benar adalah ....', options: ['8 → 10 → 1 → 2 → 3', '3 → 4 → 5 → 6 → 7', '4 → 5 → 6 → 7 → 9', '9 → 8 → 10 → 1 → 3'], correct: 2, explanation: 'Peredaran darah besar dimulai dari bilik kiri (4), menuju aorta (5), kapiler seluruh tubuh (6), vena kava (7), dan berakhir di serambi kanan (9).' },
  { text: 'Berdasarkan gambar, urutan peredaran darah kecil yang benar adalah ....', options: ['8 → 10 → 1 → 2 → 3', '4 → 5 → 6 → 7 → 9', '9 → 8 → 7 → 6 → 5', '3 → 2 → 1 → 10 → 8'], correct: 0, explanation: 'Peredaran darah kecil dimulai dari bilik kanan (8), menuju arteri pulmonalis (10), kapiler paru-paru (1), vena pulmonalis (2), dan berakhir di serambi kiri (3).' },
  { text: 'Pada gambar, nomor 1 menunjukkan bagian yang berfungsi untuk ....', options: ['Memompa darah ke seluruh tubuh', 'Menyaring zat makanan', 'Menjadi tempat pertukaran oksigen dan karbon dioksida', 'Membawa darah kembali dari tubuh ke jantung'], correct: 2, explanation: 'Nomor 1 menunjukkan kapiler paru-paru, tempat darah mengambil oksigen dan melepaskan karbon dioksida.' },
];
const letter = index => 'ABCD'[index];
const messages = { 100: 'Luar biasa! Kamu menguasai materi!', 75: 'Hebat! Sedikit lagi sempurna!', 50: 'Bagus! Ayo belajar lebih giat!', 25: 'Tetap semangat! Yuk, pelajari materinya lagi!', 0: 'Tetap semangat! Yuk, pelajari materinya lagi!' };

export default function Quiz({ onMaterial, onHome }) {
  const [phase, setPhase] = useState('intro');
  const [answers, setAnswers] = useState([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [image, setImage] = useState(`${import.meta.env.BASE_URL}reference-soal.png`);
  const [imageReady, setImageReady] = useState(false);
  const [imageError, setImageError] = useState(false);
  const objectUrl = useRef(null);
  const heading = useRef(null);
  const feedback = useRef(null);
  const question = questions[index];
  const confirmed = answers[index] !== undefined;
  const correctCount = answers.filter((answer, i) => answer === questions[i].correct).length;
  const score = correctCount * 25;
  useEffect(() => () => { if (objectUrl.current) URL.revokeObjectURL(objectUrl.current); }, []);
  useEffect(() => {
    if (phase !== 'intro') {
      heading.current?.focus({ preventScroll: true });
      heading.current?.scrollIntoView({ block: 'nearest' });
    }
  }, [phase, index]);
  useEffect(() => {
    if (confirmed) {
      feedback.current?.focus({ preventScroll: true });
      feedback.current?.scrollIntoView({ block: 'start' });
    }
  }, [confirmed]);

  function restart() { setAnswers([]); setIndex(0); setSelected(null); setPhase('question'); }
  function confirm() {
    if (selected === null || confirmed) return;
    setAnswers(previous => previous[index] === undefined ? [...previous, selected] : previous);
  }
  function next() {
    if (!confirmed) return;
    if (index === questions.length - 1) setPhase('result');
    else { setIndex(value => value + 1); setSelected(null); }
  }
  function pickImage(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) return;
    if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
    objectUrl.current = URL.createObjectURL(file);
    setImageReady(false); setImageError(false); setImage(objectUrl.current);
  }
  const imagePanel = <figure className="quiz-figure">
    <img src={image} alt="Diagram sistem peredaran darah dengan penunjuk nomor 1 sampai 10, sesuai gambar soal." hidden={imageError}
      onLoad={() => { setImageReady(true); setImageError(false); }} onError={() => { setImageReady(false); setImageError(true); }} />
    {imageError && <div className="quiz-missing"><span aria-hidden="true">▧</span><strong>Gambar bernomor belum tersedia</strong><p>Pilih gambar asli bernomor 1–10 yang diberikan guru.</p><label className="file-button">Pilih gambar<input type="file" accept="image/png,image/jpeg,image/webp" onChange={pickImage} /></label><small>Gambar hanya dibuka di browser, tanpa diunggah.</small></div>}
    <figcaption>Amati nomor dan arah panah pada gambar.</figcaption>
  </figure>;

  if (phase === 'result') return <div className="quiz-results">
    {score === 100 && <div className="quiz-confetti" aria-hidden="true">{Array.from({ length: 24 }, (_, i) => <i key={i} style={{ '--i': i, left: `${(i * 37) % 100}%`, background: ['#e95570', '#56a9df', '#f8c34d', '#7bbf96'][i % 4] }} />)}</div>}
    <span className="result-star" aria-hidden="true">★</span><h3 tabIndex="-1" ref={heading}>SELAMAT! KAMU TELAH MENYELESAIKAN KUIS!</h3>
    <div className="quiz-score"><strong>{score}</strong><span>dari 100 poin</span></div>
    <p className="quiz-motivation">{messages[score]}</p>
    <div className="quiz-totals"><span>✓ <strong>{correctCount}</strong> jawaban benar</span><span>✕ <strong>{questions.length - correctCount}</strong> jawaban salah</span></div>
    <div className="quiz-result-actions"><button className="lesson-primary" onClick={restart}>Ulangi Kuis</button><button onClick={onMaterial}>Kembali ke Materi</button><button onClick={onHome}>Kembali ke Beranda</button></div>
  </div>;

  return <div className="quiz-layout">
    {imagePanel}
    {phase === 'intro' ? <div className="quiz-intro"><span className="lesson-pill">Tantangan kecil, pengetahuan besar!</span><h3>Siap menjadi penjelajah tubuh?</h3><p>Amati gambar, lalu pilih jawaban yang paling tepat.</p><ul><li>4 soal pilihan ganda</li><li>25 poin untuk setiap jawaban benar</li><li>Baca pembahasan sebelum melanjutkan</li></ul><button className="lesson-primary" disabled={!imageReady} onClick={restart}>Mulai Kuis →</button><p className="quiz-help">Tidak perlu terburu-buru. Kamu pasti bisa!</p></div> : <div className="quiz-question" key={index}>
      <div className="quiz-question-meta"><strong>Soal {index + 1} dari {questions.length}</strong><span>{answers.length} dari 4 selesai</span></div>
      <div className="quiz-progress" role="progressbar" aria-label="Soal selesai" aria-valuemin="0" aria-valuemax="4" aria-valuenow={answers.length}><span style={{ width: `${answers.length / questions.length * 100}%` }} /></div>
      <h3 ref={heading} tabIndex="-1" id={`question-${index}`}>{question.text}</h3>
      <fieldset className="quiz-options" disabled={confirmed} aria-labelledby={`question-${index}`}>
        <legend className="sr-only">Pilih satu jawaban</legend>
        {question.options.map((option, i) => <label key={option} className={`quiz-option ${selected === i ? 'selected' : ''} ${confirmed && i === question.correct ? 'correct' : ''} ${confirmed && selected === i && i !== question.correct ? 'incorrect' : ''}`}>
          <input type="radio" name={`answer-${index}`} value={i} checked={selected === i} onChange={() => setSelected(i)} />
          <span className="option-letter">{letter(i)}</span><span>{option}</span>{confirmed && i === question.correct && <span aria-label="Jawaban benar">✓</span>}
        </label>)}
      </fieldset>
      {!confirmed ? <button className="lesson-primary quiz-submit" disabled={selected === null} onClick={confirm}>Jawab dan Lanjutkan</button> : <>
        <div className={`quiz-feedback ${selected === question.correct ? 'right' : 'wrong'}`} ref={feedback} tabIndex="-1" role="status">
          <strong><span className="feedback-symbol" aria-hidden="true">{selected === question.correct ? '✓' : '↻'}</span>{selected === question.correct ? 'Hebat! Jawabanmu benar!' : 'Belum tepat, yuk pelajari jawabannya!'}</strong>
          {selected !== question.correct && <p><b>Jawaban benar: {letter(question.correct)}. {question.options[question.correct]}</b></p>}<p>{question.explanation}</p>
        </div><button className="lesson-primary quiz-submit" onClick={next}>{index === questions.length - 1 ? 'Lihat Hasil Kuis' : 'Soal Selanjutnya'}</button>
      </>}
    </div>}
  </div>;
}
