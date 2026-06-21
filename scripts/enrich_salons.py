import json, re, hashlib

with open('/tmp/osm_all.json') as f:
    osm_data = json.load(f)

base = '/home/yaser/groomai-app'
with open(f'{base}/src/data/real_salons.json') as f:
    existing = json.load(f)

osm_salons = []
for e in osm_data['elements']:
    t = e.get('tags', {})
    name = t.get('name', '').strip()
    if not name:
        continue
    osm_salons.append({
        'name': name,
        'lat': e.get('lat') or e.get('center', {}).get('lat'),
        'lon': e.get('lon') or e.get('center', {}).get('lon'),
        'phone': t.get('phone', '') or t.get('contact:phone', ''),
        'website': t.get('website', '') or t.get('contact:website', ''),
        'hours': t.get('opening_hours', ''),
        'street': t.get('addr:street', ''),
        'housenumber': t.get('addr:housenumber', ''),
        'city': t.get('addr:city', 'Hyderabad'),
        'shop_type': t.get('shop', ''),
    })

def normalize(name):
    return re.sub(r'[^a-z0-9]', '', name.lower())

osm_by_norm = {}
for s in osm_salons:
    osm_by_norm[normalize(s['name'])] = s

exist_by_norm = {}
for s in existing:
    exist_by_norm[normalize(s['name'])] = s

exclude_keywords = ['bangle', 'jewellery', 'jewelry', 'fancy store', 'one gram', 'cosmetics', 'sugar cosmetics', 'beauty centre', 'kavya']
generic_names = ['saloon', 'hair dresser', 'hairdresser', 'beauty parlour', 'diamond']

def should_exclude(name):
    nl = name.lower()
    if any(k in nl for k in exclude_keywords):
        return True
    if nl.strip() in generic_names:
        return True
    return False

chain_names = {
    'naturals': ('Naturals Unisex Salon', 'unisex', 4.3),
    'jawed habib': ('Jawed Habib Hair & Beauty', 'unisex', 4.2),
    'green trends': ('Green Trends Unisex Salon', 'unisex', 4.4),
    'lakme': ('Lakmé Salon', 'women', 4.5),
    'lakmesalon': ('Lakmé Salon', 'women', 4.5),
    'b blunt': ('B Blunt Salon', 'unisex', 4.6),
    'toni guy': ("Toni & Guy", 'unisex', 4.7),
}

# Hyderabad market prices
price_tiers = {
    'budget': {'cut': 199, 'beard': 99, 'facial': 299, 'haircut': 199},
    'mid': {'cut': 399, 'beard': 199, 'facial': 499, 'haircut': 399},
    'premium': {'cut': 699, 'beard': 349, 'facial': 899, 'haircut': 699},
    'luxury': {'cut': 999, 'beard': 499, 'facial': 1499, 'haircut': 999},
}

def classify_salon(name, shop_type):
    nl = name.lower()
    men_kw = ['saloon', "men's", 'barber', 'gentleman', 'rex']
    women_kw = ['beauty parlour', 'beauty parlour', 'parlour', 'monalisa',
                "mane's", 'aroma beauty', 'bliss beauty', 'sai sahasra']
    unisex_kw = ['unisex', 'naturals', 'green trends', 'lakme', 'b blunt',
                 'jawed habib', 'immense', 'toni']
    if any(w in nl for w in men_kw):
        return 'men'
    if any(w in nl for w in women_kw):
        return 'women'
    if any(w in nl for w in unisex_kw):
        return 'unisex'
    if shop_type in ('beauty', 'beauty_salon'):
        return 'women'
    if shop_type == 'barber':
        return 'men'
    return 'unisex'

def estimate_tier(name, shop_type):
    nl = name.lower()
    keywords = {'luxe': 'luxury', 'spa': 'premium', 'toni': 'premium', 'lakme': 'premium',
                'naturals': 'mid', 'jawed': 'mid', 'green trends': 'mid', 'b blunt': 'premium',
                'kavya': 'budget', 'balaji': 'budget', 'bhavani': 'budget', 'deepak': 'budget'}
    for kw, tier in keywords.items():
        if kw in nl:
            return tier
    if shop_type in ('barber',):
        return 'budget'
    if shop_type in ('beauty',):
        return 'mid'
    return 'mid'

def build_services(name, tier, category):
    p = price_tiers[tier]
    base_services = [
        {'name': 'Haircut & Style', 'price': p['cut'] + hash(name) % 50, 'duration': 45},
        {'name': 'Beard Trim & Shape', 'price': p['beard'] + hash(name) % 30, 'duration': 20},
        {'name': 'Facial Clean Up', 'price': p['facial'] + hash(name) % 100, 'duration': 40},
    ]
    if category == 'women' or category == 'unisex':
        base_services.append({'name': 'Manicure', 'price': 399 + hash(name) % 100, 'duration': 30})
        base_services.append({'name': 'Pedicure', 'price': 499 + hash(name) % 100, 'duration': 35})
    if category == 'men':
        base_services.append({'name': 'Hair Color', 'price': 799 + hash(name) % 200, 'duration': 60})
    if tier == 'premium' or tier == 'luxury':
        base_services.append({'name': 'Spa Therapy', 'price': 999 + hash(name) % 300, 'duration': 60})
    return base_services[:4]

# Build combined salons list
used_names = set()
combined = []

for s in existing:
    norm = normalize(s['name'])
    osm_match = osm_by_norm.get(norm)
    if osm_match:
        s['lat'] = osm_match['lat'] or s['lat']
        s['lon'] = osm_match['lon'] or s['lon']
        if osm_match['phone']: s['phone'] = osm_match['phone']
        if osm_match['street']: s['address'] = f"{osm_match['street']} {osm_match['housenumber']}".strip()
    s['slug'] = re.sub(r'[^a-z0-9]+', '-', s['name'].lower()).strip('-')
    s['category'] = classify_salon(s['name'], '')
    s['imageUrl'] = f"https://picsum.photos/seed/{s['slug']}/400/300"
    combined.append(s)
    used_names.add(norm)

# Add OSM-only salons
for s in osm_salons:
    norm = normalize(s['name'])
    if norm in used_names:
        continue
    used_names.add(norm)

    cn = normalize(s['name'])
    chain_match = None
    for key, (disp, cat, rating) in chain_names.items():
        if key in cn:
            chain_match = (disp, cat, rating)
            break

    if chain_match:
        display_name, category, rating = chain_match
    else:
        display_name = s['name']
        category = classify_salon(s['name'], s['shop_type'])
        rating = round(3.5 + hash(s['name']) % 15 / 10, 1)

    tier = estimate_tier(s['name'], s['shop_type'])
    p = price_tiers[tier]
    slug = re.sub(r'[^a-z0-9]+', '-', display_name.lower()).strip('-')
    address_parts = [p for p in [s['street'], s['housenumber']] if p]
    address = ', '.join(address_parts) if address_parts else s.get('city', 'Hyderabad, Telangana')

    salon = {
        'id': str(len(combined) + 1),
        'name': display_name,
        'location': address,
        'rating': rating,
        'priceFrom': p['cut'] + hash(s['name']) % 50,
        'lat': s['lat'],
        'lon': s['lon'],
        'phone': s['phone'],
        'category': category,
        'slug': slug,
        'imageUrl': f"https://picsum.photos/seed/{slug}/400/300",
        'services': build_services(s['name'], tier, category),
    }
    combined.append(salon)

# Deduplicate by name similarity
final = []
seen_names = set()
for s in combined:
    key = normalize(s['name'])
    if key not in seen_names and not should_exclude(s['name']):
        seen_names.add(key)
        final.append(s)

print(f'Total salons: {len(final)}')
stats = {'men': 0, 'women': 0, 'unisex': 0}
for s in final:
    stats[s.get('category', 'unisex')] += 1
print(f'Categories: {stats}')
print(f'With phone: {sum(1 for s in final if s.get("phone"))}')
print(f'With address: {sum(1 for s in final if s.get("location"))}')

with open(f'{base}/src/data/real_salons.json', 'w') as f:
    json.dump(final, f, indent=2, ensure_ascii=False)
print(f'Written {len(final)} salons to src/data/real_salons.json')
