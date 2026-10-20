# Animasi Sistem Peredaran Darah Manusia

Project React + Vite untuk IPAS kelas 5 berupa delapan slide pembelajaran interaktif.
Animasi sebelumnya tetap digunakan di slide 6, tanpa membuat ulang lintasan.

## Presentasi interaktif

- Tujuh slide: pembuka, pengertian, organ, jantung dan pembuluh, komponen darah,
  animasi peredaran, serta fungsi peredaran darah.
- Gunakan Sebelumnya/Selanjutnya, indikator slide, atau panah kiri/kanan.
  Panah tidak mengambil alih input, pilihan kecepatan, atau area gulir diagram.
- Beranda mengembalikan presentasi ke slide pembuka. Layar penuh tersedia
  melalui tombol di kanan atas; tekan Escape untuk keluar.
- Klik kartu organ dan komponen darah untuk membaca penjelasan.
- Komponen animasi tetap terpasang selama presentasi. Meninggalkan slide 6
  menjeda animasi; kembali ke slide 6 lalu tekan Lanjutkan. Mode, zoom,
  kecepatan, dan posisi partikel tetap tersimpan selama halaman tidak dimuat ulang.
- Bingkai desktop berasio 16:9. Pada layar kecil, tinggi minimum disediakan
  untuk keterbacaan. Konten panjang dapat digulir di dalam bingkai; navigasi
  tetap berada di luar area gulir.

`src/Presentation.jsx` mengatur presentasi dan ilustrasi SVG.
`src/presentation.css` mengatur tampilan slide. `src/App.jsx` tetap memuat
animasi asli; properti `active` menjedakannya saat tidak terlihat dan
`embedded` menyesuaikan tampilannya dalam slide.

## Kuis (slide 8)

Menu **Kuis** membuka empat soal bergambar. Gambar asli `reference-soal.png`
disalin tanpa modifikasi ke `public/reference-soal.png`. Komponen dan gaya kuis
berada di `src/Quiz.jsx` dan `src/quiz.css`; komponen animasi tidak diubah.

- Kunci jawaban berurutan B, C, A, C. Setiap jawaban benar bernilai 25 poin.
- Pilih jawaban, lalu tekan **Jawab dan Lanjutkan** untuk mengunci pilihan dan
  membaca pembahasan. Gunakan **Soal Selanjutnya** setelah membaca.
- Progres dan jawaban disimpan dalam state selama halaman terbuka, termasuk
  ketika berpindah ke materi. Memuat ulang halaman menghapus percobaan.
- **Ulangi Kuis** menghapus semua jawaban dan skor. Confetti hanya untuk nilai 100.
- Panah keyboard tidak berpindah slide saat kuis terbuka, sehingga tidak
  mengganggu pemilihan jawaban dengan keyboard.
- Di laptop gambar berada di kiri dan mengikuti guliran; di HP berada di atas.
  Konten panjang dapat digulir di dalam slide.

Uji Chrome berhasil untuk urutan soal, penguncian jawaban, pembahasan, seluruh
nilai 0/25/50/75/100, reset, progres saat kembali dari materi, navigasi hasil,
gambar asli, pengerjaan pada HP, serta animasi lama. Tidak ditemukan error
JavaScript atau overflow horizontal pada viewport HP 390 × 844.

## Menjalankan

Pasang Node.js 22 atau lebih baru (beserta npm), kemudian:

```sh
cd sistem-peredaran-darah
npm install
npm run dev
```

Buka alamat lokal yang ditampilkan Vite di terminal. Untuk build:

```sh
npm run build
npm run preview
```

## Gambar referensi diperlukan

Gambar referensi 1254 × 1254 sudah tersedia di `public/reference.png` dan tampil otomatis.
Untuk mengganti gambar, simpan **gambar referensi yang sama, utuh** ke lokasi tersebut (PNG sungguhan).
Untuk JPG, ubah `DEFAULT_IMAGE` di `src/App.jsx` menjadi `reference.jpg`.
Alternatif: pilih PNG/JPG menggunakan tombol di halaman. Pilihan ini hanya bertahan
selama halaman terbuka; berkas tidak diunggah ke server.

Gunakan gambar persegi dengan komposisi persis seperti lampiran 1254 × 1254.
Resolusi berbeda boleh apabila proporsi dan komposisinya tetap sama. Jangan crop,
tambahkan margin, atau memakai gambar lain: validasi rasio saja tidak dapat
memastikan kecocokan komposisi.

## Kontrol

- Pilih peredaran kecil atau besar. Pergantian mode mengembalikan animasi ke awal.
- Mulai mengeluarkan partikel secara bertahap dengan jarak teratur.
- Jeda/Lanjutkan mempertahankan posisi; kecepatan dapat diubah tanpa reset.
- Ulangi mengembalikan partikel ke titik awal; jika sudah dimulai, animasi berjalan lagi.
- Partikel menghilang di serambi tujuan, lalu partikel baru masuk di bilik asal.
  Tidak ada lintasan buatan yang menyambungkan kedua ruang tersebut.
- Debug memperlihatkan garis ungu putus-putus serta label awal/akhir.

## Koordinat dan batas ketelitian

Gambar dan seluruh lintasan berada dalam SVG yang sama, `viewBox="0 0 1254 1254"`,
dengan aspect ratio tetap. `src/routes.js` menyimpan lintasan manual dalam urutan
aliran. Setiap segmen berakhir tepat pada awal segmen berikutnya. Posisi partikel
dihitung dengan `getTotalLength`, `getPointAtLength`, dan `requestAnimationFrame`.
Warna berubah bertahap pada segmen kapiler; jalur disorot saat berisi partikel.

Lintasan disusun dari tampilan lampiran percakapan. **Belum dikalibrasi ulang
di browser terhadap berkas asli**. Sambungan di dalam jantung dan kapiler yang
tertutup siluet tubuh adalah perkiraan, karena bagian tersebut tidak terlihat
utuh pada ilustrasi. Overlay saat ini menggambar sambungan perkiraan itu di atas
gambar; jangan menganggapnya hasil penelusuran pembuluh yang seluruhnya terlihat.
Periksa debug dengan gambar asli sebelum digunakan mengajar, terutama sambungan
aorta di jantung dan kapiler tubuh. Sesuaikan kurva `d` di `src/routes.js` bila perlu.

Dependency berhasil dipasang dengan Node.js 24 dan npm 11. `npm run build`
berhasil. Uji Chrome otomatis berhasil untuk navigasi slide, kartu interaktif,
Mulai/Jeda/Lanjutkan/Ulangi, pergantian mode, zoom yang tersimpan saat kembali
ke slide animasi, layar penuh, dan tidak adanya overflow horizontal halaman
pada viewport ponsel 390 × 844. Tidak ditemukan error JavaScript saat pengujian.
Kalibrasi ketepatan lintasan terhadap gambar tetap mengikuti batasan di atas.
