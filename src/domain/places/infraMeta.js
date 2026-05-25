/** Infraestrutura selecionável ao cadastrar um local esportivo. */
export const INFRASTRUCTURE_OPTIONS = [
  { id: 'iluminacao', label: 'Iluminação', emoji: '💡' },
  { id: 'bebedouros', label: 'Bebedouros', emoji: '🚰' },
  { id: 'vestiario', label: 'Vestiário', emoji: '🚿' },
  { id: 'estacionamento', label: 'Estacionamento', emoji: '🅿️' },
  { id: 'arquibancada', label: 'Arquibancada', emoji: '🪑' },
  { id: 'acessibilidade', label: 'Acessibilidade', emoji: '♿' },
  { id: 'lanchonete', label: 'Lanchonete', emoji: '🍔' },
  { id: 'wifi', label: 'Wi-Fi', emoji: '📶' },
];

export function rotulosInfraestrutura(ids = []) {
  return ids
    .map((id) => INFRASTRUCTURE_OPTIONS.find((o) => o.id === id)?.label)
    .filter(Boolean);
}

/** Resolve chips de infraestrutura a partir dos ids salvos no local. */
export function chipsInfraestrutura(ids = []) {
  const lista = Array.isArray(ids) ? ids : [];
  return lista
    .map((id) => INFRASTRUCTURE_OPTIONS.find((o) => o.id === id))
    .filter(Boolean);
}

export function rotuloInfraestrutura(id) {
  return INFRASTRUCTURE_OPTIONS.find((o) => o.id === id)?.label ?? id;
}
