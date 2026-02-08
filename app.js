
import { db } from './firebase-config.js';
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// အချက်အလက်များကို သိမ်းဆည်းရန် State များ
let allProducts = [];
let currentLang = 'en';
let ratingFilterActive = false;

// မြန်မာ/အင်္ဂလိပ် ဘာသာစကားအတွက် စာသားများ
const i18n = {
    en: { all_cats: "All Categories", high_rating: "Rating 97%+", complexity: "Complexity" },
    mm: { all_cats: "အမျိုးအစားအားလုံး", high_rating: "နှုန်း ၉၇% အထက်", complexity: "ရှုပ်ထွေးမှု" }
};

// HTML Elements များကို ခေါ်ယူခြင်း
const container = document.getElementById('results-container');
const searchInput = document.getElementById('search-input');
const categoryFilter = document.getElementById('category-filter');
const highRatingBtn = document.getElementById('high-rating-btn');
const langToggle = document.getElementById('lang-toggle');

// Firebase မှ အချက်အလက်များ စတင်ယူခြင်း
async function init() {
    try {
        const querySnapshot = await getDocs(collection(db, "products"));
        allProducts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        render(allProducts);
    } catch (e) {
        container.innerHTML = `<p class="text-red-400 text-center col-span-full">Error loading data. Check Firebase config.</p>`;
        console.error(e);
    }
}

// ပစ္စည်းကတ်ပြားလေးများကို Screen ပေါ်တွင် ပြသခြင်း
function render(data) {
    container.innerHTML = '';
    
    if (data.length === 0) {
        container.innerHTML = `<p class="text-slate-500 text-center col-span-full mt-10">No items found.</p>`;
        return;
    }

    data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'bg-slate-800 border border-slate-700 rounded-xl p-5 hover:border-blue-500/50 transition duration-300';
        
        // Rating အလိုက် အရောင်သတ်မှတ်ခြင်း
        const ratingColor = item.rating >= 97 ? 'text-green-400' : (item.rating >= 90 ? 'text-yellow-400' : 'text-red-400');

        card.innerHTML = `
            <div class="flex justify-between items-start mb-2">
                <span class="text-xs font-semibold bg-slate-700 px-2 py-1 rounded text-slate-300">${item.category}</span>
                <span class="text-lg font-bold ${ratingColor}">${item.rating}%</span>
            </div>
            <h3 class="text-lg font-bold text-white mb-1">${item.name}</h3>
            <div class="flex justify-between items-center text-sm text-slate-400 mt-3 border-t border-slate-700 pt-3">
                <span>${i18n[currentLang].complexity}: ${item.features}</span>
            </div>
        `;
        container.appendChild(card);
    });
}

// ရှာဖွေခြင်းနှင့် Filter လုပ်ခြင်း Logic
function filterData() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedCat = categoryFilter.value;

    const filtered = allProducts.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm);
        const matchesCat = selectedCat === 'all' || item.category === selectedCat;
        const matchesRating = !ratingFilterActive || item.rating >= 97;
        
        return matchesSearch && matchesCat && matchesRating;
    });

    render(filtered);
}

// Event Listeners (အသုံးပြုသူ နှိပ်လိုက်သည့်အခါ လုပ်ဆောင်ချက်များ)
searchInput.addEventListener('input', filterData);
categoryFilter.addEventListener('change', filterData);

highRatingBtn.addEventListener('click', () => {
    ratingFilterActive = !ratingFilterActive;
    // ခလုတ်အရောင်ကို အဖွင့်/အပိတ် ပြောင်းလဲခြင်း
    highRatingBtn.classList.toggle('bg-green-600', ratingFilterActive);
    highRatingBtn.classList.toggle('border-green-500', ratingFilterActive);
    filterData();
});

// ဘာသာစကား ပြောင်းလဲခြင်း
langToggle.addEventListener('click', () => {
    currentLang = currentLang === 'en' ? 'mm' : 'en';
    
    // UI စာသားများကို ပြောင်းလဲခြင်း
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        el.textContent = i18n[currentLang][key];
    });
    
    // Card ထဲက စာသားများကိုပါ Update ဖြစ်အောင် ပြန် render လုပ်ခြင်း
    render(allProducts);
});

// App ကို စတင်ပတ်ခြင်း
init();
