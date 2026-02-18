
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

function carregarApi(url) {
    return fetch(url)
        .then(res => res.json());
}




