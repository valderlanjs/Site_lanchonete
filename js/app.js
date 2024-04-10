//Quando o documento estiver pronto, execute a função, ou seja, quandoo o jquery estiver carregado e validado, ai sim, começa a criar o métodos
$(document).ready(function () {
    cardapio.eventos.init()
})

let cardapio =  {}

let MEU_CARRINHO = []
let MEU_ENDERECO = null

let VALOR_CARRINHO = 0
let VALOR_ENTREGA = 5

let CELULAR_EMPRESA = '5582993700544'



    
cardapio.eventos = {
    
    init: () => {
        cardapio.metodos.obterItensCardapio();
        cardapio.metodos.carregaBtnReserva();
        cardapio.metodos.carregarBtnLigar();
        cardapio.metodos.btnWhatsapp();
        cardapio.metodos.btnWhatsapp2();
        
    }

}

cardapio.metodos = {
    //OIbtem a lista de itens do cardápio
    obterItensCardapio: (categoria = 'burgers', vermais = false) => {

        let filtro = MENU[categoria];
        

        if(!vermais) {
            $('#itensCardapio').html('')
            $('#btnVermais').removeClass('hidden');

        }

        $.each(filtro, (i, e) => {

            let temp = cardapio.templates.item
            .replace(/\${img}/g, e.img) // Aqui o método replace esta substituindo a calsse \{img} por e.img. 
            .replace(/\${name}/g, e.name)
            .replace(/\${price}/g, e.price.toFixed(2).replace('.', ',')) // Aqui está substituindo onde tem (.) por virgula, e fixando duas casas decimais
            .replace(/\${id}/g, e.id)
            //validação do ver mais... se foi clicado (12 itens)
            if(vermais && i >= 8 && i < 12) {
                $('#itensCardapio').append(temp)
            }
            //paginação inicial (8 itens)
           if(!vermais && i < 8) {
            $('#itensCardapio').append(temp)
           }
        })

        // Remove o active do botão 
        $(".container-menu a").removeClass('active');
        // seta o menu ativo
        $("#menu-" + categoria).addClass('active')
    },

    // click no botão de ver mais...
    verMais: () => {

        let ativo = $(".container-menu a.active").attr('id').split('menu-')[1] //   [menu-][burgers] 0,1 
        cardapio.metodos.obterItensCardapio(ativo, true)


        $('#btnVermais').addClass('hidden');
    },


     // Diminuir a quantidade do item no cardápio
    diminuirQuantidade: (id) => {

        let qntdAtual = parseInt($("#qntd-" + id).text()); 


        if(qntdAtual > 0) {
            $("#qntd-" + id).text(qntdAtual - 1)
        }

    },


     // Diminuir a quantidade do item no cardápio
    aumentarQuantidade: (id) => {

        let qntdAtual = parseInt($("#qntd-" + id).text()); 
        $("#qntd-" + id).text(qntdAtual + 1)

    },

    // adicionar ao carrinho o item do cardápio
    adicionaAoCarrinho: (id) => {

        let qntdAtual = parseInt($("#qntd-" + id).text()); 

        if(qntdAtual > 0) {
            //obter a categoria active
            let categoria = $(".container-menu a.active").attr('id').split('menu-')[1];

            // obtem a lista de itens
            let filtro = MENU[categoria]

            //obtem item 
            let item = $.grep(filtro, (e, i) => {return e.id == id});

            if(item.length > 0) {

                //validar se ja existe o item no carrinho
                let existe = $.grep(MEU_CARRINHO, (elem, index) => { return elem.id == id})

                // caso já exista o item no carrinho, só altera a quantidade.
                if(existe.length > 0) {

                    let objIndex = MEU_CARRINHO.findIndex((obj => obj.id === id))
                    MEU_CARRINHO[objIndex].qntd = MEU_CARRINHO[objIndex].qntd + qntdAtual

                } 
                //caso não exista o item no carrinho, adiciona ele
                else {
                    item[0].qntd = qntdAtual
                    MEU_CARRINHO.push(item[0])
                }

                // Mensagem de item adicionado ao carrinho.
                cardapio.metodos.mensagem('Item adicionado ao carrinho', 'green')

                //atualiza a quantidade de itens selecionados para 0 após adicionar ao carrinho.
                $("#qntd-" + id).text(0)

                // chamando o método que mostra o badge na tela com a quantidade de itens selecionados.
                cardapio.metodos.atualizarBadgeTotal();
            }
        }

    },


    // Atualiza o badge totais dos botões "Meu carrinho"
    atualizarBadgeTotal: () => {

        var total = 0

        $.each(MEU_CARRINHO, (i, e) => {
            total += e.qntd
        })

        if (total > 0) {
            $('.btn-carrinho').removeClass('hidden')
            $('.container-total-carrinho').removeClass('hidden')
        } else {
            $('.btn-carrinho').addClass('hidden')
            $('.container-total-carrinho').addClass('hidden')
        }

        $(".badge-total-carrinho").html(total)

    },


    // ABRIR MODAL DE CARRINNHO E FECHAR CARRINHO

    abrirCarrinho: (abrir) => {
        if (abrir) {
            $('#modalCarrinho').removeClass('hidden');
            cardapio.metodos.carregarCarrinho()
        } else {
            $('#modalCarrinho').addClass('hidden');
        }

    },


    // ALTERA OS TEXTOS E EXIBE OS BOTÕES DE ACORDO COM A ETAPA DO CARRINHO	

    carregarEtapa: (etapa) => {

      if (etapa == 1) {
        $("#lblTituloEtapa").text('Seu carrinho:');
        $("#itensCarrinho").removeClass('hidden');
        $("#localEntrega").addClass('hidden');
        $("#resumoCarrinho").addClass('hidden');

        $(".etapa").removeClass('active');
        $(".etapa1").addClass('active');

        $("#btnEtapaPedido").removeClass('hidden');
        $("#btnEtapaEndereco").addClass('hidden');
        $("#btnEtapaResumo").addClass('hidden');
        $("#btnVoltar").addClass('hidden');
      }

      if (etapa == 2) {
        $("#lblTituloEtapa").text('Endereço de entrega:');
        $("#itensCarrinho").addClass('hidden');
        $("#localEntrega").removeClass('hidden');
        $("#resumoCarrinho").addClass('hidden');

        $(".etapa").removeClass('active');
        $(".etapa1").addClass('active');
        $(".etapa2").addClass('active');

        $("#btnEtapaPedido").addClass('hidden');
        $("#btnEtapaEndereco").removeClass('hidden');
        $("#btnEtapaResumo").addClass('hidden');
        $("#btnVoltar").removeClass('hidden');
      }

      if (etapa == 3) {
        $("#lblTituloEtapa").text('Resumo do pedido:');
        $("#itensCarrinho").addClass('hidden');
        $("#localEntrega").addClass('hidden');
        $("#resumoCarrinho").removeClass('hidden');

        $(".etapa").removeClass('active');
        $(".etapa1").addClass('active');
        $(".etapa2").addClass('active');
        $(".etapa3").addClass('active');

        $("#btnEtapaPedido").addClass('hidden');
        $("#btnEtapaEndereco").addClass('hidden');
        $("#btnEtapaResumo").removeClass('hidden');
        $("#btnVoltar").removeClass('hidden');
      }

    },

    // BOTÃO VOLTAR ETAPA DO CARRINHO.
    voltarEtapa: () => {

        let etapa = $(".etapa.active").length;
        cardapio.metodos.carregarEtapa(etapa - 1);

    },

    // CARREGAR A LISTA DE ITENS NO CARRINHO.
    carregarCarrinho: () => {

        cardapio.metodos.carregarEtapa(1)

        if(MEU_CARRINHO.length > 0) {
            
            $("#itensCarrinho").html(''); // Limpa a lista de itens do carrinho, para poder carregar os novos itens.

            $.each(MEU_CARRINHO, (i, e) => {

                let temp = cardapio.templates.itemCarrinho.replace(/\${img}/g, e.img) 
                .replace(/\${name}/g, e.name)
                .replace(/\${price}/g, e.price.toFixed(2).replace('.', ','))
                .replace(/\${id}/g, e.id)
                .replace(/\${qntd}/g, e.qntd)

                $("#itensCarrinho").append(temp)

                // último item
                if ((i + 1 ) === MEU_CARRINHO.length) {
                    cardapio.metodos.carregaValores()
                }

            })

        } else {

            $("#itensCarrinho").html('<p class="carrinho-vazio"><i class="fa fa-shopping-bag"></i>Seu carrinho está vazio.</p>')
            cardapio.metodos.carregaValores()
        }
    },


    //DIMINUIR QUANTIDADE DO ITEM NO CARRINHO

    diminuirQuantidadeCarrinho: (id) => {

        let qntdAtual = parseInt($("#qntd-carrinho-" + id).text()); 

        if(qntdAtual > 1) {
            $("#qntd-carrinho-" + id).text(qntdAtual - 1);
            cardapio.metodos.atualizarCarrinho(id, qntdAtual - 1)
        } 
        else {
            cardapio.metodos.removerItemCarrinho(id);
        }

    },

     //AUMENTA QUANTIDADE DO ITEM NO CARRINHO
    aumentarQuantidadeCarrinho: (id) => {

        let qntdAtual = parseInt($("#qntd-carrinho-" + id).text()); 
        $("#qntd-carrinho-" + id).text(qntdAtual + 1);
        cardapio.metodos.atualizarCarrinho(id, qntdAtual + 1)
    },

     //REMOVE QUANTIDADE DO ITEM NO CARRINHO
    removerItemCarrinho: (id) => {

        MEU_CARRINHO = $.grep(MEU_CARRINHO, (e, i) => { return e.id != id });// retornando a liste de itens que não tem o id, ou seja, excluindo o item do carrinho.
        cardapio.metodos.carregarCarrinho();

         //ATUALIZA BOTÃO DO CARRINHO COM QUANTIDADE ATUALIZADA
        cardapio.metodos.atualizarBadgeTotal();
    },


    // ATUALIZA O CARRINHO COM A QUANTIDADE ATUAL.
    atualizarCarrinho: (id, qntd) => {

        let objIndex = MEU_CARRINHO.findIndex((obj => obj.id === id));
        MEU_CARRINHO[objIndex].qntd = qntd;

        //ATUALIZA BOTÃO DO CARRINHO COM QUANTIDADE ATUALIZADA
        cardapio.metodos.atualizarBadgeTotal();

        //ATUALIZA OS VALORES (R$) TOTAIS DO CARRINHO.
        cardapio.metodos.carregaValores()

    },

    // CARREGA OS VALORES DE SUBTOTAL, ENTREGA E TOTAL.
    carregaValores: () => {

        VALOR_CARRINHO = 0;

        $("#lblSubtotal").text('R$ 0,00');
        $("#lblValorEntrega").text('+ R$ 0,00');
        $("#lblValorTotal").text('R$ 0,00');

        $.each(MEU_CARRINHO, (i, e) => {

            VALOR_CARRINHO += parseFloat(e.price) * e.qntd;

            if ((i + 1) === MEU_CARRINHO.length) {
                
                $("#lblSubtotal").text(`R$ ${VALOR_CARRINHO.toFixed(2).replace('.', ',')}`);
                $("#lblValorEntrega").text(`+ R$ ${VALOR_ENTREGA.toFixed(2).replace('.', ',')}`);
                $("#lblValorTotal").text(`R$ ${(VALOR_CARRINHO + VALOR_ENTREGA).toFixed(2).replace('.', ',')}`);
            }

        })
    },


    //CARREGAR A ETAPA ENDEREÇOS
    carregarEndereco: () => {
        //validar se o carrinho está vazio ou não.
        if (MEU_CARRINHO.length <= 0) {
            cardapio.metodos.mensagem('Seu carrinho está vazio.')
            return;
        }

        cardapio.metodos.carregarEtapa(2)
    },


    // API viaCep
    buscarCep: () => {

        //variável com valor do cep.
        let cep = $("#txtCEP").val().trim().replace(/\D/g, ''); // trim remove espaços em branco, replace remove caracteres especiais.
        
        //verifica se o cep possui valor informado
        if (cep !== "") {

            // expressão regular para validação do cep.
            let validaCep = /^[0-9]{8}$/;

            if (validaCep.test(cep)) {

                //consulta a API viaCep
                $.getJSON("https://viacep.com.br/ws/" + cep + "/json/?callback=?", function (dados) {

                    if (!("erro" in dados)) {

                        // Atualizar os campos com os valores retornados da API.
                        $("#txtEndereco").val(dados.logradouro);
                        $("#txtBairro").val(dados.bairro);
                        $("#txtCidade").val(dados.localidade);
                        $("#ddlUf").val(dados.uf);
                        $("#txtNumero").focus();

                    }
                    else {
                        cardapio.metodos.mensagem('CEP não encontrado. Preencha as informações manualmente;') 
                        $("#txtEndereco").focus();
                    }

                })

            }
            else {
                cardapio.metodos.mensagem('Formato do CEP inválido.')
                $("#txtCEP").focus();
            }



        }
        else {
            cardapio.metodos.mensagem('Informe o CEP, por favor.')
            $("#txtCEP").focus();
        }
    
    },


    // VALIDAÇÃO ANTES DE PROSSEGUIR PARA A ETAPA 3
    resumoPedido: () => {

        let cep = $("#txtCEP").val().trim();
        let endereco = $("#txtEndereco").val().trim();
        let bairro = $("#txtBairro").val().trim();
        let cidade = $("#txtCidade").val().trim();
        let uf = $("#ddlUf").val().trim();
        let numero = $("#txtNumero").val().trim();
        let complemento = $("#txtComplemento").val().trim();

      

        if (cep.length <= 0 ) {
            cardapio.metodos.mensagem('Informe o CEP, por favor.')
            $("#txtCEP").focus();
            return;
        }


        if (endereco.length <= 0 ) {
            cardapio.metodos.mensagem('Informe o Logradouro, por favor.')
            $("#txtEndereco").focus();
            return;
        }

        if (bairro.length <= 0 ) {
            cardapio.metodos.mensagem('Informe o Bairro, por favor.')
            $("#txtBairro").focus();
            return;
        }

        if (cidade.length <= 0 ) {
            cardapio.metodos.mensagem('Informe a Cidade, por favor.')
            $("#txtCidade").focus();
            return;
        }

        if (uf == "-1") {
            cardapio.metodos.mensagem('Informe o UF, por favor.')
            $("#ddlUf").focus();
            return;
        }

        if (numero.length <= 0) {
            cardapio.metodos.mensagem('Informe o Número, por favor.')
            $("#txtNumero").focus();
            return;
        }

        MEU_ENDERECO = {
            cep: cep,
            endereco: endereco,
            bairro: bairro,
            cidade: cidade,
            uf: uf,
            numero: numero,
            complemento: complemento
        }

        cardapio.metodos.carregarEtapa(3)
        cardapio.metodos.carregarResumo()

    },

    //CARREGA A ETAPA DE RESUMO DO PEDIDO
    carregarResumo: () => {

        $("#listaItensResumo").html('');

        $.each(MEU_CARRINHO, (i, e) => {

            let temp = cardapio.templates.itemResumo.replace(/\${img}/g, e.img) 
                .replace(/\${name}/g, e.name)
                .replace(/\${price}/g, e.price.toFixed(2).replace('.', ','))
                .replace(/\${qntd}/g, e.qntd)
            
                $("#listaItensResumo").append(temp);
        })

        $("#resumoEndereco").html(`${MEU_ENDERECO.endereco}, ${MEU_ENDERECO.numero}, ${MEU_ENDERECO.bairro}`)
        $("#cidadeEndereco").html(`${MEU_ENDERECO.cidade} - ${MEU_ENDERECO.uf} / ${MEU_ENDERECO.cep} ${MEU_ENDERECO.complemento}`);

        cardapio.metodos.finalizarPedido();

    },

    //ATUALIZA O LINK DO BOTÃO DO QHATSAPP COM O RESUMO DO PEDIDO

    finalizarPedido: () => {

        //

        if (MEU_CARRINHO.length > 0 && MEU_ENDERECO != null) {

            let texto = "Olá, gostaria de fazer o pedido:";
            texto += `\n*Itens do pedido:*\n\n\${itens}`;
            texto += '\n*Endereço de entrega:*';
            texto += `\n${MEU_ENDERECO.endereco}, ${MEU_ENDERECO.numero}, ${MEU_ENDERECO.bairro}`;
            texto += `\n${MEU_ENDERECO.cidade} - ${MEU_ENDERECO.uf} / ${MEU_ENDERECO.cep} ${MEU_ENDERECO.complemento}`;
            texto += `\n\n*Total (com entrega): R$ ${(VALOR_CARRINHO + VALOR_ENTREGA).toFixed(2).replace('.', ',')}*`;

            let itens = '';

            $.each(MEU_CARRINHO, (i, e) => {
                itens += `*${e.qntd}x* ${e.name} ........ R$ ${e.price.toFixed(2).replace('.', ',')} \n`;

                if (( i +1 ) === MEU_CARRINHO.length) {

                    texto = texto.replace(/\${itens}/g, itens);

                    // converter a URL

                    let encode = encodeURI(texto);
                    let URL = `https://wa.me/${CELULAR_EMPRESA}?text=${encode}`

                    $("#btnEtapaResumo").attr('href', URL);

                }
            })
            
        }

    },

    //carrega o link do botão de reserva
    carregaBtnReserva: () => {

        let texto = " Olá, gostaria de fazer uma *reserva*";

        let encode = encodeURI(texto);
        let URL = `https://wa.me/${CELULAR_EMPRESA}?text=${encode}`

        $("#btnReserva").attr('href', URL);

    },

    carregarBtnLigar: () => {

        $("#btnLigar").attr('href', `tel:${CELULAR_EMPRESA}`)

    },

    btnWhatsapp: () => {

        $("#btnWhats").attr('href', `https://wa.me/${CELULAR_EMPRESA}`)

    },

    btnWhatsapp2: () => {
        $("#btnWhats2").attr('href', `https://wa.me/${CELULAR_EMPRESA}`)
    },

    //alterna entre os depoimento
    abrirDepoimento: (depoimento) => {

        $("#depoimento-1").addClass('hidden');
        $("#depoimento-2").addClass('hidden');
        $("#depoimento-3").addClass('hidden');

        $("#btnDepoimento-1").removeClass('active');
        $("#btnDepoimento-2").removeClass('active');
        $("#btnDepoimento-3").removeClass('active');


        $("#depoimento-" + depoimento).removeClass('hidden');

        $("#btnDepoimento-" + depoimento).addClass('active');

    },

    // Mensagem de alerta
    mensagem: (texto, cor = 'red', tempo = 3500) => {

        let id = Math.floor(Date.now() * Math.random()).toString()// Número aleatório para identificar a mensagem, para que sempre seja um id aleatório.

        let msg = `<div id="msg-${id}" class="animated fadeInDown toast ${cor}">${texto}</div>`

        $("#container-msg").append(msg);

        //remove a mensagem da tela após o tempo definido.
        setTimeout(() => {
            $("#msg-" + id).removeClass('fadeInDown')
            $("#msg-" + id).addClass('fadeOutUp')
            setTimeout(() => { //Remove a mensagems após a animação de saída.
                $("#msg-" + id).remove()
            }, 800);
        }, tempo)

    }   

    
}

cardapio.templates = {

    item: `

    <div class="col-3  mb-5 animated fadeInUp delay-02s">
        <div class="card card-item" id="\${id}">
             <div>
                <img class="img-produto" src="\${img}" >
            </div>
            <p class="title-produto text-center mt-4">
                <b>\${name}</b>
                <p class="price-produto text-center">
                    <b>R$ \${price}</b>
                </p>
            </p>
            <div class="add-carrinho">
                <span class="btn-menos" onclick="cardapio.metodos.diminuirQuantidade('\${id}')"> <i class="fas fa-minus"></i></span>
                <span class="add-numero-itens" id="qntd-\${id}"><b>0</b></span>
                <span class="btn-mais" onclick="cardapio.metodos.aumentarQuantidade('\${id}')"><i class="fas fa-plus"></i></span>
                <span class="btn btn-add" onclick="cardapio.metodos.adicionaAoCarrinho('\${id}')"><i class="fa fa-shopping-bag"></i></span>
            </div>
        </div>
  </div>
 `,

 itemCarrinho: `
    
<div class="col-12 item-carrinho">
    <div class="img-produto">
        <img src="\${img}">
    </div>
    <div class="dados-produtos">
        <p class="title-produto"><b>\${name}</b></p>
        <p class="price-produto"><b>R$ \${price}</b></p>
    </div>
    <div class="add-carrinho">
        <span class="btn-menos" onclick="cardapio.metodos.diminuirQuantidadeCarrinho('\${id}')"> <i class="fas fa-minus"></i></span>
        <span class="add-numero-itens" id="qntd-carrinho-\${id}"><b>\${qntd}</b></span>
        <span class="btn-mais" onclick="cardapio.metodos.aumentarQuantidadeCarrinho('\${id}')"><i class="fas fa-plus"></i></span>
        <span class="btn btn-remove" onclick="cardapio.metodos.removerItemCarrinho('\${id}')"><i class="fa fa-times"></i></span>
    </div>
</div>

 `,

itemResumo: `

<div class="col-12 item-carrinho-resumo">
    <div class="img-produto-resumo">
        <img src="\${img}">
    </div>
        <div class="dados-produto">
            <p class="title-produto-resumo">
                <b>\${name}</b>
            </p>

            <p class="price-produto-resumo">
                <b>R$ \${price}</b>
            </p>
    
            <p class="quantidade-produto-resumo">
                <span>x </span>  <b> \${qntd} </b>
            </p>
        </div>
</div>

`


}


/// PAREI COM 13:00 -- manipulando cardápio parte 4.