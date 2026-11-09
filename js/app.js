
"use strict";

// 1. Data Produk UMKM
const produkUmkm = [
  {
    nama: "Kopi Tubruk Signature",
    kategori: "Kopi Tradisional",
    harga: 18000,
    stok: 12,
    unggulan: true
  },
  {
    nama: "Cold Brew Aren",
    kategori: "Kopi Dingin",
    harga: 22000,
    stok: 4,
    unggulan: true
  },
  {
    nama: "Kopi Robusta Kendal",
    kategori: "Kopi Lokal",
    harga: 22000,
    stok: 0,
    unggulan: false
  },
  {
    nama: "Kopi Arabica Kendal",
    kategori: "Kopi Arabica",
    harga: 20000,
    stok: 8,
    unggulan: false
  }
];

// 2. Function Format Rupiah
function formatRupiah(nilai) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(nilai);
}

// 3. Function Status Stok
function statusStok(stok) {
  if (stok <= 0) {
    return { label: "Stok Habis", className: "empty" };
  }

  if (stok <= 5) {
    return { label: "Stok Terbatas", className: "warning" };
  }

  return { label: "Tersedia", className: "available" };
}

// 4. Function Label Kategori
function labelKategori(kategori) {
  switch (kategori) {
    case "Kopi Tradisional":
      return "Kopi khas tradisional";
    case "Kopi Dingin":
      return "Minuman kopi dingin";
    case "Kopi Lokal":
      return "Kopi daerah lokal";
    case "Kopi Arabica":
      return "Kopi Arabica pilihan";
    default:
      return "Kategori lainnya";
  }
}

// 5. Function Membuat Kartu Produk
function buatKartuProduk(produk) {
  const status = statusStok(produk.stok);
  const aksi = produk.stok > 0
    ? "Siap dipesan"
    : "Hubungi admin";

  return `
    <article class="js-product-card">
      <h3>${produk.nama}</h3>
      <p>${labelKategori(produk.kategori)}</p>
      <p class="price">${formatRupiah(produk.harga)}</p>
      <span class="stock-badge ${status.className}">
        ${status.label}
      </span>
      <p>${aksi}</p>
      ${produk.unggulan ? "<strong>Produk Unggulan</strong>" : ""}
    </article>
  `;
}

// 6. Function Render Produk
function renderProduk() {
  const grid = document.querySelector("#produk-dinamis");

  if (!grid) {
    return;
  }

  const ringkasan = document.querySelector("#produk-ringkasan");
  const unggulan = document.querySelector("#produk-unggulan");

  if (!ringkasan || !unggulan) {
    console.warn("Target render produk belum lengkap.");
    return;
  }

  // Filter: mengambil produk yang stoknya tersedia
  const produkTersedia = produkUmkm.filter(
    (produk) => produk.stok > 0
  );

  // Find: mencari produk unggulan pertama
  const produkUnggulan = produkUmkm.find(
    (produk) => produk.unggulan === true
  );

  // Map: membuat HTML dari setiap produk tersedia
  const markupProduk = produkTersedia
    .map(buatKartuProduk)
    .join("");

  grid.innerHTML = markupProduk;

  ringkasan.textContent =
    `${produkTersedia.length} produk tersedia dari ${produkUmkm.length} data.`;

  unggulan.textContent = produkUnggulan
    ? `Produk unggulan: ${produkUnggulan.nama}`
    : "Belum ada produk unggulan.";

  console.log("Jumlah produk tersedia:", produkTersedia.length);
  console.table(produkUmkm);

  produkUmkm.forEach((produk) => {
    console.log("Debug produk:", produk.nama, "stok:", produk.stok);
  });
}

// Pengujian function untuk membaca return value saat debugging
console.log("Tes format Rupiah:", formatRupiah(85000));
console.log("Tes stok 0:", statusStok(0));
console.log("Tes stok 3:", statusStok(3));
console.log("Tes stok 12:", statusStok(12));

// 9. Operator JavaScript
const totalHarga = 22000 * 2;
let jumlahProduk = 0;
jumlahProduk += 1;

const stokProduk = 4;
const produkUnggulanAktif = true;

console.log("Total:", totalHarga);
console.log("Jumlah:", jumlahProduk);
console.log("Stok habis:", stokProduk === 0);
console.log(
  "Bisa ditampilkan:",
  stokProduk > 0 && produkUnggulanAktif
);

document.addEventListener("DOMContentLoaded", renderProduk);
