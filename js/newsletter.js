"use strict";

const NEWSLETTER_KEY = "omah-kopi-kendal-newsletter";

const formNewsletter = document.querySelector("#form-newsletter");
const newsletterEmail = document.querySelector("#newsletter-email");
const newsletterError = document.querySelector("#newsletter-email-error");
const newsletterStatus = document.querySelector("#newsletter-status");
const tombolHapusNewsletter = document.querySelector("#newsletter-hapus");
const minatInputs = document.querySelectorAll('input[name="minat"]');

function setStatusNewsletter(teks, jenis = "") {
  newsletterStatus.textContent = teks;
  newsletterStatus.classList.toggle("success", jenis === "success");
  newsletterStatus.classList.toggle("error", jenis === "error");
}

function validasiEmailNewsletter() {
  newsletterEmail.setCustomValidity("");
  const validity = newsletterEmail.validity;
  let pesan = "";

  if (validity.valueMissing) {
    pesan = "Email wajib diisi.";
  } else if (validity.typeMismatch) {
    pesan = "Format email belum sesuai, contoh: nama@email.com.";
  }

  newsletterEmail.setCustomValidity(pesan);
  newsletterEmail.setAttribute("aria-invalid", pesan ? "true" : "false");
  newsletterError.textContent = pesan;
  return pesan === "";
}

function ambilMinat() {
  return Array.from(minatInputs)
    .filter((input) => input.checked)
    .map((input) => input.value);
}

function simpanNewsletter() {
  const data = {
    email: newsletterEmail.value.trim(),
    minat: ambilMinat(),
    updatedAt: new Date().toISOString()
  };

  try {
    localStorage.setItem(NEWSLETTER_KEY, JSON.stringify(data));
    setStatusNewsletter("Data newsletter tersimpan di browser ini.", "success");
  } catch (error) {
    console.warn("Data newsletter tidak bisa disimpan.", error);
    setStatusNewsletter("Data newsletter tidak bisa disimpan di browser ini.", "error");
  }
}

function muatNewsletter() {
  try {
    const tersimpan = localStorage.getItem(NEWSLETTER_KEY);

    if (!tersimpan) {
      setStatusNewsletter("Belum ada data newsletter tersimpan.");
      return;
    }

    const data = JSON.parse(tersimpan);

    if (data === null || typeof data !== "object") {
      throw new Error("Format data newsletter tidak valid.");
    }

    newsletterEmail.value = typeof data.email === "string" ? data.email : "";
    const minat = Array.isArray(data.minat) ? data.minat : [];
    minatInputs.forEach((input) => {
      input.checked = minat.includes(input.value);
    });

    setStatusNewsletter("Data newsletter dimuat dari penyimpanan browser.", "success");
  } catch (error) {
    console.warn("Data newsletter tidak valid.", error);

    try {
      localStorage.removeItem(NEWSLETTER_KEY);
    } catch (removeError) {
      console.warn("Data newsletter tidak bisa dihapus.", removeError);
    }

    setStatusNewsletter("Data newsletter tidak bisa dibaca, jadi dihapus. Silakan simpan ulang.", "error");
  }
}

function hapusNewsletter() {
  try {
    localStorage.removeItem(NEWSLETTER_KEY);
  } catch (error) {
    console.warn("Data newsletter tidak bisa dihapus.", error);
  }

  formNewsletter.reset();
  newsletterEmail.setCustomValidity("");
  newsletterEmail.setAttribute("aria-invalid", "false");
  newsletterError.textContent = "";
  setStatusNewsletter("Data newsletter dihapus.");
}

if (formNewsletter && newsletterEmail && newsletterError && newsletterStatus) {
  formNewsletter.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!validasiEmailNewsletter()) {
      setStatusNewsletter("Periksa kembali email yang diisi.", "error");
      newsletterEmail.focus();
      return;
    }

    simpanNewsletter();
  });

  newsletterEmail.addEventListener("input", () => {
    if (newsletterEmail.getAttribute("aria-invalid") === "true") {
      validasiEmailNewsletter();
    }
  });

  if (tombolHapusNewsletter) {
    tombolHapusNewsletter.addEventListener("click", hapusNewsletter);
  }

  muatNewsletter();
}