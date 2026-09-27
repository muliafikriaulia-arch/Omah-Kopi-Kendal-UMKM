const contactForm = document.querySelector("#contactForm");

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!contactForm.checkValidity()) {
    contactForm.reportValidity();
    return;
  }

  console.log("Form kontak Omah Kopi Kendal berhasil dikirim.");

  alert("Terima kasih. Pesan Anda berhasil dikirim.");
});