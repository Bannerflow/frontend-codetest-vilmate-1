import { MemoryRouter } from "react-router-dom";
import { render, screen, waitFor } from "@testing-library/react";
import PokemonList from "../src/pages/PokemonList";
import userEvent from "@testing-library/user-event";

// Mock fetch
global.fetch = vi.fn();

function mockPokemonList(offset: number = 0) {
  const results = Array(10).fill(1, 0, 10).map((_, i) => ({
    name: `pokemon-${offset + i + 1}`,
    url: `https://pokeapi.co/api/v2/pokemon/${offset + i + 1}/`,
  }));

  return { results };
}

function mockPokemonDetails(id: number) {
  return {
    id,
    name: `pokemon-${id}`,
    abilities: [],
    types: [],
    sprites: { front_default: `img-${id}.png` },
  };
}

describe("PokemonList", () => {
  beforeEach(() => {
    (fetch as any).mockImplementation((url: string) => {
      if (url.includes("pokemon?limit=10")) {
        return Promise.resolve({
          json: () => Promise.resolve(mockPokemonList(0)),
        });
      }

      const id = Number(url.split("/").at(-2));
      return Promise.resolve({
        json: () => Promise.resolve(mockPokemonDetails(id)),
      });
    });
  });

  test("displays 10 Pokemon with names and images", async () => {
    render(<MemoryRouter><PokemonList /></MemoryRouter>);

    // Wait for all Pokemon to load
    await waitFor(() => {
      expect(screen.getAllByRole("img").length).toBe(10);
    });

    // Check names
    for (let i = 1; i <= 10; i++) {
      expect(screen.getByText(`Pokemon-${i}`)).toBeInTheDocument();
    }
  });

  test("allows navigation using NEXT and PREV buttons", async () => {
    const user = userEvent.setup();

    // First page mock
    (fetch as any).mockImplementationOnce(() => ({
        json: () => Promise.resolve(mockPokemonList(0)),
    }));

    // Details for first page
    for (let i = 1; i <= 10; i++) {
        (fetch as any).mockImplementationOnce(() => ({
          json: () => Promise.resolve(mockPokemonDetails(i)),
        }));
    }

    render(<MemoryRouter><PokemonList /></MemoryRouter>);

    // Wait for first page
    await waitFor(() => {
        expect(screen.getByText("Pokemon-1")).toBeInTheDocument();
    });

    // Mock second page
    (fetch as any).mockImplementationOnce(() => ({
        json: () => Promise.resolve(mockPokemonList(10)),
    }));

    for (let i = 11; i <= 20; i++) {
        (fetch as any).mockImplementationOnce(() => ({
          json: () => Promise.resolve(mockPokemonDetails(i)),
        }));
    }

    // Click NEXT
    await user.click(screen.getByTestId("next-button"));

    await waitFor(() => {
      for (let i = 11; i <= 20; i++) {
        expect(screen.getByText(`Pokemon-${i}`)).toBeInTheDocument();
      }
    });

    // Click PREV
    (fetch as any).mockImplementationOnce(() => ({
        json: () => Promise.resolve(mockPokemonList(0)),
    }));

    for (let i = 1; i <= 10; i++) {
        (fetch as any).mockImplementationOnce(() => ({
        json: () => Promise.resolve(mockPokemonDetails(i)),
        }));
    }

    await user.click(screen.getByTestId("prev-button"));

    await waitFor(() => {
      for (let i = 1; i <= 10; i++) {
        expect(screen.getByText(`Pokemon-${i}`)).toBeInTheDocument();
      }
    });
  });

});
