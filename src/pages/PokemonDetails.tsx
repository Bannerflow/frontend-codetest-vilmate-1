import { useLoaderData, Link } from "react-router-dom";
import {
  Typography,
  Card,
  CardContent,
  CardMedia,
  Stack,
  Chip,
  Grid,
} from "@mui/material";

import { Pokemon } from "@/models/Pokemon";

export async function pokemonDetailsLoader({ params }: { params: any }) {
  const id = params.id;

  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  const pokemon = await res.json();

  const speciesRes = await fetch(pokemon.species.url);
  const species = await speciesRes.json();

  const evoRes = await fetch(species.evolution_chain.url);
  const evoData = await evoRes.json();

  const evolutions: { id: number; name: string }[] = [];

  function extract(chain: any) {
    const urlParts = chain.species.url.split("/");
    const evoId = Number(urlParts[urlParts.length - 2]);

    evolutions.push({
      id: evoId,
      name: chain.species.name,
    });

    chain.evolves_to.forEach(extract);
  }

  extract(evoData.chain);

  return new Pokemon({
    ...pokemon,
    evolutions,
  });
}

export default function PokemonDetails() {
  const p = useLoaderData() as Pokemon;

  return (
    <>
      <Typography variant="h4" gutterBottom>
        {p.name}
      </Typography>

      <Card sx={{ maxWidth: 400, margin: "auto", boxShadow: 3, mb: 4 }}>
        <CardMedia
          component="img"
          image={p.image}
          alt={p.name}
          sx={{ width: 150, height: 150, margin: "auto" }}
        />

        <CardContent>
          <Typography variant="h6" gutterBottom>
            Abilities
          </Typography>

          <Stack direction="row" spacing={1} flexWrap="wrap" mb={2}>
            {p.abilities.map((a) => (
              <Chip key={a} label={a} />
            ))}
          </Stack>
        </CardContent>
      </Card>

      <Typography variant="h5" gutterBottom>
        Evolutions
      </Typography>

      <Grid container spacing={3}>
        {p.evolutions.map((evo) => {
          const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evo.id}.png`;

          return (
            <Grid key={evo.id}>
              <Card
                className="pokemon-evolution-card"
                component={Link}
                to={`/pokemon/${evo.id}`}
              >
                <CardMedia
                  component="img"
                  image={imageUrl}
                  alt={evo.name}
                  sx={{
                    width: 120,
                    height: 120,
                    margin: "auto",
                    paddingTop: 2,
                  }}
                />

                <CardContent>
                  <Typography variant="h6" align="center">
                    {evo.name}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
}
