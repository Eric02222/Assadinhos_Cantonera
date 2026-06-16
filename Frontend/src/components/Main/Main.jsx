import { useState } from 'react'

function Main() {
  const [listaLanches, setListaLanches] = useState([]);
  const [lancheSelecionado, setLancheSelecionado] = useState(null);

  const carregarLanches = async () => {
    try {
      const lista = getLanches();

      setListaLanches(lista);
    } catch (error) {
      console.log("Não foi possivel carregar lanches", error)
      setListaLanches([])
    }
  };

  return (
    <div>Main</div>
  )
}

export default Main