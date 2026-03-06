/* ─────────────────────────────────────────────────────────────
   Shivar Farmfresh  |  Shared Data & Utilities
   Curcumin corrected to 3–5% (actual). Market standard is 1–2%.
───────────────────────────────────────────────────────────── */
const DEFAULT_PRODUCTS = [
  { id:"p1", name:"Premium Turmeric Powder", nameHi:"प्रीमियम हळद पावडर", category:"Turmeric", weight:"100g", weightGrams:100, price:120, mrp:150, stock:true, badge:"Trial Pack", curcumin:"3–5%", description:"Starter pack. Single-origin organic turmeric from Wai-Satara Sahyadri — 3–5% curcumin, nearly 2× higher than standard market turmeric (1–2%). Zero additives, zero fillers.", benefits:["Boosts Immunity","Anti-Inflammatory","Heart Health","Skin Glow"], image:null },
  { id:"p2", name:"Premium Turmeric Powder", nameHi:"प्रीमियम हळद पावडर", category:"Turmeric", weight:"200g", weightGrams:200, price:220, mrp:280, stock:true, badge:"Popular", curcumin:"3–5%", description:"Most popular choice. Farm-fresh single-origin turmeric with 3–5% curcumin — significantly higher than the 1–2% found on supermarket shelves. Resealable zip-lock pouch.", benefits:["Boosts Immunity","Anti-Inflammatory","Heart Health","Skin Glow"], image:null },
  { id:"p3", name:"Premium Turmeric Powder", nameHi:"प्रीमियम हळद पावडर", category:"Turmeric", weight:"500g", weightGrams:500, price:480, mrp:600, stock:true, badge:"Best Value", curcumin:"3–5%", description:"Best value family pack. 3 months supply of premium Sahyadri turmeric with 3–5% curcumin — up to 3× more potent than standard brands. Resealable pack.", benefits:["Boosts Immunity","Anti-Inflammatory","Heart Health","Skin Glow"], image:null },
  { id:"p4", name:"Premium Turmeric Powder", nameHi:"प्रीमियम हळद पावडर", category:"Turmeric", weight:"1000g", weightGrams:1000, price:880, mrp:1100, stock:true, badge:"Family Pack", curcumin:"3–5%", description:"6-month family supply. Best price per gram. Premium Sahyadri turmeric — 3–5% curcumin, farm-direct, FSSAI certified, zero preservatives.", benefits:["Boosts Immunity","Anti-Inflammatory","Heart Health","Skin Glow"], image:null }
];

const DEFAULT_BRAND = {
  name:"Shivar Farmfresh", nameHi:"शिवार फार्मफ्रेश",
  tagline:"Pure Sahyadri Gold", taglineHi:"शुद्ध सह्याद्री सोने",
  phone:"+91 99879 82611", whatsapp:"919987982611",
  upi:"9511627623@ibl", fssai:"21524039000444",
  address:"Wai-Satara, Sahyadri, Maharashtra, India", email:"",
  originPin:"412803"
};

/* ── GST ── */
const GST_RATE = 0.05; // 5% — packaged turmeric powder HSN 09103030

/* ── COURIER SHIPPING LOGIC ──
   Zone detection by PIN prefix (first 2 digits).
   Maharashtra origin PIN 412803.
   Zones: LOCAL (same state), METRO (major cities), REGIONAL (nearby states), REMOTE (NE/J&K/islands)
   Rates based on Delhivery/DTDC/Maruti averages 2025. */
const COURIER_RATES = {
  // base rate per shipment (up to 500g), then per additional 500g slab
  local:    { base: 60,  perSlab: 25, label: "Maharashtra", days: "1–2 days" },
  metro:    { base: 90,  perSlab: 35, label: "Metro Cities (Delhi/Mumbai/Bengaluru/Chennai/Kolkata/Hyderabad)", days: "2–3 days" },
  regional: { base: 110, perSlab: 45, label: "Rest of India", days: "3–5 days" },
  remote:   { base: 160, perSlab: 70, label: "Remote Areas (NE States / J&K / Islands)", days: "5–8 days" },
};
const COD_FEE = 40; // flat COD charge

/* PIN prefix → zone */
function detectZone(pin) {
  if (!pin || pin.length < 2) return 'regional';
  const p = parseInt(pin.slice(0,3));
  // Maharashtra: 400–445
  if (p >= 400 && p <= 445) return 'local';
  // Metro PINs: Delhi 110, Mumbai 400 (handled above), Bengaluru 560, Chennai 600, Kolkata 700, Hyderabad 500
  if ([110,111,560,561,562,563,600,601,602,603,700,701,702,500,501,502,503].includes(p)) return 'metro';
  // Remote: NE states 781–799, J&K 180–194, Andaman 744, Lakshadweep 682
  if ((p>=781&&p<=799)||(p>=180&&p<=194)||p===744||p===682) return 'remote';
  return 'regional';
}

/* Calculate shipping for a given total weight in grams and PIN */
function calcShipping(weightGrams, pin, isCOD) {
  const zone = detectZone(pin);
  const rate = COURIER_RATES[zone];
  const slabs = Math.ceil(weightGrams / 500); // each 500g is a slab
  const shipping = rate.base + Math.max(0, slabs - 1) * rate.perSlab;
  const cod = isCOD ? COD_FEE : 0;
  return { shipping, cod, zone, rate, slabs };
}

/* Calculate full order breakdown */
function calcOrderTotal(cartItems, allProducts, pin, isCOD) {
  let productTotal = 0;
  let totalGrams = 0;
  cartItems.forEach(item => {
    const p = allProducts.find(x => x.id === item.id);
    if (!p) return;
    productTotal += p.price * item.qty;
    totalGrams += (p.weightGrams || 500) * item.qty;
  });
  const gst = Math.round(productTotal * GST_RATE);
  const { shipping, cod, zone, rate } = calcShipping(totalGrams, pin, isCOD);
  const grandTotal = productTotal + gst + shipping + cod;
  return { productTotal, gst, shipping, cod, grandTotal, zone, rate, totalGrams };
}

function getProducts(){ try{ const s=localStorage.getItem('sf_products'); return s?JSON.parse(s):DEFAULT_PRODUCTS; }catch(e){ return DEFAULT_PRODUCTS; } }
function saveProducts(p){ localStorage.setItem('sf_products',JSON.stringify(p)); }
function getBrand(){ try{ const s=localStorage.getItem('sf_brand'); return s?{...DEFAULT_BRAND,...JSON.parse(s)}:DEFAULT_BRAND; }catch(e){ return DEFAULT_BRAND; } }
function saveBrand(b){ localStorage.setItem('sf_brand',JSON.stringify(b)); }
function pctOff(mrp,price){ return Math.round(((mrp-price)/mrp)*100); }
function waURL(product,brand){ const m=`Hello Shivar Farmfresh! 🌿\n\nI'd like to order:\n*${product.name} — ${product.weight}*\nPrice: ₹${product.price}\n\nPlease confirm availability & share delivery details.\n\nFSSAI: ${brand.fssai}`; return `https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(m)}`; }
