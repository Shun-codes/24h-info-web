import bcrypt from 'bcryptjs'
import pool from '../src/config/database.js'

const ACCOUNTS = [
  { email: 'user@lunivert.fr',  password: 'User1234',  name: 'Jean Utilisateur',  role: 'user',      city: 'Lyon',      phone: '0601020304' },
  { email: 'modo@lunivert.fr',  password: 'Modo1234',  name: 'Marie Modératrice', role: 'moderator', city: 'Paris',     phone: null },
  { email: 'admin@lunivert.fr', password: 'Admin1234', name: 'Pierre Admin',      role: 'admin',     city: 'Lens',      phone: null },
  { email: 'alice@seed.test',   password: 'jardin123', name: 'Alice Martin',      role: 'user',      city: 'Lyon',      phone: '0602030405' },
  { email: 'bob@seed.test',     password: 'jardin123', name: 'Bob Dupont',        role: 'user',      city: 'Paris',     phone: '0606070809' },
  { email: 'carol@seed.test',   password: 'jardin123', name: 'Carol Bernard',     role: 'user',      city: 'Marseille', phone: '0610111213' },
]

// Pioche `count` numéros uniques aléatoires dans [1, 99]
function randImgs(count) {
  const pool = Array.from({ length: 99 }, (_, i) => i + 1)
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]]
  }
  return pool.slice(0, count)
}

// Annonces seed — images dans uploads/seed/image1.png … image99.png
const LISTINGS_SEED = [
  // alice@seed.test
  { sellerEmail: 'alice@seed.test', cat: 'plantes-interieur', title: 'Monstera Deliciosa XXL',                        desc: 'Magnifique monstera de 1m20, très bonne santé, pot inclus.',                                  price: 45.00,  city: 'Lyon',            method: 'both',    imgs: randImgs(2) },
  { sellerEmail: 'alice@seed.test', cat: 'plantes-fleuries',  title: 'Orchidée Phalaenopsis rose',                     desc: 'Belle orchidée en pleine floraison, 3 tiges florales.',                                       price: 12.50,  city: 'Lyon',            method: 'message', imgs: randImgs(1) },
  { sellerEmail: 'alice@seed.test', cat: 'graines-bulbes',    title: 'Graines de tomates anciennes variées',           desc: 'Mélange non-traité : Cœur de bœuf, Rose de Berne, Noire de Crimée. 50 graines.',           price: 5.00,   city: 'Lyon',            method: 'message', imgs: randImgs(1) },
  { sellerEmail: 'alice@seed.test', cat: 'outils-materiel',   title: 'Lot outils jardinage — sécateur, bêche, râteau', desc: 'Lot en bon état, peu utilisé. Idéal pour débutant.',                                     price: 35.00,  city: 'Villeurbanne',    method: 'both',    imgs: randImgs(3) },
  { sellerEmail: 'alice@seed.test', cat: 'cours-ateliers',    title: 'Atelier taille des rosiers — samedi matin',      desc: 'Apprenez à tailler vos rosiers pour une floraison optimale. 2h, 8 personnes max.',           price: 20.00,  city: 'Lyon',            method: 'message', imgs: randImgs(2) },
  { sellerEmail: 'alice@seed.test', cat: 'plantes-interieur', title: 'Pothos doré — boutures enracinées',              desc: 'Boutures en pot 9cm. Plante dépolluante, facile d\'entretien.',                             price: 8.00,   city: 'Lyon',            method: 'message', imgs: randImgs(1) },
  { sellerEmail: 'alice@seed.test', cat: 'services-conseils', title: 'Entretien de jardin à domicile — Lyon',          desc: 'Tonte, taille, désherbage. Tarif horaire, devis gratuit.',                                    price: 18.00,  city: 'Lyon',            method: 'phone',   imgs: randImgs(2) },

  // bob@seed.test
  { sellerEmail: 'bob@seed.test', cat: 'arbres-arbustes',   title: 'Laurier palme 2m — à emporter rapidement',       desc: 'Laurier palme en pot, 2 mètres. Doit partir vite, déménagement.',                             price: 30.00,  city: 'Paris',           method: 'phone',   imgs: randImgs(3) },
  { sellerEmail: 'bob@seed.test', cat: 'plantes-interieur', title: 'Succulentes assorties — lot de 10 pots',          desc: 'Collection de 10 succulentes différentes, pots 8cm.',                                         price: 25.00,  city: 'Paris',           method: 'message', imgs: randImgs(1) },
  { sellerEmail: 'bob@seed.test', cat: 'services-conseils', title: 'Conseil en aménagement potager',                  desc: 'Jardinier vous aide à planifier votre potager : choix des plants, rotation, associations.',    price: 40.00,  city: 'Paris',           method: 'both',    imgs: randImgs(2) },
  { sellerEmail: 'bob@seed.test', cat: 'mobilier-jardin',   title: 'Table de jardin + 4 chaises métal',               desc: 'Ensemble métal laqué blanc, très bon état. Quelques traces d\'usage normales.',               price: 120.00, city: 'Vincennes',       method: 'phone',   imgs: randImgs(3) },
  { sellerEmail: 'bob@seed.test', cat: 'graines-bulbes',    title: 'Bulbes de tulipes — 50 pièces assorties',         desc: 'Tulipes doubles et simples, couleurs variées. Plantation automne, floraison printemps.',       price: 18.00,  city: 'Paris',           method: 'message', imgs: randImgs(1) },
  { sellerEmail: 'bob@seed.test', cat: 'arbres-arbustes',   title: 'Cognassier du Japon en fleurs',                   desc: 'Arbuste à fleurs orangées décoratives au printemps. H: 1m, pot 25cm.',                        price: 35.00,  city: 'Paris',           method: 'both',    imgs: randImgs(2) },
  { sellerEmail: 'bob@seed.test', cat: 'graines-bulbes',    title: 'Dahlias pompom — 15 tubes enracinés',             desc: 'Dahlia pompom pour bordures, floraison juillet-octobre.',                                      price: 22.00,  city: 'Paris',           method: 'message', imgs: randImgs(1) },

  // carol@seed.test
  { sellerEmail: 'carol@seed.test', cat: 'plantes-fleuries',  title: 'Lavande officinale — lot de 6 plants',         desc: 'Lavande rustique, parfumée. Plants en pot 12cm, prêts à replanter.',                          price: 15.00,  city: 'Marseille',       method: 'both',    imgs: randImgs(2) },
  { sellerEmail: 'carol@seed.test', cat: 'outils-materiel',   title: 'Tuyau d\'arrosage 25m + accessoires',          desc: 'Tuyau caoutchouc armé, résistant UV. Lance multi-jet et raccords inclus.',                   price: 22.50,  city: 'Marseille',       method: 'message', imgs: randImgs(1) },
  { sellerEmail: 'carol@seed.test', cat: 'plantes-interieur', title: 'Ficus Lyrata grand format',                    desc: 'Ficus lyrata en bonne santé, pot 30cm, hauteur ~90cm. Feuilles larges et brillantes.',        price: 55.00,  city: 'Marseille',       method: 'both',    imgs: randImgs(3) },
  { sellerEmail: 'carol@seed.test', cat: 'cours-ateliers',    title: 'Cours de jardinage biologique — débutants',    desc: 'Bases du jardinage naturel : compost, associations de plantes, zéro pesticide.',              price: 30.00,  city: 'Aix-en-Provence', method: 'message', imgs: randImgs(2) },
  { sellerEmail: 'carol@seed.test', cat: 'autres',            title: 'Pot en terre cuite artisanal 40cm',            desc: 'Pot fait main avec soucoupe assortie. Parfait pour plantes d\'extérieur.',                   price: 28.00,  city: 'Marseille',       method: 'phone',   imgs: randImgs(1) },
  { sellerEmail: 'carol@seed.test', cat: 'mobilier-jardin',   title: 'Bac à compost 300L plastique recyclé',         desc: 'Composteur en plastique recyclé, couvercle, trappe de récolte. Parfait état.',                price: 40.00,  city: 'Marseille',       method: 'message', imgs: randImgs(2) },
]

async function seed() {
  // --- Catégories (upsert pour corriger une base existante) ---
  await pool.query(`
    INSERT INTO categories (name, slug, icon) VALUES
      ('Plantes d''intérieur', 'plantes-interieur', NULL),
      ('Plantes fleuries',     'plantes-fleuries',  NULL),
      ('Graines / Bulbes',     'graines-bulbes',    NULL),
      ('Arbres / Arbustes',    'arbres-arbustes',   NULL),
      ('Outils / Matériel',    'outils-materiel',   NULL),
      ('Services / Conseils',  'services-conseils', NULL),
      ('Cours / Ateliers',     'cours-ateliers',    NULL),
      ('Mobilier de jardin',   'mobilier-jardin',   NULL),
      ('Autres',               'autres',            NULL)
    ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, icon = EXCLUDED.icon
  `)
  // Supprime l'ancienne catégorie "Autre" (slug différent) si elle existe
  await pool.query(`DELETE FROM categories WHERE slug = 'autre'`)
  console.log('  catégories mises à jour')

  // --- Comptes utilisateurs ---
  for (const account of ACCOUNTS) {
    const hashed = await bcrypt.hash(account.password, 12)
    await pool.query(
      `INSERT INTO users (email, password, name, role, city, phone)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (email) DO UPDATE
         SET password = EXCLUDED.password,
             name     = EXCLUDED.name,
             phone    = EXCLUDED.phone`,
      [account.email, hashed, account.name, account.role, account.city, account.phone],
    )
    console.log(`  compte  ${account.role.padEnd(10)} ${account.email}  /  ${account.password}`)
  }

  // --- Annonces seed ---
  // Récupère les IDs utilisateurs et catégories
  const { rows: users } = await pool.query('SELECT id, email FROM users')
  const userMap = {}
  for (const u of users) userMap[u.email] = u.id

  const { rows: cats } = await pool.query('SELECT id, slug FROM categories')
  const catMap = {}
  for (const c of cats) catMap[c.slug] = c.id

  // Supprime les annonces seed précédentes (identifiées par les vendeurs seed)
  const seedEmails = LISTINGS_SEED.map(l => l.sellerEmail).filter((v, i, a) => a.indexOf(v) === i)
  const seedUserIds = seedEmails.map(e => userMap[e]).filter(Boolean)
  if (seedUserIds.length) {
    await pool.query(`DELETE FROM listings WHERE user_id = ANY($1)`, [seedUserIds])
  }

  for (const l of LISTINGS_SEED) {
    const userId = userMap[l.sellerEmail]
    if (!userId) { console.warn(`  Utilisateur introuvable : ${l.sellerEmail}`); continue }
    const catId = catMap[l.cat]
    if (!catId) { console.warn(`  Catégorie introuvable : ${l.cat}`); continue }

    const { rows } = await pool.query(
      `INSERT INTO listings (user_id, category_id, title, description, price, city, contact_method, expires_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW() + INTERVAL '90 days')
       RETURNING id`,
      [userId, catId, l.title, l.desc, l.price, l.city, l.method],
    )
    const listingId = rows[0].id
    const vals = l.imgs.map((n, i) => `(${listingId}, '/uploads/seed/image${n}.png', ${i})`).join(', ')
    await pool.query(`INSERT INTO listing_images (listing_id, url, position) VALUES ${vals}`)
    console.log(`  annonce  "${l.title.slice(0, 45)}"`)
  }

  console.log(`\nSeed terminé — ${LISTINGS_SEED.length} annonces créées.`)
  console.log('\nComptes de test :')
  console.log('  user@lunivert.fr   / User1234')
  console.log('  alice@seed.test    / jardin123')
  console.log('  bob@seed.test      / jardin123')
  console.log('  carol@seed.test    / jardin123\n')
  console.log('Mets tes images dans : backend/uploads/seed/  (image1.png … image99.png)')

  await pool.end()
}

seed().catch((err) => {
  console.error('Erreur seed :', err.message)
  process.exit(1)
})
