import React, { useEffect, useRef, useState } from 'react';
import App from './App.jsx';
import Quiz from './Quiz.jsx';

const titles = ['Ayo mulai!', 'Apa itu peredaran darah?', 'Organ dan komponennya', 'Jantung dan pembuluh darah', 'Kenali komponen darah', 'Ikuti perjalanan darah', 'Mengapa peredaran darah penting?', 'AYO UJI PEMAHAMANMU!'];
const organs = [
  ['heart', 'Jantung', 'Berfungsi memompa darah ke seluruh tubuh dan paru-paru.', 'Jantung bekerja seperti pompa. Setiap denyut membantu darah terus mengalir.'],
  ['vessel', 'Pembuluh darah', 'Merupakan saluran tempat darah mengalir.', 'Pembuluh darah membentuk jaringan saluran yang menghubungkan jantung dengan seluruh tubuh.'],
  ['drop', 'Darah', 'Mengangkut oksigen, zat makanan, dan zat lainnya.', 'Darah mengantar kebutuhan tubuh dan membawa zat sisa untuk dikeluarkan.'],
];
const components = [
  ['red', 'Sel darah merah', 'Mengangkut oksigen.', 'Oksigen dari paru-paru dibawa menuju sel-sel tubuh oleh sel darah merah.'],
  ['white', 'Sel darah putih', 'Membantu melawan kuman penyakit.', 'Sel darah putih membantu menjaga tubuh dengan melawan kuman yang masuk.'],
  ['platelet', 'Keping darah', 'Membantu proses pembekuan darah.', 'Saat terluka, keping darah membantu menutup luka agar perdarahan berhenti.'],
  ['plasma', 'Plasma darah', 'Mengangkut zat makanan dan berbagai zat lainnya.', 'Plasma adalah bagian cair darah yang sebagian besar terdiri atas air.'],
];

function Illustration({ kind, className = '' }) {
  return <svg className={`lesson-illustration ${className}`} viewBox="0 0 240 200" aria-hidden="true">
    <circle cx="120" cy="100" r="88" fill={kind === 'heart' || kind === 'drop' || kind === 'red' ? '#fff0f0' : '#eaf6ff'} />
    {kind === 'heart' && <g className="beating-heart">
      <path d="M112 67V30M135 69V24M157 78L179 47" fill="none" stroke="#438dd9" strokeWidth="17" strokeLinecap="round" />
      <path d="M120 167C99 151 55 120 58 84C61 52 101 47 120 73C141 46 180 54 183 85C186 119 144 153 120 167Z" fill="#ee4b61" stroke="#cd344b" strokeWidth="4" />
      <path d="M120 78C103 98 146 121 121 159M78 91L111 108M161 91L134 111" fill="none" stroke="#ffc0c5" strokeWidth="6" strokeLinecap="round" />
    </g>}
    {kind === 'vessel' && <g fill="none" strokeLinecap="round"><path d="M45 155C130 160 73 40 191 47" stroke="#ef586b" strokeWidth="25" /><path d="M44 112C106 114 111 167 190 112" stroke="#459cdd" strokeWidth="19" /><path d="M48 150C125 153 82 38 186 42" stroke="#ffbcc5" strokeWidth="5" /></g>}
    {kind === 'drop' && <path d="M120 30C110 67 72 99 72 129A48 48 0 0 0 168 129C168 99 130 67 120 30Z" fill="#ed445f" />}
    {kind === 'red' && <g fill="#ec4a61" stroke="#bd3048" strokeWidth="4"><ellipse cx="105" cy="88" rx="48" ry="30" transform="rotate(-25 105 88)" /><ellipse cx="105" cy="88" rx="24" ry="12" fill="#c8334d" transform="rotate(-25 105 88)" /><ellipse cx="151" cy="133" rx="37" ry="23" transform="rotate(20 151 133)" /></g>}
    {kind === 'white' && <g><circle cx="120" cy="103" r="56" fill="#fff" stroke="#b5a5e1" strokeWidth="5" /><path d="M100 75C69 87 100 127 113 109C117 146 160 125 147 105C172 73 127 64 120 84C111 71 108 72 100 75Z" fill="#9876c9" /><g fill="#daccec"><circle cx="85" cy="113" r="5" /><circle cx="138" cy="62" r="4" /><circle cx="146" cy="139" r="5" /></g></g>}
    {kind === 'platelet' && <g fill="#b28ada" stroke="#8b62b9" strokeWidth="3"><path d="M90 52L102 68L125 62L119 85L135 102L112 108L105 128L88 114L68 120L72 96L56 81L79 73Z" /><path d="M158 113L171 105L175 123L191 132L175 142L173 160L157 151L140 156L142 136L132 124Z" /></g>}
    {kind === 'plasma' && <g><path d="M120 30C110 67 72 99 72 129A48 48 0 0 0 168 129C168 99 130 67 120 30Z" fill="#f5c75f" /><circle cx="104" cy="119" r="8" fill="#fff0b9" /><circle cx="132" cy="144" r="11" fill="#ffe9a0" /></g>}
  </svg>;
}

function VesselFlow() {
  return <div className="vessel-demo">
    <svg viewBox="0 0 700 170" role="img" aria-label="Ilustrasi sel darah merah mengalir di dalam pembuluh darah">
      <path d="M-20 85H720" stroke="#f8c1cc" strokeWidth="104" />
      <path d="M-20 85H720" stroke="#fff0f3" strokeWidth="80" />
      {Array.from({ length: 7 }, (_, i) => <g key={i} className="flow-cell" style={{ animationDelay: `${-i * 1.1}s` }}>
        <ellipse cx="0" cy="85" rx="24" ry="16" fill="#ee5068" /><ellipse cx="0" cy="85" rx="11" ry="7" fill="#c92e49" />
      </g>)}
      <path d="M300 137H400L389 130M400 137L389 144" fill="none" stroke="#c6314b" strokeWidth="4" />
    </svg>
    <span>Darah terus bergerak melalui pembuluh darah.</span>
  </div>;
}

function InteractiveCards({ items }) {
  const [selected, setSelected] = useState(0);
  const item = items[selected];
  return <>
    <div className={`lesson-cards cards-${items.length}`}>
      {items.map(([kind, name, description], index) => <button key={name} className={`lesson-card ${selected === index ? 'chosen' : ''}`}
        aria-pressed={selected === index} aria-controls={`detail-${items[0][0]}`} onClick={() => setSelected(index)}>
        <Illustration kind={kind} /><h3>{name}</h3><p>{description}</p><span className="card-hint">{selected === index ? 'Sedang dipilih' : 'Klik untuk mengenal'}</span>
      </button>)}
    </div>
    <div className="card-detail" id={`detail-${items[0][0]}`} aria-live="polite" aria-atomic="true">
      <Illustration kind={item[0]} /><p><strong>{item[1]}</strong>{item[3]}</p>
    </div>
  </>;
}

function HeartDiagram() {
  return <svg className="heart-diagram" viewBox="0 0 580 360" role="img" aria-label="Skema empat ruang jantung: serambi kanan dan bilik kanan pada kiri gambar, serambi kiri dan bilik kiri pada kanan gambar.">
    <path d="M280 80V35M305 80V25" stroke="#e95165" strokeWidth="18" fill="none" strokeLinecap="round" />
    <path d="M244 80V32M335 82L361 43" stroke="#4196da" strokeWidth="16" fill="none" strokeLinecap="round" />
    <path d="M285 91C240 36 184 83 189 153C190 229 229 276 285 310C344 277 390 221 387 151C383 75 326 39 285 91Z" fill="#fff0f1" stroke="#ed6376" strokeWidth="7" />
    <path d="M272 104C218 61 200 112 208 155Q234 181 273 165Z" fill="#8ccdf3" />
    <path d="M298 104C345 63 373 112 365 155Q336 181 298 165Z" fill="#ff9bab" />
    <path d="M211 187Q249 176 273 188L273 280Q218 244 211 187Z" fill="#479fdf" />
    <path d="M299 188Q332 176 363 187Q352 245 299 280Z" fill="#ee536a" />
    <g stroke="#59778e" strokeWidth="2" fill="none"><path d="M240 134H158M241 221H158M333 134H420M332 221H420" /></g>
    <g fill="#25465f" fontSize="19" fontWeight="700"><text x="15" y="140">Serambi kanan</text><text x="40" y="227">Bilik kanan</text><text x="425" y="140">Serambi kiri</text><text x="425" y="227">Bilik kiri</text></g>
    <text x="290" y="347" textAnchor="middle" fontSize="15" fill="#648094">Skema sederhana · kanan tubuh berada di kiri gambar</text>
  </svg>;
}

export default function Presentation() {
  const [slide, setSlide] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [notice, setNotice] = useState('');
  const deck = useRef(null);
  const content = useRef(null);
  const move = amount => setSlide(value => Math.max(0, Math.min(titles.length - 1, value + amount)));

  useEffect(() => {
    const onKey = event => {
      if (slide === 7 || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey ||
        event.target.closest('input, select, textarea, [contenteditable="true"], .diagram-viewport')) return;
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        event.preventDefault();
        move(event.key === 'ArrowRight' ? 1 : -1);
      }
    };
    const onFullscreen = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('keydown', onKey);
    document.addEventListener('fullscreenchange', onFullscreen);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('fullscreenchange', onFullscreen);
    };
  }, [slide]);

  useEffect(() => {
    content.current?.scrollTo({ top: 0, left: 0 });
    // Move focus out of any panel that has just become hidden.
    if (deck.current?.querySelector('[hidden]')?.contains(document.activeElement) ||
      document.activeElement?.closest('.slide-panel[hidden]')) content.current?.focus({ preventScroll: true });
  }, [slide]);

  async function toggleFullscreen() {
    try {
      setNotice('');
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (deck.current.requestFullscreen) await deck.current.requestFullscreen();
      else setNotice('Layar penuh tidak tersedia di browser ini. Gunakan menu layar penuh pada browser.');
    } catch {
      setNotice('Layar penuh belum dapat dibuka. Coba melalui menu layar penuh pada browser.');
    }
  }

  return <div className="presentation" ref={deck}>
    <div className="deck-toolbar">
      <div className="toolbar-links"><button className="home-button" onClick={() => setSlide(0)} aria-label="Kembali ke slide pembuka">⌂ <span>Beranda</span></button><button aria-current={slide === 7 ? 'page' : undefined} onClick={() => setSlide(7)}>Kuis</button></div>
      <span className="deck-brand"><i /> JELAJAH TUBUH <small>IPAS · KELAS 5</small></span>
      <button onClick={toggleFullscreen}>{fullscreen ? '⤢ Keluar layar penuh' : '⛶ Layar penuh'}</button>
    </div>
    {notice && <p className="deck-notice" role="status">{notice}</p>}
    <div className="slide-frame">
      <div className="slide-scroll" ref={content} tabIndex="-1">
        {titles.map((title, index) => <section key={title} hidden={slide !== index} className={`slide-panel slide-${index + 1}`} aria-label={`Slide ${index + 1}: ${title}`}>
          <div className="slide-kicker"><span>JELAJAH {String(index + 1).padStart(2, '0')}</span><span>SISTEM PEREDARAN DARAH</span></div>
          {index !== 0 && <h2>{title}</h2>}
          {index === 0 && <div className="cover-grid">
            <div><span className="lesson-pill">Kenali tubuhmu, yuk!</span><h1>SISTEM<br />PEREDARAN<br /><em>DARAH MANUSIA</em></h1><p>Media Pembelajaran IPAS Kelas 5 SD</p><button className="lesson-primary" onClick={() => setSlide(1)}>Mulai Belajar <span>→</span></button></div>
            <div className="cover-art"><Illustration kind="heart" /><span className="art-badge badge-one">♥ Memompa darah</span><span className="art-badge badge-two">O₂ Membawa oksigen</span><p>Satu tubuh, perjalanan yang luar biasa!</p></div>
          </div>}
          {index === 1 && <div className="definition-layout"><div className="definition-copy"><span className="lesson-pill">Jaringan pengantar dalam tubuh</span><p>Sistem peredaran darah adalah sistem di dalam tubuh manusia yang berfungsi <strong>mengalirkan darah ke seluruh tubuh.</strong></p><div className="oxygen-note"><span>O₂</span><p>Darah membawa <strong>oksigen dan zat makanan</strong> yang dibutuhkan oleh tubuh.</p></div></div><VesselFlow /></div>}
          {index === 2 && <><p className="slide-lead">Tiga bagian ini bekerja sama. Klik kartunya untuk mengenal lebih dekat!</p><InteractiveCards items={organs} /></>}
          {index === 3 && <div className="anatomy-grid"><div className="heart-board"><h3>Empat ruang jantung</h3><HeartDiagram /><p>Serambi menerima darah. Bilik memompa darah keluar.</p></div><div className="vessel-list"><h3>Tiga jenis pembuluh darah</h3>{[['Arteri', 'Membawa darah keluar dari jantung.', '→', 'artery'], ['Vena', 'Membawa darah kembali ke jantung.', '←', 'vein'], ['Kapiler', 'Tempat pertukaran zat antara darah dan jaringan tubuh.', '↔', 'capillary']].map(([name, text, icon, cls]) => <div className={`vessel-item ${cls}`} key={name}><span>{icon}</span><p><strong>{name}</strong>{text}</p></div>)}</div></div>}
          {index === 4 && <><p className="slide-lead">Setiap komponen punya tugas. Klik untuk mencari tahu!</p><InteractiveCards items={components} /></>}
          {index === 5 && <><p className="slide-lead">Pilih jalurnya, tekan Mulai, lalu amati perjalanan tetesan darah.</p><App active={slide === 5} embedded /></>}
          {index === 6 && <><p className="slide-lead">Darah berkeliling agar tubuh dapat bekerja dengan baik.</p><div className="function-grid">{[
            ['O₂', 'Mengantar oksigen', 'Mengedarkan oksigen ke seluruh tubuh.'],
            ['◉', 'Mengantar zat makanan', 'Mengangkut zat makanan ke sel-sel tubuh.'],
            ['CO₂', 'Membawa zat sisa', 'Membawa karbon dioksida dan zat sisa untuk dikeluarkan.'],
            ['✚', 'Melindungi tubuh', 'Membantu tubuh melawan penyakit.'],
            ['°C', 'Mengatur suhu', 'Membantu mengatur suhu tubuh.'],
          ].map(([symbol, title, text], i) => <article className="function-card" key={title} style={{ '--card-order': i }}><span className="function-icon">{symbol}</span><h3>{title}</h3><p>{text}</p></article>)}</div><p className="closing-note">Hebat! Sekarang kamu sudah mengenal perjalanan darah di dalam tubuh.</p></>}
          {index === 7 && <><p className="slide-lead">Kuis Sistem Peredaran Darah Manusia — IPAS Kelas 5 SD</p><Quiz onMaterial={() => setSlide(1)} onHome={() => setSlide(0)} /></>}
        </section>)}
      </div>
    </div>
    <div className="deck-navigation">
      <button disabled={slide === 0} onClick={() => move(-1)}>← Sebelumnya</button>
      <div className="slide-indicator"><span aria-live="polite">Slide <strong>{slide + 1}</strong> / {titles.length}</span><div className="slide-dots" aria-label="Pilih slide">{titles.map((title, index) => <button key={title} aria-label={`Slide ${index + 1}: ${title}`} aria-current={slide === index ? 'step' : undefined} onClick={() => setSlide(index)} />)}</div></div>
      <button className="lesson-primary" disabled={slide === titles.length - 1} onClick={() => move(1)}>Selanjutnya →</button>
    </div>
    <div className="deck-progress" role="progressbar" aria-label="Kemajuan presentasi" aria-valuemin="1" aria-valuemax={titles.length} aria-valuenow={slide + 1}><span style={{ width: `${(slide + 1) / titles.length * 100}%` }} /></div>
    <p className="keyboard-hint">{slide === 7 ? 'Jawaban tetap tersimpan saat membuka materi. Panah keyboard tidak memindahkan slide kuis.' : 'Gunakan tombol ← → pada keyboard untuk berpindah slide.'}</p>
  </div>;
}
