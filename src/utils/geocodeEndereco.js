const cepCache = new Map();

function normalizarCep(cep) {
  return String(cep ?? '').replace(/\D/g, '');
}

function salvarCache(chave, valor) {
  if (cepCache.size > 80) {
    const primeira = cepCache.keys().next().value;
    cepCache.delete(primeira);
  }
  cepCache.set(chave, valor);
}

async function fetchJson(url, options = {}) {
  const res = await fetch(url, options);
  if (!res.ok) return null;
  return res.json();
}

async function buscarViaCep(digits) {
  const data = await fetchJson(`https://viacep.com.br/ws/${digits}/json/`);
  if (!data || data.erro) return null;
  return {
    rua: data.logradouro ?? '',
    bairro: data.bairro ?? '',
    cidade: data.localidade ?? '',
    estado: data.uf ?? '',
    cep: data.cep ?? digits,
  };
}

async function buscarBrasilApi(digits) {
  const data = await fetchJson(`https://brasilapi.com.br/api/cep/v1/${digits}`);
  if (!data) return null;
  return {
    rua: data.street ?? '',
    bairro: data.neighborhood ?? '',
    cidade: data.city ?? '',
    estado: data.state ?? '',
    cep: data.cep ?? digits,
  };
}

export async function buscarEnderecoPorCep(cep, signal) {
  const digits = normalizarCep(cep);
  if (digits.length !== 8) return null;

  const cacheKey = `addr:${digits}`;
  if (cepCache.has(cacheKey)) return cepCache.get(cacheKey);

  const resultado = await new Promise((resolve) => {
    let resolvido = false;
    const finalizar = (valor) => {
      if (resolvido) return;
      if (!valor) return;
      resolvido = true;
      resolve(valor);
    };

    const tentativas = [buscarViaCep(digits), buscarBrasilApi(digits)];
    tentativas.forEach((tentativa) => {
      tentativa.then(finalizar).catch(() => {});
    });

    if (signal) {
      signal.addEventListener(
        'abort',
        () => {
          if (!resolvido) {
            resolvido = true;
            resolve(null);
          }
        },
        { once: true },
      );
    }

    Promise.allSettled(tentativas).then((results) => {
      if (resolvido) return;
      const sucesso = results.find((r) => r.status === 'fulfilled' && r.value);
      resolvido = true;
      resolve(sucesso?.value ?? null);
    });
  });

  if (resultado) salvarCache(cacheKey, resultado);
  return resultado;
}

function montarConsulta(endereco) {
  return [
    [endereco.rua, endereco.numero].filter(Boolean).join(' '),
    endereco.bairro,
    endereco.cidade,
    endereco.estado,
    'Brasil',
  ]
    .filter(Boolean)
    .join(', ');
}

async function geocodificarComPhoton(query, signal) {
  const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=1&lang=pt`;
  const data = await fetchJson(url, { signal });
  const coords = data?.features?.[0]?.geometry?.coordinates;
  if (!coords?.length) return null;

  const lng = Number(coords[0]);
  const lat = Number(coords[1]);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  return { lat, lng };
}

async function geocodificarComNominatim(query, signal) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`;
  const results = await fetchJson(url, {
    signal,
    headers: { 'Accept-Language': 'pt-BR', 'User-Agent': 'Sportfind/1.0' },
  });
  if (!results?.length) return null;

  const lat = Number(results[0].lat);
  const lng = Number(results[0].lon);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  return { lat, lng };
}

async function primeiroResultado(tarefas) {
  return new Promise((resolve) => {
    let pendentes = tarefas.length;
    let resolvido = false;

    const finalizar = (valor) => {
      if (resolvido || !valor) return;
      resolvido = true;
      resolve(valor);
    };

    tarefas.forEach((tarefa) => {
      tarefa
        .then(finalizar)
        .catch(() => {})
        .finally(() => {
          pendentes -= 1;
          if (!resolvido && pendentes === 0) resolve(null);
        });
    });
  });
}

export async function geocodificarEndereco(endereco, signal) {
  const consulta = montarConsulta(endereco);
  if (!consulta) return null;

  const cacheKey = `geo:${consulta.toLowerCase()}`;
  if (cepCache.has(cacheKey)) return cepCache.get(cacheKey);

  const coords = await primeiroResultado([
    geocodificarComPhoton(consulta, signal),
    geocodificarComNominatim(consulta, signal),
  ]);

  if (coords) salvarCache(cacheKey, coords);
  return coords;
}

export async function buscarCepEGeocodificar(cep, { signal, onEndereco } = {}) {
  const digits = normalizarCep(cep);
  if (digits.length !== 8) return null;

  const cacheKey = `full:${digits}`;
  if (cepCache.has(cacheKey)) {
    const cached = cepCache.get(cacheKey);
    onEndereco?.(cached);
    return cached;
  }

  const endereco = await buscarEnderecoPorCep(digits, signal);
  if (!endereco) return null;

  onEndereco?.(endereco);

  const coords = await geocodificarEndereco(endereco, signal);
  const resultado = coords
    ? { ...endereco, ...coords }
    : { ...endereco, lat: null, lng: null };

  salvarCache(cacheKey, resultado);
  return resultado;
}
