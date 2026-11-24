"use strict";

const produkUmkm = [
  {
    nama: "Kopi Robusta Kendal", kategori: "Kopi Lokal", harga: 22000, stok: 0, unggulan: true
  },
  {
    nama: "Kopi Tubruk Signature", kategori: "Kopi Tradisional", harga: 18000, stok: 12, unggulan: true
  },
  {
    nama: "Cold Brew Aren", kategori: "Kopi Dingin", harga: 22000, stok: 4, unggulan: false
  },
  {
    nama: "Kopi Arabica Kendal", kategori: "Kopi Arabica", harga: 20000, stok: 8, unggulan: false
  },
  {
    nama: "Paket Bundling Duo Kopi", kategori: "Bundling", harga: 35000, stok: 10, unggulan: false, isi: ["Kopi Tubruk Signature", "Kopi Arabica Kendal"]
  },
  {
    nama: "Paket Bundling Segar Kendal", kategori: "Bundling", harga: 38000, stok: 3, unggulan: false, isi: ["Cold Brew Aren", "Kopi Arabica Kendal"]
  }
];

function formatRupiah(nilai) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(nilai);
}

function statusStok(stok) {
  if (stok <= 0) {
    return { label: "Stok Habis", className: "empty" };
  }

  if (stok <= 5) {
    return { label: "Stok Terbatas", className: "warning" };
  }

  return { label: "Tersedia", className: "available" };
}

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
    case "Bundling":
      return "Paket hemat kombinasi kopi";
    default:
      return "Kategori lainnya";
  }
}

function buatKartuProduk(produk) {
  const status = statusStok(produk.stok);
  return `
    <article class="js-product-card">
      <h3>${produk.nama}</h3>
      <p>${labelKategori(produk.kategori)}</p>
      <p class="price">${formatRupiah(produk.harga)}</p>
      <span class="stock-badge ${status.className}">${status.label}</span>
    </article>
  `;
}

const produkGrid = document.querySelector("#produk-grid");
const produkStatus = document.querySelector("#produk-status");
const produkUnggulan = document.querySelector("#produk-unggulan");
const tombolKembalikan = document.querySelector("#tombol-kembalikan");
const tombolFilter = document.querySelectorAll("[data-filter]");

let kategoriSaatIni = "Semua";
const produkDisembunyikan = new Set();

function buatTeksStatus(jumlahTampil) {
  let teks = `${jumlahTampil} produk ditampilkan.`;

  if (produkDisembunyikan.size > 0) {
    teks += ` Total kartu disembunyikan: ${produkDisembunyikan.size}.`;
  }

  return teks;
}

function perbaruiTombolKembalikan() {
  if (!tombolKembalikan) {
    return;
  }

  tombolKembalikan.hidden = produkDisembunyikan.size === 0;
  tombolKembalikan.textContent =
    `Kembalikan kartu yang disembunyikan (${produkDisembunyikan.size})`;
}

function buatElemenProduk(produk) {
  const card = document.createElement("article");
  card.classList.add("js-product-card", "product-card");

  const title = document.createElement("h3");
  title.textContent = produk.nama;

  const category = document.createElement("p");
  category.classList.add("category-note");
  category.textContent = produk.kategori;

  const description = document.createElement("p");
  description.textContent = labelKategori(produk.kategori);

  const price = document.createElement("p");
  price.classList.add("price");
  price.textContent = formatRupiah(produk.harga);

  const stock = document.createElement("span");
  const status = statusStok(produk.stok);
  stock.classList.add("stock-badge");
  if (status.className) {
    stock.classList.add(status.className);
  }
  stock.textContent = status.label;

  card.append(title, category, description);

  if (Array.isArray(produk.isi)) {
    const isiPaket = document.createElement("p");
    isiPaket.classList.add("bundle-note");
    isiPaket.textContent = `Isi paket: ${produk.isi.join(" + ")}`;
    card.append(isiPaket);
  }

  const removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.classList.add("ghost-button");
  removeButton.textContent = "Sembunyikan kartu";
  removeButton.addEventListener("click", () => {
    produkDisembunyikan.add(produk.nama);
    card.remove();
    perbaruiTombolKembalikan();

    if (produkGrid.children.length === 0) {
      renderProduk(kategoriSaatIni);
      return;
    }

    produkStatus.textContent = buatTeksStatus(produkGrid.children.length);
  });

  card.append(price, stock, removeButton);
  return card;
}

function buatEmptyState(kategori, semuaDisembunyikan = false) {
  const empty = document.createElement("p");
  empty.classList.add("empty-state");
  empty.textContent = semuaDisembunyikan
    ? "Semua produk pada tampilan ini sedang disembunyikan."
    : `Belum ada produk pada kategori ${kategori}.`;
  return empty;
}

function renderProduk(kategoriAktif = "Semua") {
  if (!produkGrid || !produkStatus) {
    console.warn("Target render produk tidak ditemukan.");
    return;
  }

  kategoriSaatIni = kategoriAktif;

  const produkKategori = kategoriAktif === "Semua"
    ? produkUmkm
    : produkUmkm.filter((produk) => produk.kategori === kategoriAktif);

  const produkTampil = produkKategori.filter(
    (produk) => !produkDisembunyikan.has(produk.nama)
  );

  produkGrid.replaceChildren();
  perbaruiTombolKembalikan();

  if (produkKategori.length === 0) {
    produkGrid.append(buatEmptyState(kategoriAktif));
    produkStatus.textContent = "0 produk ditemukan.";
    return;
  }

  if (produkTampil.length === 0) {
    produkGrid.append(buatEmptyState(kategoriAktif, true));
    produkStatus.textContent = buatTeksStatus(0);
    return;
  }

  produkTampil.forEach((produk) => {
    produkGrid.append(buatElemenProduk(produk));
  });

  produkStatus.textContent = buatTeksStatus(produkTampil.length);
}

tombolFilter.forEach((tombol) => {
  tombol.addEventListener("click", (event) => {
    const tombolAktif = event.currentTarget;
    const kategori = tombolAktif.dataset.filter;

    tombolFilter.forEach((item) => {
      item.classList.remove("is-active");
      item.setAttribute("aria-pressed", "false");
    });

    tombolAktif.classList.add("is-active");
    tombolAktif.setAttribute("aria-pressed", "true");

    renderProduk(kategori);
  });
});

if (tombolKembalikan) {
  tombolKembalikan.addEventListener("click", () => {
    produkDisembunyikan.clear();
    renderProduk(kategoriSaatIni);

    const filterAktif = document.querySelector(".filter-button.is-active");
    if (filterAktif) {
      filterAktif.focus();
    }
  });
}

if (produkGrid && produkStatus) {
  renderProduk();

  if (produkUnggulan) {
    const unggulan = produkUmkm.find((produk) => produk.unggulan === true);
    produkUnggulan.textContent = unggulan
      ? `Produk unggulan: ${unggulan.nama}`
      : "Belum ada produk unggulan.";
  }

  console.log("Target grid:", produkGrid);
  console.log("Jumlah tombol filter:", tombolFilter.length);
  console.table(produkUmkm);
}