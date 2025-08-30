document.addEventListener("mousemove", (e) => {
    const leaf = document.createElement("div");
    leaf.classList.add("leaf");

    // posição do mouse
    leaf.style.left = e.pageX + "px";
    leaf.style.top = e.pageY + "px";

    document.body.appendChild(leaf);

    // remover folha depois da animação
    setTimeout(() => {
        leaf.remove();
    }, 20000);
});

// Funções do Carrinho
function inicializarCarrinho() {
    const carrinhoGuardado = localStorage.getItem('carrinhoEcoTrend');
    return carrinhoGuardado ? JSON.parse(carrinhoGuardado) : [];
}

function guardarCarrinho(carrinho) {
    localStorage.setItem('carrinhoEcoTrend', JSON.stringify(carrinho));
}

function atualizarContadorCarrinho(carrinho) {
    const contador = document.getElementById('carrinho-contador');
    if (contador) {
        contador.textContent = carrinho.length;
    }
}

// Inicializar o carrinho e o contador assim que a página é carregada
let carrinho = inicializarCarrinho();
atualizarContadorCarrinho(carrinho);

// Evento para adicionar produtos ao carrinho
document.addEventListener('click', (e) => {
    const botaoAdicionar = e.target.closest('.adicionar-carrinho');

    if (botaoAdicionar) {
        e.preventDefault();

        const produto = {
            id: botaoAdicionar.dataset.productId,
            nome: botaoAdicionar.dataset.productName,
            preco: parseFloat(botaoAdicionar.dataset.productPrice),
            imagem: botaoAdicionar.dataset.productImage
        };

        carrinho.push(produto);

        guardarCarrinho(carrinho);

        atualizarContadorCarrinho(carrinho);

        alert(`${produto.nome} foi adicionado ao carrinho!`);
    }
});

// para exibir e finalizar o carrinho (na página carrinho.html)
document.addEventListener('DOMContentLoaded', () => {
    const paginaCarrinho = document.getElementById('lista-carrinho');

    if (paginaCarrinho) {
        exibirCarrinho();

        const botaoFinalizar = document.getElementById('btn-finalizar');
        if (botaoFinalizar) {
            botaoFinalizar.addEventListener('click', finalizarCompra);
        }
    }
});


function exibirCarrinho() {
    const carrinhoItens = inicializarCarrinho();
    const listaHtml = document.getElementById('lista-carrinho');
    const subtotalElement = document.getElementById('subtotal');
    const totalElement = document.getElementById('total-final');
    let subtotal = 0;

    listaHtml.innerHTML = ''; // Limpa a lista antes de adicionar os itens

    if (carrinhoItens.length === 0) {
        listaHtml.innerHTML = '<p class="text-center text-muted">O seu carrinho está vazio.</p>';
        subtotalElement.textContent = 'R$ 0.00';
        totalElement.textContent = 'R$ 0.00';
        return;
    }

    carrinhoItens.forEach(item => {
        subtotal += item.preco;
        const divItem = document.createElement('div');
        divItem.classList.add('list-group-item', 'd-flex', 'align-items-center', 'my-2', 'shadow-sm');
        divItem.innerHTML = `
            <div class="produto-carrinho-img-container">
                <img src="${item.imagem}" alt="${item.nome}" class="rounded-3">
            </div>
            <div class="flex-grow-1">
                <h6 class="my-0">${item.nome}</h6>
                <small class="text-muted">ID: ${item.id}</small>
            </div>
            <span class="text-success fw-bold">R$ ${item.preco.toFixed(2)}</span>
        `;
        listaHtml.appendChild(divItem);
    });

    subtotalElement.textContent = `R$ ${subtotal.toFixed(2)}`;
    totalElement.textContent = `R$ ${subtotal.toFixed(2)}`;
}

document.addEventListener('DOMContentLoaded', () => {
    const paginaCarrinho = document.getElementById('lista-carrinho');

    if (paginaCarrinho) {
        exibirCarrinho();

        const botaoExcluir = document.getElementById('btn-excluir');
        if (botaoExcluir) {
            botaoExcluir.addEventListener('click', limparCarrinho);
        }
    }
});

function limparCarrinho() {

    localStorage.removeItem('carrinhoEcoTrend');
    exibirCarrinho();
    atualizarContadorCarrinho([]);
}
function finalizarCompra() {
    const carrinhoItens = inicializarCarrinho();

    if (carrinhoItens.length === 0) {
        alert('O seu carrinho está vazio. Adicione produtos antes de finalizar a compra.');
        return;
    }

    // Lógica para finalizar a compra
    alert('Compra finalizada com sucesso! Agradecemos a sua preferência.');

    // Limpar o carrinho após a compra
    localStorage.removeItem('carrinhoEcoTrend');
    // Atualizar a visualização do carrinho na página
    exibirCarrinho();
    // Atualizar o contador no cabeçalho
    atualizarContadorCarrinho([]);
}

// PARTE DO FILTRO

document.addEventListener("DOMContentLoaded", () => {
    const btnFiltro = document.querySelector(".btn-aplicar-filtros");
    const produtos = document.querySelectorAll(".produto");

    btnFiltro.addEventListener("click", () => {
        // Pega valores dos filtros
        const precoMax = document.querySelector("input[type='range']").value;
        const categoria = document.querySelector("select").value;
        
        const marcasSelecionadas = [...document.querySelectorAll("input[type='checkbox']:checked")]
            .map(cb => cb.nextElementSibling.textContent.trim());

        // Filtra os produtos
        produtos.forEach(produto => {
            const preco = parseFloat(produto.dataset.preco);
            const cat = produto.dataset.categoria;
            const marca = produto.dataset.marca;

            let mostrar = true;

            // Filtro por preço
            if (preco > precoMax) mostrar = false;

            // Filtro por categoria
            if (categoria && cat !== categoria) mostrar = false;

            // Filtro por marca
            if (marcasSelecionadas.length > 0 && !marcasSelecionadas.includes(marca)) {
                mostrar = false;
            }

            // Aplica no DOM
            produto.style.display = mostrar ? "block" : "none";
        });
    });
});
