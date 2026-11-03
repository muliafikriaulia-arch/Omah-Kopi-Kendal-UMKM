"use strict";

// 1. Array dan Object
const produkUmkm = [
  { nama: "Kopi Tubruk Signature", kategori: "Kopi Tradisional", harga: 18000, stok: 12, unggulan: true },
  { nama: "Cold Brew Aren", kategori: "Kopi Dingin", harga: 22000, stok: 4, unggulan: true },
  { nama: "Kopi Robusta Kendal", kategori: "Kopi Lokal", harga: 22000, stok: 0, unggulan: false },
  { nama: "Kopi Arabica Kendal", kategori: "Kopi Arabica", harga: 20000, stok: 8, unggulan: false }
];

// 2. Format Rupiah
const formatRupiah = new Intl.NumberFormat("id-ID", {
  style: "currency", currency: "IDR", maximumFractionDigits: 0
});

// 3. Conditional
function statusStok(stok) {
  if (stok === 0) return { label: "Stok Habis", className: "empty" };
  else if (stok <= 5) return { label: "Stok Terbatas", className: "warning" };
  return { label: "Tersedia", className: "available" };
}

// 4. Switch
function labelKategori(kategori) {
  switch (kategori) {
    case "Kopi Tradisional": return "Kopi khas tradisional";
    case "Kopi Dingin": return "Minuman kopi dingin";
    case "Kopi Lokal": return "Kopi daerah lokal";
    default: return "Kategori lainnya";
  }
}

// 5. Console
console.table(produkUmkm);
console.log("harga:", formatRupiah.format(18000));

// 6. DOM dan Rendering
function renderProduk() {
  const grid = document.querySelector("#produk-dinamis");
  const ringkasan = document.querySelector("#produk-ringkasan");
  if (!grid || !ringkasan) return;

  let jumlahTersedia = 0;

  grid.innerHTML = produkUmkm.map(produk => {
    const status = statusStok(produk.stok);
    const aksi = produk.stok > 0 ? "Siap dipesan" : "Hubungi admin";

    if (produk.stok > 0) jumlahTersedia++;

    return `
      <article class="js-product-card">
        <h3>${produk.nama}</h3>
        <p>${labelKategori(produk.kategori)}</p>
        <p class="price">${formatRupiah.format(produk.harga)}</p>
        <span class="stock-badge ${status.className}">${status.label}</span>
        <p>${aksi}</p>
        ${produk.unggulan ? "<strong>Produk Unggulan</strong>" : ""}
      </article>
    `;
  }).join("");

  ringkasan.textContent =
    `${jumlahTersedia} produk tersedia dari ${produkUmkm.length} data.`;
}

document.addEventListener("DOMContentLoaded", renderProduk);

// 7. Operator JavaScript
const totalHarga = 22000 * 2; // Aritmetika
let jumlahProduk = 0;
jumlahProduk += 1; // Assignment

const stokProduk = 4;
const produkUnggulan = true;

console.log("Total:", totalHarga);
console.log("Jumlah:", jumlahProduk);
console.log("Stok habis:", stokProduk === 0); // Comparison
console.log("Bisa ditampilkan:", stokProduk > 0 && produkUnggulan); // Logical

// 8. Debugging dan DOM
console.log("Jumlah data:", produkUmkm.length);
console.table(produkUmkm);
console.log("Target DOM:", document.querySelector("#produk-dinamis"));
