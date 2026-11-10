# Portfolio — Hamdan Firdaus

Situs portofolio statis yang di-hosting di Vercel. Setiap perubahan di branch `main` diterbitkan ulang otomatis.

## Link
- **Situs (untuk dibagikan):** alamat Vercel proyek ini, misalnya `https://portfolio-hamfirrdauss.vercel.app`
- **Editor visual:** alamat yang sama ditambah `/edit`
- **Edit langsung di GitHub:** buka `content.json` lalu klik ikon pensil

## Struktur
| File | Isi |
|---|---|
| `content.json` | Semua isi portofolio: profil, angka kunci, pengalaman, proyek, bukti karya, galeri, keahlian, kredensial |
| `images/` | Foto yang diunggah lewat editor |
| `index.html` | Halaman portofolio, membaca `content.json` |
| `edit/` | Editor visual yang menyimpan ke GitHub |
| `core.js`, `styles.css` | Mesin tampilan dan gaya |

## Mengedit content.json secara manual
- Pengaturan tampilan: `"lang"` (`"en"` atau `"id"`), `"font"` (`"ceria"`, `"klasik"`, `"modern"`, `"teknis"`), `"accent"` (kode warna, mis. `"#2A4DD0"`).
- Kata dalam `"tagline"` yang diapit `*bintang*` mendapat efek stabilo.
- Foto: unggah ke folder `images/`, lalu tulis path-nya, mis. `"photo": "/images/foto-saya.jpg"`.
- Pastikan format JSON tetap valid (tanda kutip dan koma). Kalau ragu, gunakan editor visual di `/edit`.
