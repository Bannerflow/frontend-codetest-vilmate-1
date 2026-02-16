import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Stack,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
} from "@mui/material";

import { Pokemon } from "@/models/Pokemon";

type PokemonListItem = {
  name: string;
  url: string;
};

export default function PokemonList() {
  const [offset, setOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const limit = 10;

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const res = await fetch( `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}` );
        const data = await res.json();

        const detailed = await Promise.all(
          data.results.map(async (p: PokemonListItem) => {
            const detailsRes = await fetch(p.url);
            return (new Pokemon(await detailsRes.json()));
          })
        );
        setPokemons(detailed);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [offset]);

  const handleNext = () => setOffset((prev) => prev + limit);
  const handlePrev = () => setOffset((prev) => Math.max(prev - limit, 0));

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Pokemon List
      </Typography>

      <Grid container spacing={5}>
        {pokemons.map((p) => {
          const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`;

          return (
            <Grid
              size={{ xs: 6, sm: 4, md: 3, lg: 2, xl: 2 }}
              key={p.name}
              sx={{
                boxShadow: 1,
              }}
            >
              <Card
                className="pokemon-card"
                component={Link}
                to={`/pokemon/${p.id}`}
              >
                <CardMedia
                  className="pokemon-card--image"
                  component="img"
                  image={imageUrl}
                  alt={p.name}
                  sx={{
                    width: 120,
                  }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" align="center">
                    {p.name}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Stack direction="row" spacing={2} mt={4}>
        <Button variant="contained" disabled={offset === 0} loading={isLoading} onClick={handlePrev} data-testid="prev-button">
          PREV
        </Button>

        <Button variant="contained" loading={isLoading} onClick={handleNext} data-testid="next-button">
          NEXT
        </Button>
      </Stack>
    </>
  );
}
