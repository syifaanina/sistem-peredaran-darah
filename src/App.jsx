import React, { useEffect, useRef, useState } from 'react';
import { BLUE, RED, routes, particleColor } from './routes.js';

const COUNT = 36;
const SPACING = 94;
const PIXELS_PER_SECOND = 88;
const DEFAULT_IMAGE = `${import.meta.env.BASE_URL}reference.png`;

export default function App({ active = true, embedded = false }) {
  const [mode, setMode] = useState('kecil');
  const [status, setStatus] = useState('ready');
  const [speed, setSpeed] = useState(1);
  const [debug, setDebug] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [source, setSource] = useState(DEFAULT_IMAGE);
  const [imageReady, setImageReady] = useState(false);
  const [error, setError] = useState('');
  const [stage, setStage] = useState(0);
  const paths = useRef([]);
  const dots = useRef([]);
  const halos = useRef([]);
  const elapsed = useRef(0);
  const started = useRef(false);
  const geometry = useRef([]);
  const objectUrl = useRef(null);
  const route = routes[mode];

  useEffect(() => {
    if (!active) setStatus(value => value === 'running' ? 'paused' : value);
  }, [active]);

  useEffect(() => {
    geometry.current = paths.current.map(path => ({ path, length: path.getTotalLength() }));
    elapsed.current = 0;
    started.current = false;
    dots.current.forEach(dot => dot?.setAttribute('opacity', '0'));
    halos.current.forEach(halo => halo?.setAttribute('opacity', '0'));
    setStage(0);
  }, [mode]);

  useEffect(() => () => {
    if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
  }, []);

  useEffect(() => {
    if (status !== 'running' || !imageReady || !active) return;
    let frame;
    let last = null;
    const tick = now => {
      // Reset the clock after backgrounding; never jump ahead on return.
      if (document.hidden) last = null;
      else {
        if (last !== null) elapsed.current += Math.min((now - last) / 1000, 0.08) * speed;
        last = now;
        const sections = geometry.current;
        const total = sections.reduce((sum, part) => sum + part.length, 0);
        const distance = elapsed.current * PIXELS_PER_SECOND;
        const occupancy = [0, 0, 0];
        const period = Math.ceil((total + 24) / SPACING) * SPACING;
        dots.current.forEach((dot, index) => {
          // Emit regularly at the start. Hide between end and re-emission,
          // rather than drawing a false line between the two heart chambers.
          const raw = distance - index * SPACING;
          let position = ((raw % period) + period) % period;
          if (index >= Math.ceil(period / SPACING) || raw < 0 || position > total) {
            dot.setAttribute('opacity', '0');
            return;
          }
          let section = 0;
          while (section < sections.length - 1 && position > sections[section].length) {
            position -= sections[section].length;
            section++;
          }
          const part = sections[section];
          const point = part.path.getPointAtLength(position);
          const before = part.path.getPointAtLength(Math.max(0, position - 1));
          const after = part.path.getPointAtLength(Math.min(part.length, position + 1));
          const angle = Math.atan2(after.y - before.y, after.x - before.x) * 180 / Math.PI + 90;
          dot.setAttribute('transform', `translate(${point.x} ${point.y}) rotate(${angle})`);
          dot.setAttribute('color', particleColor(mode, route.segments[section], position / part.length));
          dot.setAttribute('opacity', Math.min(1, (total - (raw % period)) / 16, (raw % period) / 16));
          occupancy[section]++;
          if (index === 0) setStage(section);
        });
        halos.current.forEach((halo, i) => halo.setAttribute('opacity', occupancy[i] ? '0.28' : '0'));
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [status, speed, mode, imageReady, route, active]);

  function reset(run = false) {
    elapsed.current = 0;
    started.current = run;
    dots.current.forEach(dot => dot?.setAttribute('opacity', '0'));
    halos.current.forEach(halo => halo?.setAttribute('opacity', '0'));
    setStage(0);
    setStatus(run ? 'running' : 'ready');
  }

  function pickImage(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    event.target.value = '';
    if (!['image/png', 'image/jpeg'].includes(file.type)) {
      setError('Gunakan berkas PNG atau JPG dari gambar referensi.');
      return;
    }
    const url = URL.createObjectURL(file);
    const probe = new Image();
    probe.onload = () => {
      if (Math.abs(probe.width / probe.height - 1) > 0.005) {
        URL.revokeObjectURL(url);
        setError('Gunakan gambar referensi utuh berbentuk persegi, tanpa dipotong, agar jalur tetap sesuai.');
        return;
      }
      if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
      objectUrl.current = url;
      reset();
      setImageReady(false);
      setError('');
      setSource(url);
    };
    probe.onerror = () => {
      URL.revokeObjectURL(url);
      setError('Berkas gambar tidak dapat dibaca. Silakan pilih ulang.');
    };
    probe.src = url;
  }

  return <main className={embedded ? 'embedded-animation' : ''}>
    <header>
      <p className="eyebrow">IPAS · KELAS 5 SD</p>
      <h1>Animasi Sistem Peredaran Darah Manusia</h1>
      <p className="intro">Ikuti perjalanan darah dari jantung dan kembali ke jantung.</p>
    </header>

    <section className="controls" aria-label="Kontrol animasi">
      <div className="mode-picker" role="group" aria-label="Jenis peredaran darah">
        {Object.entries(routes).map(([key, value]) => <button
          key={key} aria-pressed={mode === key} className={mode === key ? 'selected' : ''}
          onClick={() => { reset(); setMode(key); }}
        >{value.title}</button>)}
      </div>
      <div className="playback">
        <button className="primary" disabled={!imageReady || status !== 'ready'} onClick={() => reset(true)}>▶ Mulai</button>
        <button disabled={!imageReady || !started.current} onClick={() => setStatus(status === 'running' ? 'paused' : 'running')}>
          {status === 'paused' ? '▶ Lanjutkan' : 'Ⅱ Jeda'}
        </button>
        <button disabled={!imageReady} onClick={() => reset(started.current)}>↺ Ulangi</button>
        <label className="speed">Kecepatan
          <select value={speed} onChange={event => setSpeed(Number(event.target.value))}>
            <option value="0.5">0,5x</option><option value="1">1x</option><option value="2">2x</option>
          </select>
        </label>
      </div>
    </section>

    <section className="diagram-section" aria-label={route.title}>
      <div className="diagram-heading">
        <p>{route.summary}</p>
        <span className={`status ${status}`} role="status">
          {status === 'running' ? '● Berjalan' : status === 'paused' ? 'Ⅱ Dijeda' : 'Siap dimulai'}
        </span>
      </div>
      <div className="zoom-controls" role="group" aria-label="Ukuran diagram">
        <span>Ukuran gambar</span>
        <button aria-label="Perkecil gambar" disabled={zoom <= 50} onClick={() => setZoom(value => Math.max(50, value - 25))}>−</button>
        <output aria-live="polite" aria-label="Tingkat pembesaran">{zoom}%</output>
        <button aria-label="Perbesar gambar" disabled={zoom >= 200} onClick={() => setZoom(value => Math.min(200, value + 25))}>+</button>
        <button onClick={() => setZoom(100)}>Reset ukuran</button>
      </div>
      {!imageReady && <div className="missing-image">
        <span className="image-symbol" aria-hidden="true">♡</span>
        <h2>Gunakan gambar referensi</h2>
        <p>Pilih gambar sistem peredaran darah yang dilampirkan, dalam bentuk utuh dan persegi. Lintasan sudah disiapkan untuk gambar tersebut.</p>
        <label className="file-button">Pilih gambar PNG / JPG<input type="file" accept="image/png,image/jpeg" onChange={pickImage} /></label>
        <p className="small">Gambar diproses di browser, tanpa diunggah ke server.</p>
      </div>}
      {error && <p className="error" role="alert">{error}</p>}
      <div className="diagram-viewport" style={{ '--diagram-zoom': zoom / 100 }}
        tabIndex={imageReady ? 0 : -1} role="region" aria-label="Diagram peredaran darah. Gulir untuk melihat bagian gambar saat diperbesar.">
      <svg className={`diagram ${imageReady ? '' : 'not-loaded'}`} viewBox="0 0 1254 1254"
        preserveAspectRatio="xMidYMid meet" role="img" aria-label={`Diagram animasi: ${route.summary}`}>
        <title>{route.title}</title>
        <desc>Partikel biru menunjukkan darah rendah oksigen. Partikel merah menunjukkan darah kaya oksigen.</desc>
        <defs>
          <path id="blood-drop" d="M 0 -12 C -1.5 -5 -7.5 0 -7.5 5 A 7.5 7.5 0 0 0 7.5 5 C 7.5 0 1.5 -5 0 -12 Z" />
          <radialGradient id="drop-shading" cx="30%" cy="30%" r="80%">
            <stop offset="0" stopColor="white" stopOpacity=".55" />
            <stop offset=".38" stopColor="white" stopOpacity="0" />
            <stop offset=".78" stopColor="#450012" stopOpacity=".15" />
            <stop offset="1" stopColor="#120622" stopOpacity=".5" />
          </radialGradient>
          <linearGradient id="exchange-lung"><stop stopColor={BLUE} /><stop offset="1" stopColor={RED} /></linearGradient>
          <linearGradient id="exchange-body"><stop stopColor={BLUE} /><stop offset="1" stopColor={RED} /></linearGradient>
        </defs>
        <image href={source} x="0" y="0" width="1254" height="1254" preserveAspectRatio="xMidYMid meet"
          onLoad={() => { setImageReady(true); setError(''); }} onError={() => setImageReady(false)} />
        <g fill="none" strokeLinecap="round" strokeLinejoin="round">
          {route.segments.map((segment, i) => <path key={`${mode}-halo-${i}`}
            ref={element => { halos.current[i] = element; }} d={segment.d} strokeWidth="19"
            stroke={segment.color || `url(#exchange-${mode === 'kecil' ? 'lung' : 'body'})`} opacity="0" />)}
          {route.segments.map((segment, i) => <path key={`${mode}-${i}`}
            ref={element => { paths.current[i] = element; }} d={segment.d}
            stroke={debug ? '#8b32bb' : 'none'} strokeDasharray="7 6" strokeWidth="2.5" />)}
        </g>
        <g>
          {Array.from({ length: COUNT }, (_, i) => <g key={i} opacity="0" ref={element => { dots.current[i] = element; }}>
            <use href="#blood-drop" fill="currentColor" stroke="white" strokeOpacity=".85" strokeWidth="1" />
            <use href="#blood-drop" fill="url(#drop-shading)" />
            <path d="M -2 -2 C -4 1 -5 3 -4.5 5" fill="none" stroke="white" strokeOpacity=".65" strokeWidth="1.6" strokeLinecap="round" />
          </g>)}
        </g>
        {debug && <g fontSize="18" fontWeight="700" fill="#6d2397">
          <text x={mode === 'kecil' ? 660 : 730} y="603">Mulai</text>
          <text x={mode === 'kecil' ? 728 : 568} y="463">Selesai</text>
        </g>}
      </svg>
      </div>
      {imageReady && <div className="flow-stages" aria-label="Tahap aliran darah">
        {route.stages.map((label, i) => <span key={label} className={status !== 'ready' && stage === i ? 'active' : ''}><b>{i + 1}</b>{label}</span>)}
      </div>}
    </section>
    <footer>
      <div className="legend"><span><i style={{ background: RED }} />Kaya oksigen</span><span><i style={{ background: BLUE }} />Rendah oksigen</span></div>
      <label className="debug"><input type="checkbox" checked={debug} onChange={event => setDebug(event.target.checked)} />Tampilkan jalur SVG (debug)</label>
    </footer>
  </main>;
}
