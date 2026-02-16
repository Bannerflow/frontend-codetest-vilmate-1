import { createBrowserRouter } from "react-router-dom";
import RootLayout from "@/layouts/RootLayout";
import PokemonList from "@/pages/PokemonList";
import PokemonDetails, { pokemonDetailsLoader } from "@/pages/PokemonDetails";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <PokemonList />,
      },
      {
        path: "pokemon/:id",
        element: <PokemonDetails />,
        loader: pokemonDetailsLoader,
      },
    ],
  },
]);
