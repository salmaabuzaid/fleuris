const translations = {
  en: {
    title: "Your Garden of Unique Brands",
    login: "Login",
    signup: "Sign Up",
    wishlist: "Wishlist",
    logout: "Logout",
  },
  fr: {
    title: "Votre jardin de marques uniques",
    login: "Connexion",
    signup: "S'inscrire",
    wishlist: "Liste de souhaits",
    logout: "Se déconnecter",
  },
};

function switchLanguage(lang) {
  document.querySelectorAll("[data-key]").forEach(el => {
    const key = el.getAttribute("data-key");
    el.textContent = translations[lang][key];
  });
}
