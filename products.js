/* ─────────────────────────────────────────────────────────────
   Shivar Farmfresh  |  Shared Data & Utilities
   Edit DEFAULT_PRODUCTS below OR use admin.html to manage live.
───────────────────────────────────────────────────────────── */
const DEFAULT_PRODUCTS = [
  { id:"p1", name:"Premium Turmeric Powder", nameHi:"प्रीमियम हळद पावडर", category:"Turmeric", weight:"100g", price:120, mrp:150, stock:true, badge:"Trial Pack", curcumin:"5–7%", description:"Perfect starter pack. Single-origin organic turmeric from Wai-Satara Sahyadri — 5–7% curcumin, 2.5× more potent than standard market turmeric. Zero additives.", benefits:["Boosts Immunity","Anti-Inflammatory","Heart Health","Skin Glow"], image:null },
  { id:"p2", name:"Premium Turmeric Powder", nameHi:"प्रीमियम हळद पावडर", category:"Turmeric", weight:"200g", price:220, mrp:280, stock:true, badge:"Popular", curcumin:"5–7%", description:"Most popular choice. Farm-fresh single-origin turmeric with 5–7% curcumin. Resealable zip-lock pouch. Zero chemicals, zero fillers.", benefits:["Boosts Immunity","Anti-Inflammatory","Heart Health","Skin Glow"], image:null },
  { id:"p3", name:"Premium Turmeric Powder", nameHi:"प्रीमियम हळद पावडर", category:"Turmeric", weight:"500g", price:480, mrp:600, stock:true, badge:"Best Value", curcumin:"5–7%", description:"Best value pack for families. 3 months supply of premium Sahyadri turmeric. Same high 5–7% curcumin content with 20% savings vs smaller packs.", benefits:["Boosts Immunity","Anti-Inflammatory","Heart Health","Skin Glow"], image:null },
  { id:"p4", name:"Premium Turmeric Powder", nameHi:"प्रीमियम हळद पावडर", category:"Turmeric", weight:"1000g", price:880, mrp:1100, stock:true, badge:"Family Pack", curcumin:"5–7%", description:"6-month family supply. Best price per gram. Premium Sahyadri turmeric delivered direct from farm to your door. Bulk saver pack.", benefits:["Boosts Immunity","Anti-Inflammatory","Heart Health","Skin Glow"], image:null }
];

const DEFAULT_BRAND = {
  name:"Shivar Farmfresh", nameHi:"शिवार फार्मफ्रेश",
  tagline:"Pure Sahyadri Gold", taglineHi:"शुद्ध सह्याद्री सोने",
  phone:"+91 99879 82611", whatsapp:"919987982611",
  upi:"9511627623@ibl", fssai:"21524039000444",
  address:"Wai-Satara, Sahyadri, Maharashtra, India", email:""
};

function getProducts(){ try{ const s=localStorage.getItem('sf_products'); return s?JSON.parse(s):DEFAULT_PRODUCTS; }catch(e){ return DEFAULT_PRODUCTS; } }
function saveProducts(p){ localStorage.setItem('sf_products',JSON.stringify(p)); }
function getBrand(){ try{ const s=localStorage.getItem('sf_brand'); return s?{...DEFAULT_BRAND,...JSON.parse(s)}:DEFAULT_BRAND; }catch(e){ return DEFAULT_BRAND; } }
function saveBrand(b){ localStorage.setItem('sf_brand',JSON.stringify(b)); }
function pctOff(mrp,price){ return Math.round(((mrp-price)/mrp)*100); }
function waURL(product,brand){ const m=`Hello Shivar Farmfresh! 🌿\n\nI'd like to order:\n*${product.name} — ${product.weight}*\nPrice: ₹${product.price}\n\nPlease confirm availability & share delivery details.\n\nFSSAI: ${brand.fssai}`; return `https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(m)}`; }
