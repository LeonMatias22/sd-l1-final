import * as jsonfile from "jsonfile";
// El siguiente import no se usa pero es necesario
import "./pelis.json";
// de esta forma Typescript se entera que tiene que incluir
// el .json y pasarlo a la carpeta /dist
// si no, solo usandolo desde la libreria jsonfile, no se dá cuenta

// no modificar estas propiedades, agregar todas las que quieras
class Peli {
  id: number;
  title: string;
  tags: string[];

  constructor(id: number, title: string, tags: string[]) {
    this.id = id;
    this.title = title;
    this.tags = tags;
  }
}

type SearchOptions = { title?: string; tag?: string };

class PelisCollection {
  getAll(): Promise<Peli[]> {
    const pathPelis = "./pelis.json";
    return jsonfile.readFile(pathPelis).then((data: any) => {
      // la respuesta de la promesa
      return data;
    });
  }

  getById(id: number): Promise<Peli> {
    return this.getAll().then((pelis) => {
      const peliEncontrada = pelis.find((peli) => peli.id === id);
      return peliEncontrada;
    });
  }

  add(peli: Peli): Promise<boolean> {
    const promesaUno = this.getById(peli.id).then((peliExistente) => {
      if (peliExistente) {
        return false;
      } else {
        // magia que agrega la pelicula a un objeto data
        return this.getAll().then((pelis) => {
          pelis.push(new Peli(peli.id, peli.title, peli.tags));
          return jsonfile.writeFile("./pelis.json", pelis).then(() => true);
        });
      }
    });

    return promesaUno;
  }

  async search(options: SearchOptions): Promise<Peli[]> {
  const lista = await this.getAll();


  const listaFiltrada = lista.filter((p) => {
    if (options.title && options.tag) {
      // Debe cumplir ambos
      return (
        p.title.toLowerCase().includes(options.title.toLowerCase()) &&
        p.tags.includes(options.tag)
      );
    } else if (options.title) {
      return p.title.toLowerCase().includes(options.title.toLowerCase());
    } else if (options.tag) {
      return p.tags.includes(options.tag);
    }
    return false; // Si no hay filtros, no devuelve nada
  });


  return listaFiltrada; // Devuelve la lista filtrada
}

}

export { PelisCollection, Peli };
