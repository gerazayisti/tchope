import type { Category } from '@/types';

// Wikimedia Commons images (CC license) - authentic Cameroonian dish photos
// Pexels/Unsplash used as fallbacks when no Wikimedia image exists
export const recipeImages: Record<string, string> = {
  // =================== FEATURED / POPULAR ===================
  'ndole': 'https://upload.wikimedia.org/wikipedia/commons/9/91/Ndol%C3%A8_%C3%A0_la_viande%2C_morue_et_crevettes.jpg',
  'poulet-dg': 'https://upload.wikimedia.org/wikipedia/commons/3/30/Poulet_DG.JPG',
  'eru': 'https://upload.wikimedia.org/wikipedia/commons/5/5f/Eru_Soup.jpg',
  'kondre': 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Kondr%C3%A8_%C3%A0_la_viande_de_b%C5%93uf.png',
  'koki': 'https://upload.wikimedia.org/wikipedia/commons/d/d8/Koki_and_ripe_plantains.jpg',
  'okok': 'https://upload.wikimedia.org/wikipedia/commons/1/1d/Okok.jpg',
  'okok-sale': 'https://upload.wikimedia.org/wikipedia/commons/1/1d/Okok.jpg',
  'poisson-braise': 'https://upload.wikimedia.org/wikipedia/commons/c/c0/Poisson_brais%C3%A9_%C3%A0_la_fa%C3%A7on_du_Cameroun%2C_Kribi.JPG',

  // =================== SAUCES ===================
  'mbongo-tchobi': 'https://upload.wikimedia.org/wikipedia/commons/1/1b/Mbongo_Tchobi_%28sauce_noir%29.jpg',
  'sauce-gombo': 'https://upload.wikimedia.org/wikipedia/commons/4/41/Okro_soup.jpg',
  'gombo-boeuf': 'https://upload.wikimedia.org/wikipedia/commons/4/41/Okro_soup.jpg',
  'gombo-crabe': 'https://upload.wikimedia.org/wikipedia/commons/4/41/Okro_soup.jpg',
  'sauce-darachide': 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Fufu_accompagn%C3%A9_d%27une_sauce_arachide_au_poulet.JPG',
  'sauce-arachide': 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Fufu_accompagn%C3%A9_d%27une_sauce_arachide_au_poulet.JPG',
  'nkui': 'https://upload.wikimedia.org/wikipedia/commons/5/53/Nkui.jpg',
  'egusi': 'https://upload.wikimedia.org/wikipedia/commons/7/72/Eba_and_Egusi_soup.JPG',
  'ndomba': 'https://upload.wikimedia.org/wikipedia/commons/1/1c/Ndomba_de_poulet.jpg',
  'ndomba-de-bar': 'https://upload.wikimedia.org/wikipedia/commons/1/1c/Ndomba_de_poulet.jpg',
  'ndomba-de-porc': 'https://upload.wikimedia.org/wikipedia/commons/1/1c/Ndomba_de_poulet.jpg',

  // =================== GRILLADES ===================
  'soya': 'https://upload.wikimedia.org/wikipedia/commons/3/3c/Suya_meat_in_Northern_Nigeria.jpg',
  'kilishi': 'https://upload.wikimedia.org/wikipedia/commons/9/91/%22Kilishi%22.JPG',

  // =================== ENTRÉES / SALADES ===================
  'salade-avocat': 'https://upload.wikimedia.org/wikipedia/commons/a/a2/Salade_avocat_01.jpg',
  'salade-d-avocat': 'https://upload.wikimedia.org/wikipedia/commons/a/a2/Salade_avocat_01.jpg',
  'salade-de-fruits-exotiques': 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Tropical_fruit.jpg',
  'boulettes-de-viande': 'https://upload.wikimedia.org/wikipedia/commons/8/89/Boulettes_de_viande%2C_IKEA_Gen%C3%A8ve.jpg',
  'boulettes-de-poisson': 'https://images.pexels.com/photos/390382/pexels-photo-390382.jpeg?auto=compress&cs=tinysrgb&w=600',

  // =================== ACCOMPAGNEMENTS ===================
  'plantain-frit': 'https://upload.wikimedia.org/wikipedia/commons/0/04/Un_plat_d%27alloco_Fried_Plantains.JPG',
  'plantains-frits': 'https://upload.wikimedia.org/wikipedia/commons/0/04/Un_plat_d%27alloco_Fried_Plantains.JPG',
  'beignets': 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Nigerian-puff-puff-recipe_cropped.jpg',
  'beignets-haricots': 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Nigerian-puff-puff-recipe_cropped.jpg',
  'beignets-farine': 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Nigerian-puff-puff-recipe_cropped.jpg',
  'beignets-farine-de-ble': 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Nigerian-puff-puff-recipe_cropped.jpg',
  'beignets-de-mais': 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Nigerian-puff-puff-recipe_cropped.jpg',
  'fufu': 'https://upload.wikimedia.org/wikipedia/commons/b/b3/Water_fufu_and_Eru.jpg',
  'water-fufu': 'https://upload.wikimedia.org/wikipedia/commons/b/b3/Water_fufu_and_Eru.jpg',
  'foufou-de-manioc': 'https://upload.wikimedia.org/wikipedia/commons/b/b3/Water_fufu_and_Eru.jpg',
  'foufou-de-mais': 'https://upload.wikimedia.org/wikipedia/commons/b/b3/Water_fufu_and_Eru.jpg',
  'miondo': 'https://upload.wikimedia.org/wikipedia/commons/4/45/Kwanga.jpg',
  'bobolo': 'https://upload.wikimedia.org/wikipedia/commons/4/45/Kwanga.jpg',
  'baton-de-manioc': 'https://upload.wikimedia.org/wikipedia/commons/4/45/Kwanga.jpg',
  'couscous-de-manioc': 'https://upload.wikimedia.org/wikipedia/commons/b/b2/Couscous_de_mil_blanc_de_l%E2%80%99extr%C3%AAme_nord_du_Cameroun.jpg',
  'couscous-de-mais': 'https://upload.wikimedia.org/wikipedia/commons/b/b2/Couscous_de_mil_blanc_de_l%E2%80%99extr%C3%AAme_nord_du_Cameroun.jpg',
  'ekomba': 'https://upload.wikimedia.org/wikipedia/commons/d/d8/Koki_and_ripe_plantains.jpg',

  // =================== PLATS PRINCIPAUX ===================
  'ekwang': 'https://upload.wikimedia.org/wikipedia/commons/e/ec/Ekwang.jpg',
  'kati-kati': 'https://upload.wikimedia.org/wikipedia/commons/6/68/Kati-kati.jpg',
  'njama-njama': 'https://upload.wikimedia.org/wikipedia/commons/3/35/Fufu_corn_and_khati_khati.jpg',
  'crevettes-sauce-tomate': 'https://upload.wikimedia.org/wikipedia/commons/4/47/Crevettes_sur_oignons_grill%C3%A9s.jpg',
  'pepper-soup': 'https://upload.wikimedia.org/wikipedia/commons/e/e9/Pepper_soup_in_northern_Nigeria.jpg',

  // =================== BOISSONS ===================
  'jus-de-folere': 'https://upload.wikimedia.org/wikipedia/commons/e/ea/Bissap_jus_00.jpg',
  'folere': 'https://upload.wikimedia.org/wikipedia/commons/e/ea/Bissap_jus_00.jpg',
  'jus-de-gingembre': 'https://images.pexels.com/photos/4955257/pexels-photo-4955257.jpeg?auto=compress&cs=tinysrgb&w=600',
};

// Fallback images by category (Wikimedia when possible, Pexels otherwise)
export const categoryFallbacks: Record<Category, string> = {
  'Plat': 'https://upload.wikimedia.org/wikipedia/commons/3/30/Poulet_DG.JPG',
  'Sauce': 'https://upload.wikimedia.org/wikipedia/commons/1/1b/Mbongo_Tchobi_%28sauce_noir%29.jpg',
  'Grillade': 'https://upload.wikimedia.org/wikipedia/commons/c/c0/Poisson_brais%C3%A9_%C3%A0_la_fa%C3%A7on_du_Cameroun%2C_Kribi.JPG',
  'Entrée': 'https://upload.wikimedia.org/wikipedia/commons/a/a2/Salade_avocat_01.jpg',
  'Accompagnement': 'https://upload.wikimedia.org/wikipedia/commons/0/04/Un_plat_d%27alloco_Fried_Plantains.JPG',
  'Boisson': 'https://upload.wikimedia.org/wikipedia/commons/e/ea/Bissap_jus_00.jpg',
  'Dessert': 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Nigerian-puff-puff-recipe_cropped.jpg',
};

/**
 * Get the image URL for a recipe by its id and category.
 * Returns a specific image if available, otherwise a category fallback.
 */
export function getRecipeImage(id: string, category: Category): string {
  return recipeImages[id] ?? categoryFallbacks[category];
}
