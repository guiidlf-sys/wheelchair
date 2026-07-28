import type { ChairVariantDef, PartsState, PartState } from '../types';
import { ACCESSORIES } from '../data/accessories';

export interface PartUpdate {
  partId: string;
  changes: Partial<PartState>;
}

export interface AssistantCommandResult {
  reply: string;
  updates?: PartUpdate[];
  resetPartIds?: string[];
  resetAll?: boolean;
  accessoryToggles?: { id: string; enabled: boolean }[];
}

function normalize(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function stripPlural(word: string): string {
  return word.length > 3 && word.endsWith('s') ? word.slice(0, -1) : word;
}

function rawTokenize(str: string): string[] {
  return normalize(str).split(' ').filter(Boolean);
}

function tokenize(str: string): string[] {
  return rawTokenize(str).map(stripPlural);
}

function joinList(items: string[]): string {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} et ${items[1]}`;
  return `${items.slice(0, -1).join(', ')} et ${items[items.length - 1]}`;
}

interface PartIndexEntry {
  id: string;
  base: string[];
  side?: 'left' | 'right';
}

function buildPartIndex(variant: ChairVariantDef): PartIndexEntry[] {
  return variant.parts.map((part) => {
    const rawTokens = tokenize(part.label);
    let side: 'left' | 'right' | undefined;
    const base: string[] = [];
    for (const t of rawTokens) {
      if (t === 'gauche') side = 'left';
      else if (t === 'droit' || t === 'droite') side = 'right';
      else base.push(t);
    }
    return { id: part.id, base, side };
  });
}

function matchPartIndex(tokens: string[], variant: ChairVariantDef, mode: 'strict' | 'relaxed'): string[] {
  const index = buildPartIndex(variant);
  const wantSide: 'left' | 'right' | undefined = tokens.includes('gauche')
    ? 'left'
    : tokens.includes('droit') || tokens.includes('droite')
      ? 'right'
      : undefined;

  let matches =
    mode === 'strict'
      ? index.filter((p) => p.base.length > 0 && p.base.every((t) => tokens.includes(t)))
      : index.filter((p) => p.base.some((t) => t.length >= 4 && tokens.includes(t)));

  if (wantSide) {
    const sideFiltered = matches.filter((p) => !p.side || p.side === wantSide);
    if (sideFiltered.length) matches = sideFiltered;
  }
  return matches.map((p) => p.id);
}

function findPartIds(tokens: string[], variant: ChairVariantDef): string[] {
  const strict = matchPartIndex(tokens, variant, 'strict');
  return strict.length ? strict : matchPartIndex(tokens, variant, 'relaxed');
}

function labelsFor(ids: string[], variant: ChairVariantDef): string[] {
  return ids.map((id) => {
    const label = variant.parts.find((p) => p.id === id)?.label ?? id;
    return label.charAt(0).toLowerCase() + label.slice(1);
  });
}

const STOPWORDS = new Set(['a', 'de', 'du', 'le', 'la', 'les', 'un', 'une', 'des', 'et']);

interface AccessoryIndexEntry {
  id: string;
  base: string[];
}

const ACCESSORY_INDEX: AccessoryIndexEntry[] = ACCESSORIES.map((acc) => ({
  id: acc.id,
  base: tokenize(acc.label).filter((t) => t.length >= 2 && !STOPWORDS.has(t)),
}));

function matchAccessoryIndex(tokens: string[], mode: 'strict' | 'relaxed'): string[] {
  const matches =
    mode === 'strict'
      ? ACCESSORY_INDEX.filter((a) => a.base.length > 0 && a.base.every((t) => tokens.includes(t)))
      : ACCESSORY_INDEX.filter((a) => a.base.some((t) => t.length >= 4 && tokens.includes(t)));
  return matches.map((a) => a.id);
}

interface CommandTarget {
  kind: 'part' | 'accessory';
  ids: string[];
}

/**
 * Resolves an add/remove target across BOTH the chair-part list and the
 * accessory library, strict matches first in either domain before ever
 * falling back to relaxed (single-shared-word) matching in either domain.
 *
 * This matters because relaxed matching alone is ambiguous across domains:
 * e.g. "avant" is a shared relaxed-match word between the caster parts
 * ("Roulette avant gauche/droite") and the "Panier avant" accessory, so a
 * part-first / relaxed-first search would let "enlève le panier avant"
 * get hijacked by the (irrelevant) casters purely because relaxed part
 * matching was tried before accessory matching got a chance at all — even
 * though "panier avant" is an exact accessory name. Trying strict matches
 * in both domains before relaxed matches in either domain fixes that.
 */
function resolveTarget(tokens: string[], variant: ChairVariantDef, accessoriesSupported: boolean): CommandTarget | null {
  const strictParts = matchPartIndex(tokens, variant, 'strict');
  if (strictParts.length) return { kind: 'part', ids: strictParts };

  if (accessoriesSupported) {
    const strictAccessories = matchAccessoryIndex(tokens, 'strict');
    if (strictAccessories.length) return { kind: 'accessory', ids: strictAccessories };
  }

  const relaxedParts = matchPartIndex(tokens, variant, 'relaxed');
  if (relaxedParts.length) return { kind: 'part', ids: relaxedParts };

  if (accessoriesSupported) {
    const relaxedAccessories = matchAccessoryIndex(tokens, 'relaxed');
    if (relaxedAccessories.length) return { kind: 'accessory', ids: relaxedAccessories };
  }

  return null;
}

function accessoryLabelsFor(ids: string[]): string[] {
  return ids.map((id) => {
    const label = ACCESSORIES.find((a) => a.id === id)?.label ?? id;
    return label.charAt(0).toLowerCase() + label.slice(1);
  });
}

const COLOR_WORDS: Record<string, string> = {
  'bleu marine': '#1b2a4a',
  rouge: '#c0392b',
  bleu: '#2969b0',
  marine: '#1b2a4a',
  vert: '#2e8b57',
  jaune: '#f1c40f',
  orange: '#e67e22',
  violet: '#8e44ad',
  mauve: '#9b59b6',
  rose: '#e6739f',
  noir: '#161616',
  blanc: '#f2f2f2',
  gris: '#8a8a8a',
  marron: '#6b4423',
  brun: '#6b4423',
  beige: '#d8c3a5',
  turquoise: '#16a2b8',
  cyan: '#16a2b8',
  dore: '#c9a227',
  or: '#c9a227',
  argente: '#bdc3c7',
  argent: '#bdc3c7',
  bordeaux: '#6e1423',
  kaki: '#6b6b3a',
  corail: '#e8735c',
};

function detectColor(norm: string): { name: string; hex: string } | null {
  const keys = Object.keys(COLOR_WORDS).sort((a, b) => b.length - a.length);
  for (const key of keys) {
    const re = new RegExp(`\\b${key}\\b`);
    if (re.test(norm)) return { name: key, hex: COLOR_WORDS[key] };
  }
  return null;
}

const RESET_VERBS = ['reinitialise', 'reinitialiser', 'reset'];
const REMOVE_VERBS = ['enleve', 'enlever', 'retire', 'retirer', 'supprime', 'supprimer', 'cache', 'cacher', 'masque', 'masquer', 'vire', 'virer'];
const ADD_VERBS = ['remets', 'remettre', 'rajoute', 'rajouter', 'ajoute', 'ajouter', 'affiche', 'afficher'];

/**
 * Local rule-based command interpreter (no network calls). Returns null when
 * the input doesn't look like a customization instruction, so the caller can
 * fall back to answerQuestion() for a general FAQ-style reply.
 */
export function interpretCommand(
  input: string,
  variant: ChairVariantDef,
  partsState: PartsState,
  accessoriesSupported: boolean,
): AssistantCommandResult | null {
  const tokens = tokenize(input);
  const rawTokens = rawTokenize(input);
  const norm = normalize(input);
  const wantsAll = rawTokens.some((t) => t.startsWith('tout') || t.startsWith('entier'));

  if (rawTokens.some((t) => RESET_VERBS.includes(t))) {
    if (wantsAll) {
      return { reply: "Toutes les pièces ont été réinitialisées à leurs couleurs et réglages d'origine.", resetAll: true };
    }
    const ids = findPartIds(tokens, variant);
    if (ids.length) {
      return { reply: `J'ai réinitialisé ${joinList(labelsFor(ids, variant))}.`, resetPartIds: ids };
    }
    return { reply: "Je n'ai pas trouvé la pièce à réinitialiser. Essaie « réinitialise le dossier » ou « réinitialise tout »." };
  }

  if (rawTokens.some((t) => REMOVE_VERBS.includes(t))) {
    const target = resolveTarget(tokens, variant, accessoriesSupported);
    if (!target) {
      return { reply: "Je n'ai pas identifié quelle pièce retirer. Essaie par exemple « enlève les accoudoirs » ou « enlève le sac à dos »." };
    }
    if (target.kind === 'accessory') {
      return {
        reply: `J'ai enlevé ${joinList(accessoryLabelsFor(target.ids))}.`,
        accessoryToggles: target.ids.map((id) => ({ id, enabled: false })),
      };
    }
    const ids = target.ids;
    const removable = ids.filter((id) => variant.parts.find((p) => p.id === id)?.removable);
    const blocked = ids.filter((id) => !removable.includes(id));
    if (!removable.length) {
      return { reply: `${joinList(labelsFor(ids, variant))} ${ids.length > 1 ? 'ne peuvent' : 'ne peut'} pas être retiré(e) — c'est une pièce structurelle du fauteuil.` };
    }
    let reply = `J'ai retiré ${joinList(labelsFor(removable, variant))}.`;
    if (blocked.length) {
      reply += ` (${joinList(labelsFor(blocked, variant))} ${blocked.length > 1 ? 'ne peuvent' : 'ne peut'} pas être retiré(e) — pièce structurelle.)`;
    }
    return { reply, updates: removable.map((id) => ({ partId: id, changes: { visible: false } })) };
  }

  // Checked before ADD_VERBS on purpose: "ajoute" is itself an add-verb, so
  // without this ordering a color instruction like "ajoute du bleu sur le
  // dossier" would be swallowed by the ADD branch's part search (which
  // matches "dossier" and just no-ops its visibility) before the color word
  // was ever looked at.
  const color = detectColor(norm);
  if (color) {
    let ids = findPartIds(tokens, variant);
    if (!ids.length && (wantsAll || norm.includes('fauteuil'))) {
      ids = variant.parts.filter((p) => partsState[p.id]?.visible !== false).map((p) => p.id);
    }
    if (!ids.length) {
      return {
        reply: `De quelle pièce veux-tu parler ? Précise par exemple « mets le dossier en ${color.name} » ou « mets tout le fauteuil en ${color.name} ».`,
      };
    }
    return {
      reply: `J'ai mis ${joinList(labelsFor(ids, variant))} en ${color.name}.`,
      updates: ids.map((id) => ({ partId: id, changes: { color: color.hex } })),
    };
  }

  if (rawTokens.some((t) => ADD_VERBS.includes(t))) {
    const target = resolveTarget(tokens, variant, accessoriesSupported);
    if (!target) {
      return {
        reply: accessoriesSupported
          ? "Je n'ai pas identifié quoi ajouter. Essaie par exemple « remets les accoudoirs » pour une pièce du fauteuil, ou « ajoute un sac à dos » pour un accessoire."
          : "Je n'ai pas identifié quelle pièce remettre. Essaie par exemple « remets les accoudoirs ».",
      };
    }
    if (target.kind === 'accessory') {
      return {
        reply: `J'ai ajouté ${joinList(accessoryLabelsFor(target.ids))}.`,
        accessoryToggles: target.ids.map((id) => ({ id, enabled: true })),
      };
    }
    return {
      reply: `J'ai remis ${joinList(labelsFor(target.ids, variant))}.`,
      updates: target.ids.map((id) => ({ partId: id, changes: { visible: true } })),
    };
  }

  return null;
}

interface FaqEntry {
  keywords: string[];
  answer: string;
}

const FAQ: FaqEntry[] = [
  {
    keywords: ['manuel ou electrique', 'difference entre manuel', 'quel fauteuil choisir', 'quel type de fauteuil', 'lequel choisir'],
    answer:
      "Le fauteuil manuel est plus léger, moins cher et demande de la force dans les bras ou l'aide d'un accompagnant. L'électrique convient pour les longues distances ou une mobilité des bras réduite, mais il est plus lourd et plus cher. Le sport/léger est pensé pour l'activité physique. Tu peux comparer les trois dans le catalogue et personnaliser celui qui te correspond.",
  },
  {
    keywords: ['exporter', 'telecharger', 'montrer au fabricant', 'envoyer au fabricant', 'fichier 3d', 'glb'],
    answer:
      "Une fois tes modifications faites, utilise le panneau « Export » à droite : tu peux télécharger une image annotée ou le modèle 3D au format GLB pour le montrer directement à un fabricant.",
  },
  {
    keywords: ['annotation', 'note sur le fauteuil', 'ajouter une remarque', 'commentaire sur une piece'],
    answer:
      "Active le mode annotation dans le panneau de droite, puis clique sur le fauteuil en 3D à l'endroit voulu pour ajouter une note précise (ex : « renforcer cette zone »).",
  },
  {
    keywords: ['importer', 'mon propre modele', 'fichier obj', 'fichier stl', 'fichier gltf'],
    answer:
      "Depuis la page Catalogue ou Personnalisation, tu peux glisser-déposer ton propre fichier .glb, .gltf, .obj ou .stl pour partir de ton fauteuil exact plutôt que d'un des modèles proposés.",
  },
  {
    keywords: ['aide financiere', 'remboursement', 'mdph', 'prix', 'combien coute', 'financement'],
    answer:
      "En France, une partie du coût peut être prise en charge via la MDPH, la Sécurité sociale ou une mutuelle selon le type de fauteuil et une prescription médicale. Ce site ne gère pas ces démarches : renseigne-toi auprès de ta MDPH ou d'un professionnel de santé pour ton cas précis.",
  },
  {
    keywords: ['entretien', 'nettoyer', 'nettoyage', 'reviser', 'entretenir'],
    answer:
      "Vérifie régulièrement la pression des roues, nettoie le châssis avec un chiffon humide, et fais réviser les freins et roulements par un professionnel au moins une fois par an.",
  },
  {
    keywords: ['largeur', 'dimension', 'taille standard', 'mesure du fauteuil'],
    answer:
      "La largeur d'assise standard varie généralement entre 40 et 46 cm, mais elle doit être ajustée à la morphologie de la personne — un professionnel peut prendre les mesures précises.",
  },
  {
    keywords: ['plage', 'tout terrain', 'exterieur', 'sable', 'terrain difficile'],
    answer:
      "Regarde le fauteuil de plage ou le fauteuil sport dans le catalogue : ils ont de grandes roues adaptées aux terrains irréguliers. Tu peux aussi ouvrir un modèle électrique ou manuel et personnaliser les roues.",
  },
  {
    keywords: ['qui fabrique', 'vous fabriquez', 'c est quoi ce site', 'a quoi sert ce site'],
    answer:
      "Ce site ne fabrique pas de fauteuils : il t'aide à visualiser et personnaliser un modèle en 3D, puis à exporter le résultat (image ou fichier 3D) pour le montrer à un fabricant ou un revendeur.",
  },
  {
    keywords: ['aide', 'comment ca marche', 'que peux tu faire', 'qu est ce que tu peux faire', 'commandes'],
    answer:
      "Je peux modifier ton fauteuil (ex : « mets le dossier en bleu », « enlève les accoudoirs », « réinitialise tout »), ajouter des accessoires (ex : « ajoute un sac à dos », « enlève le parapluie ») et répondre à des questions courantes (choix du fauteuil, entretien, aides financières, export...). Je suis un assistant intégré au site, pas une IA connectée à Internet.",
  },
];

const DEFAULT_REPLY =
  "Je n'ai pas de réponse toute prête pour ça. Je peux modifier ton fauteuil (couleur, pièces à retirer) ou répondre à des questions sur le choix, l'entretien, les aides financières ou l'export. Essaie par exemple « mets l'assise en vert » ou « comment exporter mon fauteuil ? ».";

/** Local FAQ lookup (no network calls). Matches whole (plural-stripped) words, not raw substrings. */
export function answerQuestion(input: string): string {
  const inputTokens = tokenize(input);
  for (const entry of FAQ) {
    if (entry.keywords.some((k) => tokenize(k).every((t) => inputTokens.includes(t)))) return entry.answer;
  }
  return DEFAULT_REPLY;
}
