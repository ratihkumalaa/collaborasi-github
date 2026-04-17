# Panduan Git untuk Kolaborasi Project

## Overview
Dokumen ini menjelaskan penggunaan dasar Git dalam proses pengembangan project, meliputi pengambilan repository, sinkronisasi data, pengiriman perubahan, serta alur kerja kolaborasi tim.

---

## Setup Awal

Sebelum menggunakan Git, lakukan konfigurasi identitas:

```bash
git config --global user.name "Nama Kamu"
git config --global user.email "emailkamu@example.com"
````

---

## Mengambil Repository (Clone)

Digunakan untuk mengambil project dari GitHub ke komputer lokal.

```bash
git clone https://github.com/username/nama-repo.git
cd nama-repo
```

Clone hanya dilakukan satu kali di awal.

---

## Mengambil Perubahan Terbaru (Pull)

Digunakan untuk menyinkronkan project lokal dengan repository.

```bash
git pull origin main
```

Sangat disarankan untuk melakukan pull sebelum mulai bekerja.

---

## Mengirim Perubahan (Push)

Digunakan untuk mengirim hasil pekerjaan ke repository.

```bash
git add .
git commit -m "Deskripsi perubahan"
git push origin main
```

Pastikan pesan commit jelas dan sesuai dengan perubahan yang dilakukan.

---

## Alur Kerja Kolaborasi

Berikut alur kerja standar dalam pengembangan tim:

```bash
git pull origin main
# lakukan perubahan pada project
git status
git add .
git commit -m "Deskripsi perubahan"
git push origin main
```

Alur ini memastikan setiap anggota tim selalu bekerja pada versi terbaru.

---

## Penanganan Konflik

Konflik dapat terjadi saat ada perubahan pada bagian file yang sama.

Contoh konflik:

```bash
<<<<<<< HEAD
kode dari lokal
=======
kode dari repository
>>>>>>> branch
```

Penyelesaian:

* Pilih bagian kode yang benar
* Hapus penanda konflik
* Simpan file

Kemudian jalankan:

```bash
git add .
git commit -m "Menyelesaikan konflik"
git push
```

---

## Penggunaan Branch

Branch digunakan untuk memisahkan pengembangan fitur.

Membuat branch:

```bash
git checkout -b fitur-baru
```

Berpindah branch:

```bash
git checkout main
```

Menggabungkan branch:

```bash
git merge fitur-baru
```

---

## Prinsip Kolaborasi

* Selalu sinkronisasi sebelum bekerja
* Gunakan commit message yang jelas
* Pisahkan pekerjaan menggunakan branch
* Hindari perubahan langsung pada branch utama
* Jaga komunikasi antar anggota tim
