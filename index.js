import readline from 'readline';

const { argv } = process;

const [, , metodo, entidad, titulo, precio, categoria] = process.argv;

const listar = async (entidad) => {
    try {
        const response = await fetch("https://fakestoreapi.com/" + entidad);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error en GET:", error.message);
    }
}

const crear = async (entidad, payload) => {
  const config = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  };

  try {
    const response = await fetch("https://fakestoreapi.com/" + entidad, config);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en POST:", error.message);
  }
};

const eliminar = async (entidad) => {
  try {
    const config = {
      method: "DELETE"
    };
    const response = await fetch("https://fakestoreapi.com/" + entidad, config);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en DELETE:", error.message);
  }
};

const confirmar = (mensaje) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(`${mensaje} (s/n): `, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 's'); // true si responde 's'
    });
  });
};

// extra: modificar
const modificar = async (entidad, payload) => {
  const config = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  };

  try {
    const response = await fetch("https://fakestoreapi.com/" + entidad, config);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en POST:", error.message);
  }
};


switch (metodo?.toLowerCase()) {
  case "get":
    if (entidad?.toLowerCase().startsWith('products')) {
      const id = entidad.split('/')[1];
      // si viene un id lo valido, sino puede venir solo products y necesita el listado
      if ((Number.isInteger(Number(id)) && Number(id) > 0) || entidad?.toLowerCase() === 'products') {
        const productos = await listar(entidad?.toLowerCase());
        if (typeof productos !== 'undefined') {
          console.log(productos);
        }
      } else {
        console.error('Identificador no valido: usar products o products/{id} donde id tiene que ser un entero mayor a cero')  
      }
    } else {
      console.error('Entidad no reconocida: usar products o products/{id}')
    }
    break;

  case "post":
    if (entidad?.toLowerCase().startsWith('products')) {
      const payload = {
        title: titulo,
        price: precio,
        category: categoria
      };
      const respuesta = await crear(entidad?.toLowerCase(), payload);
      if (typeof respuesta !== 'undefined') {
        console.log(respuesta);
      }
    } else {
      console.error('Entidad no reconocida: usar products o products/{id}')
    }
    break;

  case "put":
    if (entidad?.toLowerCase().startsWith('products')) {
      const payload = {};
      titulo ? payload.title = titulo : '';
      precio ? payload.price = precio : '';
      categoria ? payload.category = categoria : '';
      // verifico que venga algun dato para modificar
      if (typeof titulo === 'undefined' && typeof precio === 'undefined' && typeof categoria === 'undefined') {
        console.error('Al menos debe indicar un valor a modificar');
        break;
      }
      // valido el id
      const id = entidad.split('/')[1];
      if (Number.isInteger(Number(id)) && Number(id) > 0) {
        const respuesta = await modificar(entidad?.toLowerCase(), payload);
        if (typeof respuesta !== 'undefined') {
          console.log(respuesta);
        }
      } else {
        console.error('Identificador no valido: usar products o products/{id} donde id tiene que ser un entero mayor a cero')  
      }
    } else {
      console.error('Entidad no reconocida: usar products/{id}')
    }    
    break;

  case "delete":
    if (entidad?.toLowerCase().startsWith('products')) {
    // Separar por "/"
      const partes = entidad.split('/');
      const id = partes[1];
      const seguro = await confirmar(`¿Está seguro que desea eliminar el id ${id}?`);
      if (seguro) {
        if (Number.isInteger(Number(id)) && Number(id) > 0) {
          const respuesta = await eliminar(entidad?.toLowerCase());
          if (typeof respuesta !== 'undefined') {
            console.log(respuesta);
          }
        } else {
          console.error('Identificador no valido: usar products o products/{id} donde id tiene que ser un entero mayor a cero')  
        }  
      } else {
        console.log("Operación cancelada");
      }
    } else {
      console.error('Entidad no reconocida: usar products o products/{id}')
    }
    break;

  default:
    console.log("Metodo no reconocido. Usá: get | post | put | delete");
}
