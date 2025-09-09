class Animal {
  constructor(nome, tipo, brinquedosAnimais = []) {
    this.nome = nome;
    this.tipo = tipo;
    this.brinquedosAnimais = brinquedosAnimais;
  }
}

class Pessoa {
  constructor(nome, brinquedosPessoa = []) {
    this.nome = nome;
    this.brinquedosPessoa = brinquedosPessoa;
    this.animais = [];
  }
}

function verificaOrdem(brinquedosPessoa, brinquedosAnimal) {
  let idx = 0;
  for (let brinquedo of brinquedosPessoa) {
    if (brinquedo === brinquedosAnimal[idx]) {
      idx++;
      if (idx === brinquedosAnimal.length) return true;
    }
  }
  return false;
}

class AbrigoAnimais {
  encontraPessoas(brinquedosPessoa1, brinquedosPessoa2, ordemAnimais) {
    const animais = [
      new Animal("Rex", "Cão", ["RATO", "BOLA"]),
      new Animal("Mimi", "Gato", ["BOLA", "LASER"]),
      new Animal("Fofo", "Gato", ["BOLA", "RATO", "LASER"]),
      new Animal("Zero", "Gato", ["RATO", "BOLA"]),
      new Animal("Bola", "Cão", ["CAIXA", "NOVELO"]),
      new Animal("Bebe", "Cão", ["LASER", "RATO", "BOLA"]),
      new Animal("Loco", "Jabuti", ["SKATE", "RATO"])
    ];

    const brinquedosValidos = ["RATO", "BOLA", "LASER", "CAIXA", "NOVELO", "SKATE"];

    const pessoas = [
      new Pessoa("pessoa 1", brinquedosPessoa1.split(',')),
      new Pessoa("pessoa 2", brinquedosPessoa2.split(','))
    ];

    for (const pessoa of pessoas) {
      const brinquedosUnicos = new Set();
      const brinquedosFormatados = [];

      for (const brinquedo of pessoa.brinquedosPessoa) {
        const brinquedoFormatado = brinquedo.trim().toUpperCase();

        if (!brinquedosValidos.includes(brinquedoFormatado) || brinquedosUnicos.has(brinquedoFormatado)) {
          return { erro: 'Brinquedo inválido', lista: undefined };
        }

        brinquedosUnicos.add(brinquedoFormatado);
        brinquedosFormatados.push(brinquedoFormatado);
      }

      pessoa.brinquedosPessoa = brinquedosFormatados;
    }

    const nomesAnimaisOrdem = ordemAnimais.split(',');
    let resultado = [];
    const brinquedosBloqueados = new Set();
    const animaisUsados = new Set(); 

    for (let nomeAnimal of nomesAnimaisOrdem) {
     const nomeEntrada = nomeAnimal.trim();
      const nomeEntradaNormalizado = nomeEntrada.toUpperCase();
      
      if (animaisUsados.has(nomeEntradaNormalizado)) {
        return { erro: 'Animal inválido', lista: undefined };
      }
      animaisUsados.add(nomeEntradaNormalizado);

      const animal = animais.find(a => a.nome.toUpperCase() === nomeEntradaNormalizado);
      if (!animal) {
        return { erro: 'Animal inválido', lista: undefined };
      }
      const temBrinquedoBloqueado = animal.brinquedosAnimais.some(b => brinquedosBloqueados.has(b));
      if (animal.tipo === "Gato" && temBrinquedoBloqueado) {
        resultado.push(`${animal.nome} - abrigo`);
        continue;
      }

      let local = 'abrigo';
      let quantidadeDePessoasQuePodemAdotar = 0;
      let unicaPessoaElegivel = null;
      

      for (let pessoa of pessoas) {
        let podeAdotar = false;
        const abaixoLimite = pessoa.animais.length < 3;
        const naOrdem = verificaOrdem(pessoa.brinquedosPessoa, animal.brinquedosAnimais);
      

        if (animal.nome === "Loco") {
          const temSkate = pessoa.brinquedosPessoa.includes("SKATE");
          const temRato = pessoa.brinquedosPessoa.includes("RATO");

          if (!temSkate || !temRato) {
            podeAdotar = false;
          } else if (pessoa.animais.length === 0 && naOrdem) {
              podeAdotar = true;
        
          } else if (pessoa.animais.length >= 1 && abaixoLimite) {
            podeAdotar = true;
          }
        } else {

          if (naOrdem && abaixoLimite) {
            podeAdotar = true;
          }
        }

        if (podeAdotar) {
          quantidadeDePessoasQuePodemAdotar++;
          unicaPessoaElegivel = pessoa;
        }
      }

      if (quantidadeDePessoasQuePodemAdotar === 1) {
        unicaPessoaElegivel.animais.push(animal);
        local = unicaPessoaElegivel.nome;

        for (let brinquedo of animal.brinquedosAnimais) {
          brinquedosBloqueados.add(brinquedo);
        }

      }

      resultado.push(`${animal.nome} - ${local}`);
    }


    resultado.sort((a, b) => {
      const nomeA = a.split(' - ')[0];
      const nomeB = b.split(' - ')[0];
      return nomeA.localeCompare(nomeB);
    });

    return { lista: resultado, erro: undefined };
  }
}
export { AbrigoAnimais as AbrigoAnimais };
