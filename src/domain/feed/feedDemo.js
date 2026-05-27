import { PLACES } from '../places';

const AUTORES = [
  { nome: 'Marina' },
  { nome: 'Equipe Sportfind' },
  { nome: 'João' },
  { nome: 'Ana' },
  { nome: 'Comunidade' },
];

const TEMPOS = ['Há 2 h', 'Ontem', 'Há 3 h', 'Há 1 dia', 'Há 5 h'];

export const PARTIDA_DEMO = {
  id: 'partida-demo',
  kind: 'partida',
  nomePartida: 'Pelada de sábado',
  esporte: 'Futebol',
  horario: 'Sáb., 15:00',
  local: PLACES[0],
  username: 'Marina',
  dataCriacao: 'Há 1 h',
  likes: 14,
  comentarios: 3,
  maxParticipantes: 12,
  participantes: ['u1', 'u2'],
};

/** Publicações demo usadas no feed e na busca. */
export function montarPublicacoesDemo() {
  const postsLocais = PLACES.map((place, indice) => ({
    id: `local-${place.id}`,
    kind: 'local',
    local: place,
    username: AUTORES[indice % AUTORES.length].nome,
    dataCriacao: TEMPOS[indice % TEMPOS.length],
    likes: 12 + ((place.id * 7) % 80),
    comentarios: 1 + ((place.id * 3) % 12),
    descricao: place.description,
  }));

  const imagemDemo = [
    'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=800&auto=format&fit=crop&q=80',
  ];

  const postsImagem = [
    {
      id: 'img-1',
      kind: 'imagem',
      url: imagemDemo[0],
      username: AUTORES[0].nome,
      dataCriacao: TEMPOS[2],
      likes: 48,
      comentarios: 7,
      descricao: 'Melhor jogo do mês!',
    },
    {
      id: 'img-2',
      kind: 'imagem',
      url: imagemDemo[1],
      username: AUTORES[2].nome,
      dataCriacao: TEMPOS[4],
      likes: 21,
      comentarios: 2,
      descricao: 'Pelada no fim de semana.',
    },
  ];

  return [PARTIDA_DEMO, ...postsLocais, ...postsImagem];
}
