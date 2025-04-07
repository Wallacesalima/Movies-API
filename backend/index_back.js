const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = 3000;

app.use(cors());

app.get("/api/populares", async (req, res) => {
    const page = req.query.page || 1;
    const url = `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.API_KEY}&language=pt-BR&page=${page}`;

    try {
        const resposta = await fetch(url);
        const dados = await resposta.json();
        res.json(dados);
    } catch (erro) {
        res.status(500).json({ erro: "Erro ao buscar filmes." });
    }
});

app.get("/api/buscar", async (req, res) => {
    const query = req.query.query;
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.API_KEY}&language=pt-BR&query=${encodeURIComponent(query)}`;

    try {
        const resposta = await fetch(url);
        const dados = await resposta.json();
        res.json(dados);
    } catch (erro) {
        res.status(500).json({ erro: "Erro ao buscar filme." });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
