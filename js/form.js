"use strict";

const STORAGE_KEY = "omah-kopi-kendal-preferensi-kontak";

const form = document.querySelector("#contactForm");
const preview = document.querySelector("#preview");
const formFeedback = document.querySelector("#form-feedback");
const preferensiStatus = document.querySelector("#preferensi-status");
const tombolSimpan = document.querySelector("#simpan-preferensi");
const tombolHapus = document.querySelector("#hapus-preferensi");
const fields = ["nama", "email", "telepon", "paket", "pesan", "setuju"]
  .map((id) => document.querySelector(`#${id}`));
const topikInputs = document.querySelectorAll('input[name="topik"]');
const waktuInputs = document.querySelectorAll('input[name="waktu"]');

const labelField = {
  nama: "Nama",
  email: "Email",
  telepon: "Nomor WhatsApp",
  pesan: "Pesan"
};

function getFieldError(field) {
  const validity = field.validity;
  const label = labelField[field.id] ?? "Bagian ini";

  if (validity.valueMissing) {
    if (field.type === "checkbox") return "Centang persetujuan untuk melanjutkan.";
    if (field.tagName === "SELECT") return "Pilih paket yang diminati.";
    return `${label} wajib diisi.`;
  }

  if (validity.typeMismatch) return "Format email belum sesuai, contoh: nama@email.com.";
  if (validity.tooShort) return `${label} minimal ${field.minLength} karakter.`;
  if (validity.patternMismatch) {
    return "Nomor WhatsApp diawali 08 dan terdiri dari 10-13 digit, contoh: 081234567890.";
  }

  return "";
}

function tampilkanError(field, pesan) {
  const error = document.querySelector(`#${field.id}-error`);
  field.setCustomValidity(pesan);
  field.setAttribute("aria-invalid", pesan ? "true" : "false");

  if (error) {
    error.textContent = pesan;
  }
}

function validasiField(field) {
  field.setCustomValidity("");
  const pesan = getFieldError(field);
  tampilkanError(field, pesan);
  return pesan === "";
}

function validasiTopik() {
  const dipilih = Array.from(topikInputs).some((input) => input.checked);
  const pesan = dipilih ? "" : "Pilih salah satu topik pertanyaan.";
  const error = document.querySelector("#topik-error");

  topikInputs.forEach((input) => {
    input.setCustomValidity(pesan);
    input.setAttribute("aria-invalid", pesan ? "true" : "false");
  });

  if (error) {
    error.textContent = pesan;
  }

  return pesan === "";
}

function teksPilihan(select) {
  const pilihan = select.selectedOptions[0];
  return pilihan ? pilihan.textContent : "-";
}

function tampilkanPreview() {
  const data = new FormData(form);

  preview.textContent = [
    `Nama: ${data.get("nama")}`,
    `Email: ${data.get("email")}`,
    `Nomor WhatsApp: ${data.get("telepon") || "-"}`,
    `Waktu dihubungi: ${data.get("waktu") || "-"}`,
    `Paket: ${teksPilihan(document.querySelector("#paket"))}`,
    `Topik: ${data.get("topik")}`,
    `Pesan: ${data.get("pesan")}`
  ].join("\n");

  formFeedback.textContent = "Form valid. Preview berhasil dibuat.";
  formFeedback.classList.remove("error");
  formFeedback.classList.add("success");
}

function setStatusPreferensi(teks, jenis = "") {
  if (preferensiStatus) {
    preferensiStatus.textContent = teks;
    preferensiStatus.classList.toggle("success", jenis === "success");
    preferensiStatus.classList.toggle("error", jenis === "error");
  }
}

function simpanPreferensi() {
  const data = new FormData(form);
  const preferensi = {
    paket: data.get("paket") ?? "",
    topik: data.get("topik") ?? "",
    waktu: data.get("waktu") ?? "",
    updatedAt: new Date().toISOString()
  };

  if (!preferensi.paket && !preferensi.topik && !preferensi.waktu) {
    setStatusPreferensi("Pilih paket, topik, atau waktu dulu sebelum menyimpan preferensi.", "error");
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferensi));
    setStatusPreferensi("Preferensi tersimpan di browser ini.", "success");
  } catch (error) {
    console.warn("Preferensi tidak bisa disimpan.", error);
    setStatusPreferensi("Preferensi tidak bisa disimpan di browser ini.", "error");
  }
}

function pilihRadio(inputs, nilai) {
  const target = Array.from(inputs).find((input) => input.value === nilai);

  if (target) {
    target.checked = true;
  }
}

function muatPreferensi() {
  try {
    const tersimpan = localStorage.getItem(STORAGE_KEY);

    if (!tersimpan) {
      setStatusPreferensi("Belum ada preferensi tersimpan.");
      return;
    }

    const preferensi = JSON.parse(tersimpan);

    if (preferensi === null || typeof preferensi !== "object") {
      throw new Error("Format preferensi tidak valid.");
    }

    document.querySelector("#paket").value = preferensi.paket ?? "";
    pilihRadio(topikInputs, preferensi.topik);
    pilihRadio(waktuInputs, preferensi.waktu);
    setStatusPreferensi("Preferensi dimuat dari penyimpanan browser.", "success");
  } catch (error) {
    console.warn("Preferensi tidak valid.", error);

    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (removeError) {
      console.warn("Preferensi tidak bisa dihapus.", removeError);
    }

    setStatusPreferensi("Preferensi tidak bisa dibaca, jadi dihapus. Silakan simpan ulang.", "error");
  }
}

function hapusPreferensi() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn("Preferensi tidak bisa dihapus.", error);
  }

  document.querySelector("#paket").value = "";
  topikInputs.forEach((input) => { input.checked = false; });
  waktuInputs.forEach((input) => { input.checked = false; });
  setStatusPreferensi("Preferensi dihapus.");
}

if (form && preview && formFeedback) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const hasilField = fields.map((field) => validasiField(field));
    const topikValid = validasiTopik();
    const semuaValid = hasilField.every(Boolean);

    if (!semuaValid || !topikValid || !form.checkValidity()) {
      formFeedback.textContent = "Periksa kembali bagian yang ditandai.";
      formFeedback.classList.remove("success");
      formFeedback.classList.add("error");
      preview.textContent = "Data form akan muncul di sini setelah semua isian valid.";

      const fieldInvalid = form.querySelector("input:invalid, select:invalid, textarea:invalid");
      form.reportValidity();
      if (fieldInvalid) {
        fieldInvalid.focus();
      }
      return;
    }

    tampilkanPreview();
  });

  fields.forEach((field) => {
    field.addEventListener("blur", () => {
      if (field.type !== "checkbox" && field.value.trim() !== "") {
        validasiField(field);
      }
    });

    const eventKoreksi = field.type === "checkbox" || field.tagName === "SELECT" ? "change" : "input";
    field.addEventListener(eventKoreksi, () => {
      if (field.getAttribute("aria-invalid") === "true") {
        validasiField(field);
      }
    });
  });

  topikInputs.forEach((input) => {
    input.addEventListener("change", validasiTopik);
  });

  if (tombolSimpan) tombolSimpan.addEventListener("click", simpanPreferensi);
  if (tombolHapus) tombolHapus.addEventListener("click", hapusPreferensi);

  muatPreferensi();

  console.log("Field divalidasi:", fields);
}