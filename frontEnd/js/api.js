
function carregarTrailerApi(idFilme) {
    const urlTrailer = `${API_BASE_URL}/trailer/${idFilme}`;

    return fetch(urlTrailer)
        .then(res => res.json())
}

function buscarFilmeApi(query) {
    const urlBusca = `${API_BASE_URL}/buscar?query=${encodeURIComponent(query)}`;

    return fetch(urlBusca)
        .then(res => res.json())
}

function carregarFilmesPopularesApi(url) {
    return fetch(url)
        .then(res => res.json())
}

function carregarMelhoresNotasApi(url) {
    return fetch(url)
        .then(res => res.json())
}

function carregarLancamentosApi(url) {
    return fetch(url)
        .then(res => res.json());
}
function carregarProximosApi(url) {
    return fetch(url)
        .then(res => res.json());
}




