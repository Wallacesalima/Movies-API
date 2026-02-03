const express = require("express");
const cors = require("cors");
require("dotenv").config();

app.use('/api', moviesRoutes);


app.use(express.static(path.join(__dirname, '../frontEnd')));

const app = express();
const PORT = 3000;

app.use(cors());

// 🔥 Rota de filmes populares
app.get("/api/populares", async (req, res) => {
    const page = req.query.page || 1;
    const apiKey = process.env.API_KEY;
    const url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=pt-BR&page=${page}`;

    try {
        const resposta = await fetch(url);
        const dados = await resposta.json();

        if (!resposta.ok) {
            return res.status(500).json({ erro: "Erro ao buscar filmes." });
        }

        res.json(dados);
    } catch (erro) {
        console.error("Erro ao buscar filmes:", erro.message);
        res.status(500).json({ erro: "Erro ao buscar filmes." });
    }
});

// 🔍 Buscar filmes por nome
app.get("/api/buscar", async (req, res) => {
    const query = req.query.query;
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.API_KEY}&language=pt-BR&query=${encodeURIComponent(query)}`;

    try {
        const resposta = await fetch(url);
        const dados = await resposta.json();
        res.json(dados);
    } catch (erro) {
        console.error("Erro ao buscar filme:", erro.message);
        res.status(500).json({ erro: "Erro ao buscar filme." });
    }
});

// 🎬 Buscar trailer pelo ID do filme
app.get("/api/trailer/:id", async (req, res) => {
    const filmeId = req.params.id;
    const url = `https://api.themoviedb.org/3/movie/${filmeId}/videos?api_key=${process.env.API_KEY}&language=pt-BR`;

    try {
        const resposta = await fetch(url);
        const dados = await resposta.json();
        res.json(dados);
    } catch (erro) {
        console.error("Erro ao buscar trailer:", erro.message);
        res.status(500).json({ erro: "Erro ao buscar trailer." });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});

router.get('/lancamentos', async (req, res) => {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/now_playing?language=pt-BR&page=1&api_key=${process.env.TMDB_API_KEY}`
    );

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar lançamentos' });
  }
});





app.get('/melhores-notas', async (req, res) => {
  const page = req.query.page || 1;

  const response = await fetch(
    `https://api.themoviedb.org/3/discover/movie?` +
    `sort_by=vote_average.desc&vote_count.gte=500&page=${page}&api_key=${API_KEY}`
  );

  const data = await response.json();
  res.json(data);
});



