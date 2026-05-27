const IMG =
  'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400&auto=format&fit=crop&q=80';

/** Usuário logado (demo) */
export const USUARIO_ATUAL_ID = 'u-eu';

export const USUARIOS_DEMO = [
  {
    id: USUARIO_ATUAL_ID,
    username: 'Explorador Sportfind',
    cidade: 'São Paulo, Brasil',
    tags: ['Skate', 'Basquete', 'Futebol'],
    bio: 'Apaixonado por esportes ao ar livre.',
    seguidoresIds: ['u-marina', 'u-joao', 'u-ana', 'u-pedro', 'u-lia'],
    seguindoIds: ['u-marina', 'u-joao', 'u-equipe', 'u-ana'],
    publicacoes: [],
  },
  {
    id: 'u-marina',
    username: 'Marina',
    cidade: 'São Paulo, Brasil',
    tags: ['Escalada', 'Corrida'],
    bio: 'Sempre em busca da próxima aventura.',
    seguidoresIds: ['u-eu', 'u-joao'],
    seguindoIds: ['u-eu', 'u-equipe'],
    publicacoes: [
      { id: 'm1', tipo: 'imagem', url: IMG, descricao: 'Treino na quadra', dataCriacao: 'Há 2 dias' },
      { id: 'm2', tipo: 'imagem', url: IMG, descricao: 'Pelada de sábado', dataCriacao: 'Há 1 semana' },
    ],
  },
  {
    id: 'u-joao',
    username: 'João',
    cidade: 'Campinas, Brasil',
    tags: ['Ciclismo', 'Futebol'],
    bio: 'Pedalo todo fim de semana.',
    seguidoresIds: ['u-eu', 'u-marina'],
    seguindoIds: ['u-marina'],
    publicacoes: [
      { id: 'j1', tipo: 'imagem', url: IMG, descricao: 'Pedal matinal', dataCriacao: 'Ontem' },
    ],
  },
  {
    id: 'u-ana',
    username: 'Ana',
    cidade: 'Santos, Brasil',
    tags: ['Corrida', 'Natação'],
    bio: 'Corredora amadora.',
    seguidoresIds: ['u-eu'],
    seguindoIds: ['u-equipe', 'u-marina'],
    publicacoes: [
      { id: 'a1', tipo: 'imagem', url: IMG, descricao: 'Corrida na orla', dataCriacao: 'Há 3 dias' },
    ],
  },
  {
    id: 'u-equipe',
    username: 'Equipe Sportfind',
    cidade: 'Brasil',
    tags: ['Comunidade'],
    bio: 'Novidades e partidas da comunidade.',
    seguidoresIds: ['u-eu', 'u-marina', 'u-joao', 'u-ana'],
    seguindoIds: [],
    publicacoes: [
      {
        id: 'e1',
        tipo: 'partida',
        nomePartida: 'Pelada aberta',
        esporte: 'Futebol',
        horario: 'Sáb., 10:00',
        descricao: 'Venha jogar conosco!',
        dataCriacao: 'Há 5 h',
      },
    ],
  },
  {
    id: 'u-comunidade',
    username: 'Comunidade',
    cidade: 'São Paulo, Brasil',
    tags: ['Locais'],
    bio: 'Descobertas de locais esportivos.',
    seguidoresIds: [],
    seguindoIds: ['u-equipe'],
    publicacoes: [],
  },
  {
    id: 'u-pedro',
    username: 'Pedro',
    cidade: 'São Paulo, Brasil',
    tags: ['Basquete'],
    bio: 'Armador nas horas vagas.',
    seguidoresIds: ['u-eu'],
    seguindoIds: ['u-eu', 'u-marina'],
    publicacoes: [],
  },
  {
    id: 'u-lia',
    username: 'Lia',
    cidade: 'Guarulhos, Brasil',
    tags: ['Vôlei'],
    bio: 'Vôlei de praia todo domingo.',
    seguidoresIds: ['u-eu'],
    seguindoIds: ['u-joao'],
    publicacoes: [],
  },
];
