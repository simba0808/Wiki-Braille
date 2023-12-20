import { useEffect, useState } from "react";
import DetailModal from "../components/detailModal";

const Dashboard = () => {
  const [modalShow, setModalShow] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [startPageIndex, setStartPageIndex] = useState(1);
  const [currentPageIndex, setCurrentPageIndex] = useState(1);
  const [showResults, setShowResults] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchWord, setSearchWord] = useState("");
  
  useEffect(() => {
    getSearchResults();
  }, []);

  useEffect(() => {
    const res = [...searchResults].slice(5*(currentPageIndex-1), (currentPageIndex-1)*5+5);
    setShowResults(res);
  }, [currentPageIndex, searchResults]);

  const result = [
    {
      title: "câmera fotográfica",
      description: "_y3: _`[Colagem. Mulher com uma câmera fotográfica no lugar da cabeça. Do topo da câmera saem duas antenas. A mulher usa um vestido branco com detalhes rosa, por cima uma blusa preta de manga comprida e apenas um botão fechado e, no bolso, carrega alguns lápis. No ombro esquerdo, usa uma bolsa a tiracolo, com alguns papéis escritos à mostra, saindo do acessório. Com a mão direita, segura um *tablet* com a imagem de um homem, que é Carlos Drummond de Andrade._`]",
    },
    {
      title: "Novas histórias da bruxa  Onilda",
      description: "_y12: _`[Capa de livro. Imagem com o fundo e bordas em tons de cores alaranjadas. Já no centro, há a ilustração de uma mulher usando um vestido longo de cor preta, um lenço vermelho ao redor do ombro e da cintura e um chapéu preto pontiagudo. A mulher está em  cima de um bloco verde, e ao lado dos seus pés há uma pequena coruja. Em ambos os lados da mulher, há alguns vasos de plantas verdes e compridas. No topo da imagem, está escrita na cor roxa a frase “Novas histórias da bruxa  Onilda”. Por fim, logo abaixo, há o título do livro “Bruxa Onilda é uma grande estrela”. Na parte inferior da imagem, no centro, está escrito “editora scipione”._`]",
    },
    {
      title: "Apple",
      description: 
        "_y19: LAERTE. Piratas do Tietê. *Folha de São Paulo*, 5 jun. 2011 _`[Tirinha composta por quatro quadros, de Laerte. Q1: Imagem de um menino pequeno ao lado de uma mulher, que veste um avental de cozinha amarelo e roupa verde de bolinhas brancas, e está em frente a uma bancada enquanto corta cenouras. O menino diz: “Mãe, qual é a diferença entre ser normal e ser clichê?” A mulher olha na direção do filho e responde: “Não sei, pergunte ao seu pai.”; Q2: O menino está em frente a um homem que usa bigode e está sentado em uma poltrona enquanto segura um jornal. O menino, então, pergunta: “Pai, qual é a diferença entre ser normal e ser clichê?”. O pai responde: “Não sei, pergunte aos sábios do templo.”; Q3: O menino está em uma pequena escadaria, enquanto dois homens com longas barbas estão um pouco à frente dele. O menino mais uma vez pergunta: “Sábios do templo, qual é a diferença entre ser normal e ser clichê?”. Um dos homens responde: “Suma da nossa frente, garoto idiota!”; Q4: O garoto está sentado na escadaria, enquanto apoia os cotovelos nos joelhos e o rosto nas mãos._`]",
    },
    {
      title: "Apple",
      description: "This is delicious and fresh apple.",
    },
    {
      title: "Apple",
      description: "This is delicious and fresh apple.",
    },
    {
      title: "caneta tinteiro",
      description:"_y38: _`[Fotografia. Imagem de um pequeno recipiente com líquido de cor preta. Ao lado, uma caneta com detalhes cobre em que uma de suas extremidades é pontiaguda._ `]"
    },
    {
      title: "Chaves, colchetes, setas...",
      description: "!:÷!:÷!:÷   !:::::ÿ!::::ÿ!:::ÿ h:jh:jh:j   h:::::jh:::jh:::j"
    },
    {
      title: "Malha",
      description: ""
    },
    {
      title: "",
      description:""
    },
    {
      title: "",
      description:""
    },
    {
      title: "",
      description:""
    },
  ];

  const totalNumbers = searchResults.length;

  const searchResult = showResults.map((item, index) => {
    return (
      <div className="w-full h-[100px] flex bg-slate-100 p-2 my-1 rounded-md hover:cursor-pointer" onClick={() => handleClick((currentPageIndex-1)*5+index)} key={index}>
        <div className="h-[100%] aspect-w-1">
          <img
            className="w-[100%] h-[100%]"
            src={`/src/assets/img/${(currentPageIndex-1)*5+index+1}.jpg`}
            alt=""
          />
        </div>
        <div className="w-full">
          <h2 className="p-0 pl-3 pb-1 text-lg text-left font-semibold">{item.title}</h2>
          <p className="px-2 text-sm text-left">{item.description.length>200 ? item.description.substring(0, 200)+"...":item.description}</p>
        </div>
      </div>
    );
  });

  const handleClick = (index) => {
    setSelectedIndex(index);
    setModalShow(true);
  };

  const backButtonHandle = () => {
    if(currentPageIndex < 2) {
      return;
    }
    if(currentPageIndex === startPageIndex) {
      setStartPageIndex(startPageIndex-1);
    } 
    setCurrentPageIndex(currentPageIndex-1);
  };

  const forwardButtonHandle = () => {
    if(currentPageIndex > totalNumbers/5) {
      return;
    }
    if(currentPageIndex === startPageIndex+4) {
      setStartPageIndex(startPageIndex+1);
    }
    setCurrentPageIndex(currentPageIndex+1);
  };

  const getSearchResults = () => {
    const temp = result.filter((item) => item.title.toLowerCase().includes(searchWord.toLowerCase()));
    console.log(searchWord)
    setSearchResults(temp);
    setCurrentPageIndex(1);
    setSelectedIndex(-1);
    setStartPageIndex(1);
  };

  const handleSearchInput = (e) => {
    setSearchWord(e.target.value);
  };

  const handleSearchEntered = (e) => {
    if(e.keyCode === 13) {
      getSearchResults();
    }
  };

  return (
    <main className="h-full">
      <div className="container px-6 mx-auto grid">
        <h2 className="my-6 text-2xl text-left font-semibold text-gray-700 dark:text-gray-200">
          Dashboard
        </h2>

          <div className="h-[40px] relative my-2 text-gray-500 focus-within:text-purple-600">
            <input
              className="block w-full h-[100%] pl-14 pr-20 text-md text-black border-2 rounded-md focus:ring-2 focus:ring-purple-300 focus:outline-none form-input"
              placeholder="apple"
              onKeyDown={handleSearchEntered}
              onChange={handleSearchInput}
            />
            <div className="absolute border-r-2 inset-y-0 flex items-center px-3">
              <svg
                className="w-4 h-4"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
            <button 
              className="absolute inset-y-0 right-0 px-4 my-0 text-sm font-medium leading5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-r-md active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
              onClick={getSearchResults}
            >
              To look for
            </button>
          </div>
          <div className="h-[40px] relative my-2 text-gray-500 focus-within:text-purple-600">
            <input
              className="block w-full h-[100%] pl-40 pr-20 text-md text-black border-2 rounded-md focus:ring-2 focus:ring-purple-300 focus:outline-none form-input"
              placeholder="apple"
            />
            <div className="absolute px-3 border-r-2 inset-y-0 flex items-center">
              Advanced Search:
            </div>
            <button className="absolute inset-y-0 right-0 px-4 text-sm font-medium leading5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-r-md active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple">
              To look for
            </button>
          </div>
          <div className="relative my-2 px-2 text-gray-500 flex bg-white rounded-md border-2 border-slate-200">
            <label className="block px-2 pr-4 border-r-2 text-md flex items-center">
              Search in
            </label>
            <select
              data-te-select-init
              className="grow py-2 pl-2 focus:outline-none focus:border-none text-slate-900"
            >
              <option value="All">All</option>
              <option value="General">General</option>
              <option value="Braille">Braille</option>
            </select>
          </div>

        {modalShow && selectedIndex !== -1 ? <DetailModal descData = {{...result[selectedIndex], "image":`${selectedIndex}`}} handleClick={setModalShow} />: ""}
        
        <div className="p-4 px-12 bg-white">
          <div>
            <ul className="inline-flex items-center float-right">
              <li>
                <button
                  className="px-3 py-1 rounded-md rounded-l-lg focus:outline-none focus:shadow-outline-purple"
                  aria-label="Previous"
                  onClick={backButtonHandle}
                >
                  <svg
                    aria-hidden="true"
                    className="w-4 h-4 fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clipRule="evenodd"
                      fillRule="evenodd"
                    ></path>
                  </svg>
                </button>
              </li>
              {
                [1,2,3,4,5].map((item, index) => {
                  return <li key={index} className="mx-1">
                          <button 
                            className={`px-3 py-1 rounded-md focus:outline-none focus:shadow-outline-purple border border-purple-600 focus:outline-none focus:shadow-outline-purple ${currentPageIndex === startPageIndex+index ? "bg-purple-600":""} ${(startPageIndex+index)>(totalNumbers/5+1)?"opacity-50 cursor-not-allowed":""}`}
                            onClick={() => setCurrentPageIndex(startPageIndex+index)}
                            disabled={(startPageIndex+index)>(totalNumbers/5+1)?true:false}
                          >
                            {startPageIndex+index}
                          </button>
                        </li>
                })
              }
              <li>
                <button
                  className="px-3 py-1 rounded-md rounded-r-lg focus:outline-none focus:shadow-outline-purple"
                  aria-label="Next"
                  onClick={forwardButtonHandle}
                >
                  <svg
                    className="w-4 h-4 fill-current"
                    aria-hidden="true"
                    viewBox="0 0 20 20"
                  >
                    <path
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                      fillRule="evenodd"
                    ></path>
                  </svg>
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div className="bg-white p-2 pt-0">{searchResult}</div>
      </div>
      
    </main>
  );
};

export default Dashboard;
