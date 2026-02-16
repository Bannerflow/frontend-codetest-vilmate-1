import { capitalize } from "@/utils/format";

export class Pokemon {
  id: number;
  name: string;
  image: string;
  abilities: string[];
  types: string[];
  evolutions: { id: number; name: string }[];

  constructor(data: any) {
    this.id = data.id;
    this.name = capitalize(data.name);

    this.image = data.sprites?.front_default ?? "";

    this.abilities = data.abilities?.map((a: any) =>
      capitalize(a.ability.name)
    ) ?? [];

    this.types = data.types?.map((t: any) =>
      capitalize(t.type.name)
    ) ?? [];

    this.evolutions = data.evolutions?.map((e: any) => ({
      id: e.id,
      name: capitalize(e.name),
    })) ?? [];
  }

  static sprite(id: number): string {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
  }
}
