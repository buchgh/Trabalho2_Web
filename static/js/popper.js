/ **
 * @ popperjs / core v2.10.2 - Licença MIT
 * /

(função (global, fábrica) {
  exportação typeof === 'objeto' && módulo typeof! == 'undefined'? fábrica (exportações):
  typeof define === 'function' && define.amd? define (['exportações'], fábrica):
  (global = typeof globalThis! == 'undefined'? globalThis: global || self, factory (global.Popper = {}));
} (isto, (função (exportações) {'usar estrito';

  // import {isHTMLElement} de './instanceOf';
  function getBoundingClientRect (element, // eslint-disable-next-line unused-import / no-unused-vars
  includeScale) {

    var rect = element.getBoundingClientRect ();
    var scaleX = 1;
    escala var Y = 1; // FIXME:
    // `offsetWidth` retorna um inteiro enquanto` getBoundingClientRect`
    // retorna um float. Isso resulta em `scaleX` ou` scaleY` sendo
    // diferente de 1 quando deveria ser para elementos que não são um pixel completo em
    // largura ou altura.
    // if (isHTMLElement (element) && includeScale) {
    // const offsetHeight = element.offsetHeight;
    // const offsetWidth = element.offsetWidth;
    // // Não tente dividir por 0, caso contrário, obteremos `Infinito` como escala
    // // Fallback para 1 no caso de ambos os valores serem `0`
    // if (offsetWidth> 0) {
    // scaleX = rect.width / offsetWidth || 1;
    //}
    // if (offsetHeight> 0) {
    // scaleY = rect.height / offsetHeight || 1;
    //}
    //}

    Retorna {
      largura: rect.width / scaleX,
      altura: rect.height / scaleY,
      topo: rect.top / scaleY,
      direita: rect.right / scaleX,
      inferior: rect.bottom / scaleY,
      esquerda: rect.left / scaleX,
      x: rect.esquerdo / escalaX,
      y: rect.top / scaleY
    };
  }

  function getWindow (node) {
    if (node ​​== null) {
      janela de retorno;
    }

    if (node.toString ()! == '[Object Window]') {
      var ownerDocument = node.ownerDocument;
      retornar ownerDocument? ownerDocument.defaultView || janela: janela;
    }

    nó de retorno;
  }

  function getWindowScroll (node) {
    var win = getWindow (nó);
    var scrollLeft = win.pageXOffset;
    var scrollTop = win.pageYOffset;
    Retorna {
      scrollLeft: scrollLeft,
      scrollTop: scrollTop
    };
  }

  function isElement (node) {
    var OwnElement = getWindow (node) .Element;
    return node instanceof OwnElement || elemento node instanceof;
  }

  function isHTMLElement (nó) {
    var OwnElement = getWindow (nó) .HTMLElement;
    return node instanceof OwnElement || node instanceof HTMLElement;
  }

  function isShadowRoot (node) {
    // IE 11 não tem ShadowRoot
    if (typeof ShadowRoot === 'undefined') {
      retorna falso;
    }

    var OwnElement = getWindow (node) .ShadowRoot;
    return node instanceof OwnElement || node instanceof ShadowRoot;
  }

  function getHTMLElementScroll (element) {
    Retorna {
      scrollLeft: element.scrollLeft,
      scrollTop: element.scrollTop
    };
  }

  function getNodeScroll (node) {
    if (node ​​=== getWindow (node) ||! isHTMLElement (node)) {
      return getWindowScroll (node);
    } outro {
      retornar getHTMLElementScroll (nó);
    }
  }

  function getNodeName (element) {
    elemento de retorno? (element.nodeName || '') .toLowerCase (): null;
  }

  function getDocumentElement (element) {
    // $ FlowFixMe [incompatible-return]: assume que o corpo está sempre disponível
    return ((isElement (element)? element.ownerDocument: // $ FlowFixMe [prop-missing]
    element.document) || window.document) .documentElement;
  }

  function getWindowScrollBarX (element) {
    // Se <html> tiver uma largura CSS maior do que a janela de visualização, isso será
    // incorreto para RTL.
    // Popper 1 está quebrado neste caso e nunca teve um relatório de bug, então vamos assumir
    // não é um problema. Acho que ninguém especifica a largura em <html>
    // qualquer forma.
    // Navegadores onde a barra de rolagem esquerda não causa um relatório de problema `0` para
    // isto (por exemplo, Edge 2019, IE11, Safari)
    return getBoundingClientRect (getDocumentElement (element)). left + getWindowScroll (element) .scrollLeft;
  }

  function getComputedStyle (element) {
    return getWindow (element) .getComputedStyle (element);
  }

  function isScrollParent (element) {
    // O Firefox quer que verifiquemos as variações `-x` e` -y` também
    var _getComputedStyle = getComputedStyle (elemento),
        overflow = _getComputedStyle.overflow,
        overflowX = _getComputedStyle.overflowX,
        overflowY = _getComputedStyle.overflowY;

    return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
  }

  function isElementScaled (element) {
    var rect = element.getBoundingClientRect ();
    var scaleX = rect.width / element.offsetWidth || 1;
    var scaleY = rect.height / element.offsetHeight || 1;
    return scaleX! == 1 || escalaY! == 1;
  } // Retorna o retângulo composto de um elemento relativo a seu offsetParent.
  // Composto significa que leva em consideração as transformações, bem como o layout.


  function getCompositeRect (elementOrVirtualElement, offsetParent, isFixed) {
    if (isFixed === void 0) {
      isFixed = false;
    }

    var isOffsetParentAnElement = isHTMLElement (offsetParent);
    isHTMLElement (offsetParent) && isElementScaled (offsetParent);
    var documentElement = getDocumentElement (offsetParent);
    var rect = getBoundingClientRect (elementOrVirtualElement);
    var scroll = {
      scrollLeft: 0,
      scrollTop: 0
    };
    var offsets = {
      x: 0,
      y: 0
    };

    if (isOffsetParentAnElement ||! isOffsetParentAnElement &&! isFixed) {
      if (getNodeName (offsetParent)! == 'body' || // https://github.com/popperjs/popper-core/issues/1078
      isScrollParent (documentElement)) {
        scroll = getNodeScroll (offsetParent);
      }

      if (isHTMLElement (offsetParent)) {
        offsets = getBoundingClientRect (offsetParent);
        offsets.x + = offsetParent.clientLeft;
        offsets.y + = offsetParent.clientTop;
      } else if (documentElement) {
        offsets.x = getWindowScrollBarX (documentElement);
      }
    }

    Retorna {
      x: rect.left + scroll.scrollLeft - offsets.x,
      y: rect.top + scroll.scrollTop - offsets.y,
      largura: rect.width,
      altura: rect.height
    };
  }

  // significa que não leva em consideração as transformações.

  function getLayoutRect (element) {
    var clientRect = getBoundingClientRect (elemento); // Use os tamanhos de clientRect se não tiver sido transformado.
    // Corrige https://github.com/popperjs/popper-core/issues/1223

    var width = element.offsetWidth;
    var height = element.offsetHeight;

    if (Math.abs (clientRect.width - width) <= 1) {
      largura = clientRect.width;
    }

    if (Math.abs (clientRect.height - height) <= 1) {
      height = clientRect.height;
    }

    Retorna {
      x: element.offsetLeft,
      y: element.offsetTop,
      largura: largura,
      altura: altura
    };
  }

  function getParentNode (element) {
    if (getNodeName (element) === 'html') {
      elemento de retorno;
    }

    return (// esta é uma maneira mais rápida (mas menos segura) de salvar alguns bytes do pacote
      // $ FlowFixMe [incompatible-return]
      // $ FlowFixMe [falta prop]
      element.assignedSlot || // entra na sombra DOM do pai de um nó com slot
      element.parentNode || (// Elemento DOM detectado
      isShadowRoot (elemento)? element.host: null) || // ShadowRoot detectado
      // $ FlowFixMe [incompatible-call]: HTMLElement é um Node
      getDocumentElement (element) // fallback

    );
  }

  function getScrollParent (node) {
    if (['html', 'body', '#document']. indexOf (getNodeName (node))> = 0) {
      // $ FlowFixMe [incompatible-return]: assume que o corpo está sempre disponível
      return node.ownerDocument.body;
    }

    if (isHTMLElement (node) && isScrollParent (node)) {
      nó de retorno;
    }

    return getScrollParent (getParentNode (node));
  }

  / *
  dado um elemento DOM, retorna a lista de todos os pais de rolagem, até a lista de ancestrais
  até chegarmos ao objeto da janela superior. Esta lista é o que anexamos ouvintes de rolagem
  para, porque se qualquer um desses elementos pai rolar, precisaremos recalcular o
  posição do elemento de referência.
  * /

  function listScrollParents (elemento, lista) {
    var _element $ ownerDocumen;

    if (list === void 0) {
      lista = [];
    }

    var scrollParent = getScrollParent (elemento);
    var isBody = scrollParent === ((_element $ ownerDocumen = element.ownerDocument) == null? void 0: _element $ ownerDocumen.body);
    var win = getWindow (scrollParent);
    var target = isBody? [win] .concat (win.visualViewport || [], isScrollParent (scrollParent)? scrollParent: []): scrollParent;
    var updatedList = list.concat (target);
    return isBody? updatedList: // $ FlowFixMe [incompatible-call]: isBody nos diz que o destino será um HTMLElement aqui
    updatedList.concat (listScrollParents (getParentNode (target)));
  }

  function isTableElement (element) {
    return ['table', 'td', 'th']. indexOf (getNodeName (element))> = 0;
  }

  function getTrueOffsetParent (element) {
    if (! isHTMLElement (element) || // https://github.com/popperjs/popper-core/issues/837
    getComputedStyle (element) .position === 'fixed') {
      return null;
    }

    return element.offsetParent;
  } // `.offsetParent` relata` null` para elementos fixos, enquanto elementos absolutos
  // retorna o bloco que contém


  function getContainingBlock (element) {
    var isFirefox = navigator.userAgent.toLowerCase (). indexOf ('firefox')! == -1;
    var isIE = navigator.userAgent.indexOf ('Trident')! == -1;

    if (isIE && isHTMLElement (element)) {
      // No IE 9, 10 e 11, elementos fixos contendo blocos são sempre estabelecidos pela janela de visualização
      var elementCss = getComputedStyle (elemento);

      if (elementCss.position === 'fixed') {
        return null;
      }
    }

    var currentNode = getParentNode (elemento);

    while (isHTMLElement (currentNode) && ['html', 'body']. indexOf (getNodeName (currentNode)) <0) {
      var css = getComputedStyle (currentNode); // Isso não é exaustivo, mas cobre as propriedades CSS mais comuns que
      // cria um bloco de contenção.
      // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block

      if (css.transform! == 'nenhum' || css.perspective! == 'nenhum' || css.contain === 'pintar' || ['transformar', 'perspectiva']. indexOf (css.willChange )! == -1 || isFirefox && css.willChange === 'filter' || isFirefox && css.filter && css.filter! == 'none') {
        return currentNode;
      } outro {
        currentNode = currentNode.parentNode;
      }
    }

    return null;
  } // Obtém o elemento ancestral mais próximo posicionado. Lida com alguns casos extremos,
  // como ancestrais de tabela e bugs do navegador cruzado.


  function getOffsetParent (element) {
    janela var = getWindow (elemento);
    var offsetParent = getTrueOffsetParent (elemento);

    while (offsetParent && isTableElement (offsetParent) && getComputedStyle (offsetParent) .position === 'static') {
      offsetParent = getTrueOffsetParent (offsetParent);
    }

    if (offsetParent && (getNodeName (offsetParent) === 'html' || getNodeName (offsetParent) === 'body' && getComputedStyle (offsetParent) .position === 'static')) {
      janela de retorno;
    }

    return offsetParent || getContainingBlock (element) || janela;
  }

  var top = 'top';
  var inferior = 'inferior';
  var right = 'right';
  var left = 'left';
  var auto = 'auto';
  var basePlacements = [superior, inferior, direita, esquerda];
  var start = 'start';
  var end = 'fim';
  var clippingParents = 'clippingParents';
  var viewport = 'viewport';
  var popper = 'popper';
  var referência = 'referência';
  var variablePlacements = /*#__PURE__*/basePlacements.reduce(function (acc, placement) {
    return acc.concat ([colocação + "-" + início, colocação + "-" + fim]);
  }, []);
  var placements = /*#__PURE__*/[].concat(basePlacements, [auto]). reduce (function (acc, placement) {
    return acc.concat ([colocação, colocação + "-" + início, colocação + "-" + fim]);
  }, []); // modificadores que precisam ler o DOM

  var beforeRead = 'beforeRead';
  var ler = 'ler';
  var afterRead = 'afterRead'; // modificadores de lógica pura

  var beforeMain = 'beforeMain';
  var main = 'principal';
  var afterMain = 'afterMain'; // modificador com a finalidade de gravar no DOM (ou gravar em um estado de estrutura)

  var beforeWrite = 'beforeWrite';
  var escrever = 'escrever';
  var afterWrite = 'afterWrite';
  var modifierPhases = [beforeRead, read, afterRead, beforeMain, main, afterMain, beforeWrite, write, afterWrite];

  ordem de função (modificadores) {
    var map = new Map ();
    var visitado = novo Set ();
    var result = [];
    modifiers.forEach (function (modifier) ​​{
      map.set (modifier.name, modifier);
    }); // Ao visitar o objeto, verifique suas dependências e visite-as recursivamente

    função sort (modificador) {
      visitado.add (modificador.nome);
      var requer = [] .concat (modifier.requires || [], modifier.requiresIfExists || []);
      requer.forEach (função (dep) {
        if (! visitado.has (dep)) {
          var depModifier = map.get (dep);

          if (depModifier) ​​{
            sort (depModifier);
          }
        }
      });
      result.push (modificador);
    }

    modifiers.forEach (function (modifier) ​​{
      if (! visitado.has (modificador.nome)) {
        // verificar o objeto visitado
        classificar (modificador);
      }
    });
    resultado de retorno;
  }

  function orderModifiers (modifiers) {
    // pedido com base nas dependências
    var OrderModifiers = order (modificadores); // pedido com base na fase

    return modifierPhases.reduce (function (acc, phase) {
      return acc.concat (OrderModifiers.filter (function (modifier) ​​{
        return modifier.phase === phase;
      }));
    }, []);
  }

  function debounce (fn) {
    var pendente;
    return function () {
      if (! pendente) {
        pendente = nova promessa (função (resolver) {
          Promise.resolve (). Then (function () {
            pendente = indefinido;
            resolver (fn ());
          });
        });
      }

      retorno pendente;
    };
  }

  formato da função (str) {
    for (var _len = arguments.length, args = new Array (_len> 1? _len - 1: 0), _key = 1; _key <_len; _key ++) {
      args [_key - 1] = argumentos [_key];
    }

    return [] .concat (args) .reduce (function (p, c) {
      return p.replace (/% s /, c);
    }, str);
  }

  var INVALID_MODIFIER_ERROR = 'Popper: modificador "% s" forneceu uma propriedade% s inválida, esperava% s mas obteve% s';
  var MISSING_DEPENDENCY_ERROR = 'Popper: o modificador "% s" requer "% s", mas o modificador "% s" não está disponível';
  var VALID_PROPERTIES = ['nome', 'habilitado', 'fase', 'fn', 'efeito', 'requer', 'opções'];
  function validateModifiers (modifiers) {
    modifiers.forEach (function (modifier) ​​{
      [] .concat (Object.keys (modifier), VALID_PROPERTIES) // Substituição compatível com IE11 para `novo conjunto (iterável)`
      .filter (function (value, index, self) {
        return self.indexOf (value) === index;
      }). forEach (function (key) {
        switch (chave) {
          caso 'nome':
            if (modificador typeof.name! == 'string') {
              console.error (format (INVALID_MODIFIER_ERROR, String (modifier.name), '"name"', '"string"', "\" "+ String (modifier.name) +" \ ""));
            }

            pausa;

          caso 'habilitado':
            if (modificador typeof.enabled! == 'boolean') {
              console.error (format (INVALID_MODIFIER_ERROR, modifier.name, '"enabled"', '"boolean"', "\" "+ String (modifier.enabled) +" \ ""));
            }

            pausa;

          caso 'fase':
            if (modifierPhases.indexOf (modifier.phase) <0) {
              console.error (format (INVALID_MODIFIER_ERROR, modifier.name, '"phase"', "qualquer" + modifierPhases.join (','), "\" "+ String (modifier.phase) +" \ ""));
            }

            pausa;

          case 'fn':
            if (modificador de tipo.fn! == 'função') {
              console.error (formato (INVALID_MODIFIER_ERROR, modificador.nome, '"fn"', '"função"', "\" "+ String (modificador.fn) +" \ ""));
            }

            pausa;

          caso 'efeito':
            if (modifier.effect! = null && typeof modifier.effect! == 'function') {
              console.error (formato (INVALID_MODIFIER_ERROR, modificador.nome, '"efeito"', '"função"', "\" "+ String (modificador.fn) +" \ ""));
            }

            pausa;

          caso 'requer':
            if (modifier.requires! = null &&! Array.isArray (modifier.requires)) {
              console.error (format (INVALID_MODIFIER_ERROR, modifier.name, '"requer"', '"array"', "\" "+ String (modifier.requires) +" \ ""));
            }

            pausa;

          caso 'requerIfExiste':
            if (! Array.isArray (modifier.requiresIfExists)) {
              console.error (format (INVALID_MODIFIER_ERROR, modifier.name, '"requiresIfExists"', '"array"', "\" "+ String (modifier.requiresIfExists) +" \ ""));
            }

            pausa;

          caso 'opções':
          'dados' do caso:
            pausa;

          predefinição:
            console.error ("PopperJS: uma propriedade inválida foi fornecida ao modificador \" "+ modifier.name +" \ ", propriedades válidas são" + VALID_PROPERTIES.map (função (ões) {
              return "\" "+ s +" \ "";
            }). join (',') + "; mas \" "+ key +" \ "foi fornecida.");
        }

        modifier.requires && modifier.requires.forEach (função (requisito) {
          if (modifiers.find (function (mod) {
            return mod.name === requisito;
          }) == null) {
            console.error (formato (MISSING_DEPENDENCY_ERROR, String (modificador.nome), requisito, requisito));
          }
        });
      });
    });
  }

  function uniqueBy (arr, fn) {
    identificadores de var = new Set ();
    return arr.filter (function (item) {
      identificador de var = fn (item);

      if (! identifiers.has (identifier)) {
        identifiers.add (identificador);
        return true;
      }
    });
  }

  function getBasePlacement (placement) {
    return placement.split ('-') [0];
  }

  function mergeByName (modificadores) {
    var merged = modifiers.reduce (function (merged, current) {
      var existing = merged [current.name];
      mesclado [current.name] = existente? Object.assign ({}, existing, current, {
        opções: Object.assign ({}, existing.options, current.options),
        dados: Object.assign ({}, existing.data, current.data)
      }) : atual;
      retorno mesclado;
    }, {}); // IE11 não oferece suporte a Object.values

    return Object.keys (merged) .map (function (key) {
      retornar mesclado [chave];
    });
  }

  function getViewportRect (element) {
    var win = getWindow (elemento);
    var html = getDocumentElement (elemento);
    var visualViewport = win.visualViewport;
    var width = html.clientWidth;
    var height = html.clientHeight;
    var x = 0;
    var y = 0; // NB: Isso não é compatível com iOS <= 12. Se o teclado estiver aberto, o popper
    // pode ser obscurecido por baixo dele.
    // Além disso, `html.clientHeight` adiciona a altura da barra inferior no Safari iOS, mesmo
    // se não estiver aberto, se não estiver disponível, o popper será detectado
    // para transbordar a parte inferior da tela muito cedo.

    if (visualViewport) {
      largura = visualViewport.width;
      height = visualViewport.height; // Usa a janela de visualização de layout (como o Chrome; o Safari não usa atualmente)
      // No Chrome, ele retorna um valor muito próximo de 0 (+/-), mas contém arredondamento
      // erros devido a números de ponto flutuante, portanto, precisamos verificar a precisão.
      // Safari retorna um número <= 0, geralmente <-1 quando o zoom é feito com gesto de pinça
      // A detecção de recurso falha no modo de emulação móvel no Chrome.
      // Math.abs (win.innerWidth / visualViewport.scale - visualViewport.width) <
      // 0,001
      // Fallback aqui: userAgent "Não Safari"

      if (! / ^ ((?! chrome | android).) * safari / i.test (navigator.userAgent)) {
        x = visualViewport.offsetLeft;
        y = visualViewport.offsetTop;
      }
    }

    Retorna {
      largura: largura,
      altura: altura,
      x: x + getWindowScrollBarX (elemento),
      y: y
    };
  }

  var max = Math.max;
  var min = Math.min;
  var round = Math.round;

  // dos limites retos `<html>` e `<body>` se rolável horizontalmente

  function getDocumentRect (element) {
    var _element $ ownerDocumen;

    var html = getDocumentElement (elemento);
    var winScroll = getWindowScroll (elemento);
    var body = (_element $ ownerDocumen = element.ownerDocument) == null? vazio 0: _element $ ownerDocumen.body;
    var width = max (html.scrollWidth, html.clientWidth, body? body.scrollWidth: 0, body? body.clientWidth: 0);
    var height = max (html.scrollHeight, html.clientHeight, body? body.scrollHeight: 0, body? body.clientHeight: 0);
    var x = -winScroll.scrollLeft + getWindowScrollBarX (elemento);
    var y = -winScroll.scrollTop;

    if (getComputedStyle (body || html) .direction === 'rtl') {
      x + = max (html.clientWidth, body? body.clientWidth: 0) - largura;
    }

    Retorna {
      largura: largura,
      altura: altura,
      x: x,
      y: y
    };
  }

  função contém (pai, filho) {
    var rootNode = child.getRootNode && child.getRootNode (); // Primeiro, tente com o método nativo mais rápido

    if (parent.contains (child)) {
      return true;
    } // em seguida, retorne para a implementação personalizada com suporte Shadow DOM
    else if (rootNode && isShadowRoot (rootNode)) {
        var next = child;

        Faz {
          if (next && parent.isSameNode (next)) {
            return true;
          } // $ FlowFixMe [prop-missing]: precisa de uma maneira melhor de lidar com isso ...


          next = next.parentNode || next.host;
        } enquanto (próximo);
      } // Desista, o resultado é falso


    retorna falso;
  }

  function rectToClientRect (rect) {
    return Object.assign ({}, rect, {
      esquerda: rect.x,
      topo: rect.y,
      direita: rect.x + rect.width,
      inferior: rect.y + rect.height
    });
  }

  function getInnerBoundingClientRect (element) {
    var rect = getBoundingClientRect (elemento);
    rect.top = rect.top + element.clientTop;
    rect.left = rect.left + element.clientLeft;
    rect.bottom = rect.top + element.clientHeight;
    rect.right = rect.left + element.clientWidth;
    rect.width = element.clientWidth;
    rect.height = element.clientHeight;
    rect.x = rect.esquerdo;
    rect.y = rect.top;
    return rect;
  }

  function getClientRectFromMixedType (element, clippingParent) {
    return clippingParent === janela de visualização? rectToClientRect (getViewportRect (element)): isHTMLElement (clippingParent)? getInnerBoundingClientRect (clippingParent): rectToClientRect (getDocumentRect (getDocumentElement (element)));
  } // Um ​​"pai de recorte" é um contêiner transbordável com a característica de
  // recortando (ou ocultando) elementos que transbordam com uma posição diferente de
  // `inicial`


  function getClippingParents (element) {
    var clippingParents = listScrollParents (getParentNode (elemento));
    var canEscapeClipping = ['absolute', 'fixed']. indexOf (getComputedStyle (element) .position)> = 0;
    var clipperElement = canEscapeClipping && isHTMLElement (element)? getOffsetParent (element): element;

    if (! isElement (clipperElement)) {
      Retorna [];
    } // $ FlowFixMe [incompatible-return]: https://github.com/facebook/flow/issues/1414


    return clippingParents.filter (function (clippingParent) {
      return isElement (clippingParent) && contains (clippingParent, clipperElement) && getNodeName (clippingParent)! == 'body';
    });
  } // Obtém a área máxima em que o elemento é visível devido a qualquer número de
  // cortando pais


  function getClippingRect (element, boundary, rootBoundary) {
    var mainClippingParents = boundary === 'clippingParents'? getClippingParents (elemento): [] .concat (limite);
    var clippingParents = [] .concat (mainClippingParents, [rootBoundary]);
    var firstClippingParent = clippingParents [0];
    var clippingRect = clippingParents.reduce (function (accRect, clippingParent) {
      var rect = getClientRectFromMixedType (element, clippingParent);
      accRect.top = max (rect.top, accRect.top);
      accRect.right = min (rect.right, accRect.right);
      accRect.bottom = min (rect.bottom, accRect.bottom);
      accRect.left = max (rect.left, accRect.left);
      return accRect;
    }, getClientRectFromMixedType (element, firstClippingParent));
    clippingRect.width = clippingRect.right - clippingRect.left;
    clippingRect.height = clippingRect.bottom - clippingRect.top;
    clippingRect.x = clippingRect.left;
    clippingRect.y = clippingRect.top;
    return clippingRect;
  }

  function getVariation (placement) {
    return placement.split ('-') [1];
  }

  function getMainAxisFromPlacement (placement) {
    return ['superior', 'inferior']. indexOf (colocação)> = 0? 'x': 'y';
  }

  function computeOffsets (_ref) {
    var reference = _ref.reference,
        element = _ref.element,
        colocação = _ref.placement;
    var basePlacement = placement? getBasePlacement (colocação): null;
    variação de var = posicionamento? getVariation (colocação): null;
    var commonX = reference.x + reference.width / 2 - element.width / 2;
    var commonY = reference.y + reference.height / 2 - element.height / 2;
    var offsets;

    switch (basePlacement) {
      parte superior da caixa:
        offsets = {
          x: commonX,
          y: referência.y - elemento.height
        };
        pausa;

      fundo da caixa:
        offsets = {
          x: commonX,
          y: reference.y + reference.height
        };
        pausa;

      caso certo:
        offsets = {
          x: reference.x + reference.width,
          y: commonY
        };
        pausa;

      caso restante:
        offsets = {
          x: reference.x - element.width,
          y: commonY
        };
        pausa;

      predefinição:
        offsets = {
          x: referência.x,
          y: referência.y
        };
    }

    var mainAxis = basePlacement? getMainAxisFromPlacement (basePlacement): null;

    if (mainAxis! = null) {
      var len = mainAxis === 'y'? 'altura largura';

      switch (variação) {
        início do caso:
          offsets [mainAxis] = offsets [mainAxis] - (referência [len] / 2 - elemento [len] / 2);
          pausa;

        fim do caso:
          offsets [mainAxis] = offsets [mainAxis] + (referência [len] / 2 - elemento [len] / 2);
          pausa;
      }
    }

    compensações de retorno;
  }

  function getFreshSideObject () {
    Retorna {
      topo: 0,
      direito: 0,
      inferior: 0,
      esquerda: 0
    };
  }

  function mergePaddingObject (paddingObject) {
    return Object.assign ({}, getFreshSideObject (), paddingObject);
  }

  function expandToHashMap (value, keys) {
    return keys.reduce (function (hashMap, key) {
      hashMap [chave] = valor;
      return hashMap;
    }, {});
  }

  function detectOverflow (estado, opções) {
    if (options === void 0) {
      opções = {};
    }

    var _options = options,
        _options $ placement = _options.placement,
        colocação = _options $ colocação === vazio 0? state.placement: _options $ placement,
        _options $ boundary = _options.boundary,
        limite = _options $ limite === vazio 0? clippingParents: _options $ boundary,
        _options $ rootBoundary = _options.rootBoundary,
        rootBoundary = _options $ rootBoundary === void 0? janela de visualização: _options $ rootBoundary,
        _options $ elementConte = _options.elementContext,
        elementContext = _options $ elementConte === void 0? popper: _options $ elementConte,
        _options $ altBoundary = _options.altBoundary,
        altBoundary = _options $ altBoundary === void 0? falso: _options $ altBoundary,
        _options $ padding = _options.padding,
        padding = _options $ padding === void 0? 0: _options $ padding;
    var paddingObject = mergePaddingObject (typeof padding! == 'number'? padding: expandToHashMap (padding, basePlacements));
    var altContext = elementContext === popper? referência: popper;
    var popperRect = state.rects.popper;
    var element = state.elements [altBoundary? altContext: elementContext];
    var clippingClientRect = getClippingRect (isElement (element)? elemento: element.contextElement || getDocumentElement (state.elements.popper), limite, rootBoundary);
    var referenceClientRect = getBoundingClientRect (state.elements.reference);
    var popperOffsets = computeOffsets ({
      referência: referenceClientRect,
      elemento: popperRect,
      estratégia: 'absoluto',
      colocação: colocação
    });
    var popperClientRect = rectToClientRect (Object.assign ({}, popperRect, popperOffsets));
    var elementClientRect = elementContext === popper? popperClientRect: referenceClientRect; // positivo = transbordando o retalho de recorte
    // 0 ou negativo = dentro do retalho de recorte

    var overflowOffsets = {
      topo: clippingClientRect.top - elementClientRect.top + paddingObject.top,
      inferior: elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom,
      esquerda: clippingClientRect.left - elementClientRect.left + paddingObject.left,
      direita: elementClientRect.right - clippingClientRect.right + paddingObject.right
    };
    var offsetData = state.modifiersData.offset; // Os deslocamentos podem ser aplicados apenas ao elemento popper

    if (elementContext === popper && offsetData) {
      var offset = offsetData [posicionamento];
      Object.keys (overflowOffsets) .forEach (function (key) {
        var multiply = [right, bottom] .indexOf (key)> = 0? 1: -1;
        var axis = [top, bottom] .indexOf (key)> = 0? 'y': 'x';
        overflowOffsets [tecla] + = deslocamento [eixo] * multiplicação;
      });
    }

    return overflowOffsets;
  }

  var INVALID_ELEMENT_ERROR = 'Popper: Referência inválida ou argumento popper fornecido. Eles devem ser um elemento DOM ou um elemento virtual. ';
  var INFINITE_LOOP_ERROR = 'Popper: Um loop infinito no ciclo de modificadores foi detectado! O ciclo foi interrompido para evitar um travamento do navegador. ';
  var DEFAULT_OPTIONS = {
    colocação: 'inferior',
    modificadores: [],
    estratégia: 'absoluto'
  };

  function areValidElements () {
    for (var _len = arguments.length, args = new Array (_len), _key = 0; _key <_len; _key ++) {
      args [_key] = argumentos [_key];
    }

    return! args.some (function (element) {
      return! (elemento && typeof element.getBoundingClientRect === 'function');
    });
  }

  function popperGenerator (generatorOptions) {
    if (generatorOptions === void 0) {
      generatorOptions = {};
    }

    var _generatorOptions = generatorOptions,
        _generatorOptions $ def = _generatorOptions.defaultModifiers,
        defaultModifiers = _generatorOptions $ def === void 0? []: _generatorOptions $ def,
        _generatorOptions $ def2 = _generatorOptions.defaultOptions,
        defaultOptions = _generatorOptions $ def2 === void 0? DEFAULT_OPTIONS: _generatorOptions $ def2;
    função de retorno createPopper (referência, popper, opções) {
      if (options === void 0) {
        options = defaultOptions;
      }

      var state = {
        colocação: 'inferior',
        OrderModifiers: [],
        opções: Object.assign ({}, DEFAULT_OPTIONS, defaultOptions),
        modifiersData: {},
        elementos: {
          referência: referência,
          popper: popper
        },
        atributos: {},
        estilos: {}
      };
      var effectCleanupFns = [];
      var isDestroyed = false;
      var instance = {
        estado: estado,
        setOptions: function setOptions (setOptionsAction) {
          var options = typeof setOptionsAction === 'função'? setOptionsAction (state.options): setOptionsAction;
          cleanupModifierEffects ();
          state.options = Object.assign ({}, defaultOptions, state.options, options);
          state.scrollParents = {
            referência: isElement (referência)? listScrollParents (referência): reference.contextElement? listScrollParents (reference.contextElement): [],
            popper: listScrollParents (popper)
          }; // Ordena os modificadores com base em suas dependências e `fase`
          // propriedades

          var OrderModifiers = orderModifiers (mergeByName ([]. concat (defaultModifiers, state.options.modifiers))); // Remova os modificadores desativados

          state.orderedModifiers = ordersModifiers.filter (function (m) {
            return m.enabled;
          }); // Valide os modificadores fornecidos para que o consumidor seja avisado
          // se um dos modificadores for inválido por qualquer motivo

          {
            var modifiers = uniqueBy ([]. concat (OrderModifiers, state.options.modifiers), function (_ref) {
              var name = _ref.name;
              nome de retorno;
            });
            validateModifiers (modificadores);

            if (getBasePlacement (state.options.placement) === auto) {
              var flipModifier = state.orderedModifiers.find (function (_ref2) {
                var name = _ref2.name;
                return name === 'flip';
              });

              if (! flipModifier) ​​{
                console.error (['Popper: posicionamentos "auto" requerem que o modificador "flip" seja', 'presente e habilitado para funcionar.']. join (''));
              }
            }

            var _getComputedStyle = getComputedStyle (popper),
                marginTop = _getComputedStyle.marginTop,
                marginRight = _getComputedStyle.marginRight,
                marginBottom = _getComputedStyle.marginBottom,
                marginLeft = _getComputedStyle.marginLeft; // Não levamos mais em consideração as `margens` no popper, e ele pode
            // causa bugs com posicionamento, então avisaremos o consumidor


            if ([marginTop, marginRight, marginBottom, marginLeft] .algumas (função (margem) {
              return parseFloat (margem);
            })) {
              console.warn (['Popper: estilos de "margem" CSS não podem ser usados ​​para aplicar preenchimento', 'entre o popper e seu elemento ou limite de referência.', 'Para replicar margem, use o modificador `offset`, bem como' , 'a opção `padding` nos modificadores` preventOverflow` e `flip`', ']. join (' '));
            }
          }

          runModifierEffects ();
          return instance.update ();
        },
        // Sincronizar atualização - sempre será executado, mesmo se não for necessário. Esse
        // é útil para atualizações de baixa frequência, onde o comportamento de sincronização simplifica o
        // lógica.
        // Para atualizações de alta frequência (por exemplo, eventos `resize` e` scroll`), sempre
        // prefira o método assíncrono de atualização Popper #
        forceUpdate: function forceUpdate () {
          if (isDestroyed) {
            Retorna;
          }

          var _state $ elements = state.elements,
              reference = _state $ elements.reference,
              popper = _state $ elements.popper; // Não prossiga se `reference` ou` popper` não forem elementos válidos
          // mais

          if (! areValidElements (referência, popper)) {
            {
              console.error (INVALID_ELEMENT_ERROR);
            }

            Retorna;
          } // Armazena os efeitos de referência e popper para serem lidos pelos modificadores


          state.rects = {
            referência: getCompositeRect (referência, getOffsetParent (popper), state.options.strategy === 'fixed'),
            popper: getLayoutRect (popper)
          }; // Os modificadores têm a capacidade de redefinir o ciclo de atualização atual. o
          // o caso de uso mais comum para isso é o modificador `flip` alterando o
          // colocação, que então precisa executar novamente todos os modificadores, porque o
          // a lógica foi executada anteriormente para o canal anterior e é, portanto,
          // obsoleto / incorreto

          state.reset = false;
          state.placement = state.options.placement; // Em cada ciclo de atualização, a propriedade `modifiersData` para cada modificador
          // é preenchido com os dados iniciais especificados pelo modificador. Isso significa
          // não persiste e é atualizado a cada atualização.
          // Para garantir dados persistentes, use `$ {name} # persistent`

          state.orderedModifiers.forEach (function (modifier) ​​{
            retornar state.modifiersData [modifier.name] = Object.assign ({}, modifier.data);
          });
          var __debug_loops__ = 0;

          para (índice de var = 0; índice <state.orderedModifiers.length; índice ++) {
            {
              __debug_loops__ + = 1;

              if (__debug_loops__> 100) {
                console.error (INFINITE_LOOP_ERROR);
                pausa;
              }
            }

            if (state.reset === true) {
              state.reset = false;
              índice = -1;
              Prosseguir;
            }

            var _state $ OrderModifie = state.orderedModifiers [index],
                fn = _state $ OrderModifie.fn,
                _state $ OrderModifie2 = _state $ OrderModifie.options,
                _options = _state $ OrderModifie2 === void 0? {}: _state $ OrderModifie2,
                nome = _state $ OrderModifie.name;

            if (typeof fn === 'function') {
              state = fn ({
                estado: estado,
                opções: _opções,
                nome nome,
                instância: instância
              }) || Estado;
            }
          }
        },
        // Atualização assíncrona e otimizada de forma otimizada - não será executada se
        // não é necessário (depurado para ser executado no máximo uma vez por tique)
        update: debounce (function () {
          return new Promise (function (resolve) {
            instance.forceUpdate ();
            resolver (estado);
          });
        }),
        destruir: função destruir () {
          cleanupModifierEffects ();
          isDestroyed = true;
        }
      };

      if (! areValidElements (referência, popper)) {
        {
          console.error (INVALID_ELEMENT_ERROR);
        }

        instância de retorno;
      }

      instance.setOptions (options) .then (function (state) {
        if (! isDestroyed && options.onFirstUpdate) {
          options.onFirstUpdate (estado);
        }
      }); // Os modificadores têm a capacidade de executar código arbitrário antes do primeiro
      // o ciclo de atualização é executado. Eles serão executados na mesma ordem da atualização
      // ciclo. Isso é útil quando um modificador adiciona alguns dados persistentes que
      // outros modificadores precisam ser usados, mas o modificador é executado após o dependente
      // 1.

      function runModifierEffects () {
        state.orderedModifiers.forEach (function (_ref3) {
          var name = _ref3.name,
              _ref3 $ options = _ref3.options,
              options = _ref3 $ options === void 0? {}: _ref3 $ options,
              efeito = _ref3.effect;

          if (tipo de efeito === 'função') {
            var cleanupFn = effect ({
              estado: estado,
              nome nome,
              instância: instância,
              opções: opções
            });

            var noopFn = função noopFn () {};

            effectCleanupFns.push (cleanupFn || noopFn);
          }
        });
      }

      function cleanupModifierEffects () {
        effectCleanupFns.forEach (function (fn) {
          return fn ();
        });
        effectCleanupFns = [];
      }

      instância de retorno;
    };
  }

  var passive = {
    passivo: verdadeiro
  };

  efeito de função $ 2 (_ref) {
    var state = _ref.state,
        instância = _ref.instance,
        options = _ref.options;
    var _options $ scroll = options.scroll,
        scroll = _options $ scroll === void 0? verdadeiro: _options $ scroll,
        _options $ resize = options.resize,
        resize = _options $ resize === void 0? true: _options $ resize;
    var window = getWindow (state.elements.popper);
    var scrollParents = [] .concat (state.scrollParents.reference, state.scrollParents.popper);

    if (role) {
      scrollParents.forEach (function (scrollParent) {
        scrollParent.addEventListener ('scroll', instance.update, passive);
      });
    }

    if (redimensionar) {
      window.addEventListener ('resize', instance.update, passive);
    }

    return function () {
      if (role) {
        scrollParents.forEach (function (scrollParent) {
          scrollParent.removeEventListener ('scroll', instance.update, passive);
        });
      }

      if (redimensionar) {
        window.removeEventListener ('resize', instance.update, passive);
      }
    };
  } // eslint-disable-next-line import / no-unused-modules


  var eventListeners = {
    nome: 'eventListeners',
    habilitado: verdadeiro,
    fase: 'escrever',
    fn: função fn () {},
    efeito: efeito $ 2,
    dados: {}
  };

  function popperOffsets (_ref) {
    var state = _ref.state,
        nome = _ref.name;
    // Os deslocamentos são a posição real que o popper precisa estar
    // posicionado corretamente próximo ao seu elemento de referência
    // Este é o canal mais básico e será ajustado por
    // os modificadores na próxima etapa
    state.modifiersData [name] = computeOffsets ({
      referência: state.rects.reference,
      elemento: state.rects.popper,
      estratégia: 'absoluto',
      colocação: state.placement
    });
  } // eslint-disable-next-line import / no-unused-modules


  var popperOffsets $ 1 = {
    nome: 'popperOffsets',
    habilitado: verdadeiro,
    fase: 'ler',
    fn: popperOffsets,
    dados: {}
  };

  var unsetSides = {
    topo: 'auto',
    direita: 'auto',
    inferior: 'auto',
    esquerda: 'auto'
  }; // Arredonde os deslocamentos para o subpixel adequado mais próximo com base no DPR.
  // O zoom pode alterar o DPR, mas parece relatar um valor que
  // divida claramente os valores nos subpixels apropriados.

  function roundOffsetsByDPR (_ref) {
    var x = _ref.x,
        y = _ref.y;
    var win = janela;
    var dpr = win.devicePixelRatio || 1;
    Retorna {
      x: redondo (redondo (x * dpr) / dpr) || 0,
      y: round (round (y * dpr) / dpr) || 0
    };
  }

  function mapToStyles (_ref2) {
    var _Object $ assign2;

    var popper = _ref2.popper,
        popperRect = _ref2.popperRect,
        posicionamento = _ref2.posicionamento,
        variação = _ref2.variação,
        offsets = _ref2.offsets,
        posição = _ref2.posição,
        gpuAcceleration = _ref2.gpuAcceleration,
        adaptativo = _ref2.adaptivo,
        roundOffsets = _ref2.roundOffsets;

    var _ref3 = roundOffsets === verdadeiro? roundOffsetsByDPR (offsets): typeof roundOffsets === 'function'? roundOffsets (offsets): offsets,
        _ref3 $ x = _ref3.x,
        x = _ref3 $ x === vazio 0? 0: _ref3 $ x,
        _ref3 $ y = _ref3.y,
        y = _ref3 $ y === vazio 0? 0: _ref3 $ y;

    var hasX = offsets.hasOwnProperty ('x');
    var hasY = offsets.hasOwnProperty ('y');
    var sideX = left;
    var sideY = top;
    var win = janela;

    if (adaptativo) {
      var offsetParent = getOffsetParent (popper);
      var heightProp = 'clientHeight';
      var widthProp = 'clientWidth';

      if (offsetParent === getWindow (popper)) {
        offsetParent = getDocumentElement (popper);

        if (getComputedStyle (offsetParent) .position! == 'estático' && position === 'absoluto') {
          heightProp = 'scrollHeight';
          widthProp = 'scrollWidth';
        }
      } // $ FlowFixMe [incompatible-cast]: forçar o refinamento do tipo, comparamos offsetParent com a janela acima, mas o Flow não o detecta


      offsetParent = offsetParent;

      if (colocação === topo || (colocação === esquerda || colocação === direita) && variação === fim) {
        ladoY = inferior; // $ FlowFixMe [falta prop]

        y - = offsetParent [heightProp] - popperRect.height;
        y * = gpuAcceleration? 1: -1;
      }

      if (colocação === esquerda || (colocação === topo || colocação === parte inferior) && variação === fim) {
        ladoX = direito; // $ FlowFixMe [falta prop]

        x - = offsetParent [widthProp] - popperRect.width;
        x * = gpuAcceleration? 1: -1;
      }
    }

    var commonStyles = Object.assign ({
      posição: posição
    }, adaptativo && unsetSides);

    if (gpuAcceleration) {
      var _Object $ assign;

      return Object.assign ({}, commonStyles, (_Object $ assign = {}, _Object $ assign [sideY] = hasY? '0': '', _Object $ assign [sideX] = hasX? '0': '', _Object $ assign.transform = (win.devicePixelRatio || 1) <= 1? "Translate (" + x + "px," + y + "px)": "translate3d (" + x + "px," + y + "px, 0)", _Object $ assign));
    }

    return Object.assign ({}, commonStyles, (_Object $ assign2 = {}, _Object $ assign2 [sideY] = hasY? y + "px": '', _Object $ assign2 [sideX] = hasX? x + "px" : '', _Object $ assign2.transform = '', _Object $ assign2));
  }

  function computeStyles (_ref4) {
    var state = _ref4.state,
        options = _ref4.options;
    var _options $ gpuAccelerat = options.gpuAcceleration,
        gpuAcceleration = _options $ gpuAccelerat === void 0? verdadeiro: _options $ gpuAccelerat,
        _options $ adaptive = options.adaptive,
        adaptive = _options $ adaptive === void 0? verdadeiro: _options $ adaptive,
        _options $ roundOffsets = options.roundOffsets,
        roundOffsets = _options $ roundOffsets === void 0? true: _options $ roundOffsets;

    {
      var transactionProperty = getComputedStyle (state.elements.popper) .transitionProperty || '';

      if (adaptável && ['transformar', 'superior', 'direita', 'inferior', 'esquerda']. algum (função (propriedade) {
        retornar transiçãoProperty.indexOf (propriedade)> = 0;
      })) {
        console.warn (['Popper: Transições de CSS detectadas em pelo menos um dos seguintes', 'Propriedades de CSS: "transform", "top", "right", "bottom", "left".', '\ n \ n ',' Desative a opção `adaptive` do modificador" computeStyles "para permitir ',' para transições suaves ou remova essas propriedades do CSS ',' declaração de transição no elemento popper se apenas em transição ',' opacidade ou background-color, por exemplo. ',' \ n \ n ',' Recomendamos usar o elemento popper como um wrapper em torno de um elemento ',' interno que pode ter qualquer propriedade CSS transferida para animações. ']. join (' ') );
      }
    }

    var commonStyles = {
      colocação: getBasePlacement (state.placement),
      variação: getVariation (state.placement),
      popper: state.elements.popper,
      popperRect: state.rects.popper,
      gpuAcceleration: gpuAcceleration
    };

    if (state.modifiersData.popperOffsets! = null) {
      state.styles.popper = Object.assign ({}, state.styles.popper, mapToStyles (Object.assign ({}, commonStyles, {
        offsets: state.modifiersData.popperOffsets,
        posição: state.options.strategy,
        adaptativo: adaptativo,
        roundOffsets: roundOffsets
      })));
    }

    if (state.modifiersData.arrow! = null) {
      state.styles.arrow = Object.assign ({}, state.styles.arrow, mapToStyles (Object.assign ({}, commonStyles, {
        offsets: state.modifiersData.arrow,
        posição: 'absoluta',
        adaptativo: falso,
        roundOffsets: roundOffsets
      })));
    }

    state.attributes.popper = Object.assign ({}, state.attributes.popper, {
      'data-popper-placement': state.placement
    });
  } // eslint-disable-next-line import / no-unused-modules


  var computeStyles $ 1 = {
    nome: 'computeStyles',
    habilitado: verdadeiro,
    fase: 'beforeWrite',
    fn: computeStyles,
    dados: {}
  };

  // e os aplica aos elementos HTMLE, como popper e arrow

  function applyStyles (_ref) {
    var state = _ref.state;
    Object.keys (state.elements) .forEach (function (name) {
      var style = state.styles [nome] || {};
      var attribute = state.attributes [nome] || {};
      var element = state.elements [nome]; // a seta é opcional + elementos virtuais

      if (! isHTMLElement (element) ||! getNodeName (element)) {
        Retorna;
      } // O fluxo não oferece suporte para estender esta propriedade, mas é o máximo
      // maneira eficaz de aplicar estilos a um HTMLElement
      // $ FlowFixMe [não pode escrever]


      Object.assign (element.style, style);
      Object.keys (atributos) .forEach (function (name) {
        valor var = atributos [nome];

        if (value === false) {
          element.removeAttribute (nome);
        } outro {
          element.setAttribute (nome, valor === verdadeiro? '': valor);
        }
      });
    });
  }

  efeito da função $ 1 (_ref2) {
    var state = _ref2.state;
    var initialStyles = {
      popper: {
        posição: state.options.strategy,
        esquerda: '0',
        topo: '0',
        margem: '0'
      },
      seta: {
        posição: 'absoluta'
      },
      referência: {}
    };
    Object.assign (state.elements.popper.style, initialStyles.popper);
    state.styles = initialStyles;

    if (state.elements.arrow) {
      Object.assign (state.elements.arrow.style, initialStyles.arrow);
    }

    return function () {
      Object.keys (state.elements) .forEach (function (name) {
        var element = state.elements [nome];
        var attribute = state.attributes [nome] || {};
        var styleProperties = Object.keys (state.styles.hasOwnProperty (name)? state.styles [nome]: initialStyles [nome]); // Defina todos os valores para uma string vazia para removê-los

        var style = styleProperties.reduce (function (style, property) {
          estilo [propriedade] = '';
          estilo de retorno;
        }, {}); // a seta é opcional + elementos virtuais

        if (! isHTMLElement (element) ||! getNodeName (element)) {
          Retorna;
        }

        Object.assign (element.style, style);
        Object.keys (atributos) .forEach (function (attribute) {
          element.removeAttribute (atributo);
        });
      });
    };
  } // eslint-disable-next-line import / no-unused-modules


  var applyStyles $ 1 = {
    nome: 'applyStyles',
    habilitado: verdadeiro,
    fase: 'escrever',
    fn: applyStyles,
    efeito: efeito $ 1,
    requer: ['computeStyles']
  };

  function distanceAndSkiddingToXY (posicionamento, retos, deslocamento) {
    var basePlacement = getBasePlacement (colocação);
    var invertDistance = [left, top] .indexOf (basePlacement)> = 0? -1: 1;

    var _ref = typeof offset === 'função'? offset (Object.assign ({}, rects, {
      colocação: colocação
    })) : Deslocamento,
        derrapagem = _ref [0],
        distância = _ref [1];

    derrapando = derrapando || 0;
    distância = (distância || 0) * invertDistance;
    return [left, right] .indexOf (basePlacement)> = 0? {
      x: distância,
      y: derrapagem
    }: {
      x: derrapagem,
      y: distância
    };
  }

  deslocamento de função (_ref2) {
    var state = _ref2.state,
        options = _ref2.options,
        name = _ref2.name;
    var _options $ offset = options.offset,
        offset = _options $ offset === void 0? [0, 0]: _options $ offset;
    var data = placements.reduce (function (acc, placement) {
      acc [posicionamento] = distanceAndSkiddingToXY (posicionamento, state.rects, offset);
      return acc;
    }, {});
    var _data $ state $ placement = data [state.placement],
        x = _data $ state $ placement.x,
        y = _data $ state $ placement.y;

    if (state.modifiersData.popperOffsets! = null) {
      state.modifiersData.popperOffsets.x + = x;
      state.modifiersData.popperOffsets.y + = y;
    }

    state.modifiersData [nome] = dados;
  } // eslint-disable-next-line import / no-unused-modules


  deslocamento de var $ 1 = {
    nome: 'deslocamento',
    habilitado: verdadeiro,
    fase: 'principal',
    requer: ['popperOffsets'],
    fn: deslocamento
  };

  var hash $ 1 = {
    esquerda direita',
    direita esquerda',
    inferior: 'superior',
    topo: 'inferior'
  };
  function getOppositePlacement (placement) {
    return placement.replace (/ left | right | bottom | top / g, function (combinado) {
      return hash $ 1 [combinado];
    });
  }

  var hash = {
    inicio fim',
    fim: 'início'
  };
  function getOppositeVariationPlacement (placement) {
    return placement.replace (/ start | end / g, function (match) {
      return hash [combinado];
    });
  }

  function computeAutoPlacement (estado, opções) {
    if (options === void 0) {
      opções = {};
    }

    var _options = options,
        colocação = _options.placement,
        limite = _options.boundary,
        rootBoundary = _options.rootBoundary,
        padding = _options.padding,
        flipVariations = _options.flipVariations,
        _options $ allowedAutoP = _options.allowedAutoPlacements,
        allowedAutoPlacements = _options $ allowedAutoP === void 0? posicionamentos: _options $ allowedAutoP;
    variação de var = getVariation (colocação);
    var colocações $ 1 = variação? flipVariations? variaçãoPlacements: variaçãoPlacements.filter (function (placement) {
      return getVariation (placement) === variação;
    }): basePlacements;
    var allowedPlacements = placements $ 1.filter (function (placement) {
      retornar allowedAutoPlacements.indexOf (colocação)> = 0;
    });

    if (allowedPlacements.length === 0) {
      allowedPlacements = posicionamentos $ 1;

      {
        console.error (['Popper: A opção `allowedAutoPlacements` não permitia nenhum', 'posicionamento. Certifique-se de que a opção` placement` corresponda à variação', 'dos ​​posicionamentos permitidos.', 'Por exemplo, "auto" não pode ser usado para permitir "início por baixo". ',' Use "início automático". ']. join (' '));
      }
    } // $ FlowFixMe [incompatible-type]: Flow parece ter problemas com duas uniões de array ...


    var overflows = allowedPlacements.reduce (function (acc, placement) {
      acc [colocação] = detectOverflow (estado, {
        posicionamento: posicionamento,
        fronteira: fronteira,
        rootBoundary: rootBoundary,
        padding: padding
      }) [getBasePlacement (colocação)];
      return acc;
    }, {});
    return Object.keys (overflows) .sort (function (a, b) {
      overflows de retorno [a] - overflows [b];
    });
  }

  function getExpandedFallbackPlacements (placement) {
    if (getBasePlacement (placement) === auto) {
      Retorna [];
    }

    var opostoPlacement = getOppositePlacement (colocação);
    return [getOppositeVariationPlacement (colocação), opostoPlacement, getOppositeVariationPlacement (opostoPlacement)];
  }

  function flip (_ref) {
    var state = _ref.state,
        options = _ref.options,
        nome = _ref.name;

    if (state.modifiersData [name] ._ skip) {
      Retorna;
    }

    var _options $ mainAxis = options.mainAxis,
        checkMainAxis = _options $ mainAxis === void 0? verdadeiro: _options $ mainAxis,
        _options $ altAxis = options.altAxis,
        checkAltAxis = _options $ altAxis === void 0? verdadeiro: _options $ altAxis,
        especificadoFallbackPlacements = options.fallbackPlacements,
        padding = options.padding,
        limite = opções. limite,
        rootBoundary = options.rootBoundary,
        altBoundary = options.altBoundary,
        _options $ flipVariatio = options.flipVariations,
        flipVariations = _options $ flipVariatio === void 0? true: _options $ flipVariatio,
        allowedAutoPlacements = options.allowedAutoPlacements;
    var preferredPlacement = state.options.placement;
    var basePlacement = getBasePlacement (preferredPlacement);
    var isBasePlacement = basePlacement === preferredPlacement;
    var fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement ||! flipVariations? [getOppositePlacement (preferredPlacement)]: getExpandedFallbackPlacements (preferredPlacement));
    var placements = [preferredPlacement] .concat (fallbackPlacements) .reduce (function (acc, placement) {
      return acc.concat (getBasePlacement (placement) === auto? computeAutoPlacement (state, {
        posicionamento: posicionamento,
        fronteira: fronteira,
        rootBoundary: rootBoundary,
        padding: padding,
        flipVariations: flipVariations,
        allowedAutoPlacements: allowedAutoPlacements
      }): colocação);
    }, []);
    var referenceRect = state.rects.reference;
    var popperRect = state.rects.popper;
    var checksMap = new Map ();
    var makeFallbackChecks = true;
    var firstFittingPlacement = placements [0];

    para (var i = 0; i <placements.length; i ++) {
      var colocação = veiculações [i];

      var _basePlacement = getBasePlacement (colocação);

      var isStartVariation = getVariation (placement) === start;
      var isVertical = [superior, inferior] .indexOf (_basePlacement)> = 0;
      var len = isVertical? 'largura altura';
      var overflow = detectOverflow (state, {
        posicionamento: posicionamento,
        fronteira: fronteira,
        rootBoundary: rootBoundary,
        altBoundary: altBoundary,
        padding: padding
      });
      var mainVariationSide = isVertical? isStartVariation? direita: esquerda: isStartVariation? inferior: superior;

      if (referenceRect [len]> popperRect [len]) {
        mainVariationSide = getOppositePlacement (mainVariationSide);
      }

      var altVariationSide = getOppositePlacement (mainVariationSide);
      var checks = [];

      if (checkMainAxis) {
        checks.push (overflow [_basePlacement] <= 0);
      }

      if (checkAltAxis) {
        checks.push (overflow [mainVariationSide] <= 0, overflow [altVariationSide] <= 0);
      }

      if (checks.every (function (check) {
        cheque de retorno;
      })) {
        firstFittingPlacement = colocação;
        makeFallbackChecks = false;
        pausa;
      }

      checksMap.set (colocação, verificações);
    }

    if (makeFallbackChecks) {
      // `2` pode ser desejado em alguns casos - pesquise mais tarde
      var numberOfChecks = flipVariations? 3: 1;

      var _loop = function _loop (_i) {
        var fitPlacement = placements.find (function (placement) {
          var checks = checksMap.get (posicionamento);

          if (verifica) {
            return checks.slice (0, _i) .every (function (check) {
              cheque de retorno;
            });
          }
        });

        if (fitPlacement) {
          firstFittingPlacement = fitPlacement;
          return "break";
        }
      };

      para (var _i = numeroOfChecks; _i> 0; _i--) {
        var _ret = _loop (_i);

        if (_ret === "quebra") quebra;
      }
    }

    if (state.placement! == firstFittingPlacement) {
      state.modifiersData [nome] ._ skip = true;
      state.placement = firstFittingPlacement;
      state.reset = true;
    }
  } // eslint-disable-next-line import / no-unused-modules


  var flip $ 1 = {
    nome: 'flip',
    habilitado: verdadeiro,
    fase: 'principal',
    fn: flip,
    requerIfExists: ['deslocamento'],
    dados: {
      _skip: false
    }
  };

  function getAltAxis (axis) {
    eixo de retorno === 'x'? 'y': 'x';
  }

  função dentro (mínimo $ 1, valor, máximo $ 1) {
    return max (min $ 1, min (value, max $ 1));
  }

  function preventOverflow (_ref) {
    var state = _ref.state,
        options = _ref.options,
        nome = _ref.name;
    var _options $ mainAxis = options.mainAxis,
        checkMainAxis = _options $ mainAxis === void 0? verdadeiro: _options $ mainAxis,
        _options $ altAxis = options.altAxis,
        checkAltAxis = _options $ altAxis === void 0? falso: _options $ altAxis,
        limite = opções. limite,
        rootBoundary = options.rootBoundary,
        altBoundary = options.altBoundary,
        padding = options.padding,
        _options $ tether = options.tether,
        tether = _options $ tether === void 0? true: _options $ tether,
        _options $ tetherOffset = options.tetherOffset,
        tetherOffset = _options $ tetherOffset === void 0? 0: _options $ tetherOffset;
    var overflow = detectOverflow (state, {
      fronteira: fronteira,
      rootBoundary: rootBoundary,
      padding: padding,
      altBoundary: altBoundary
    });
    var basePlacement = getBasePlacement (state.placement);
    variação var = getVariation (state.placement);
    var isBasePlacement =! variação;
    var mainAxis = getMainAxisFromPlacement (basePlacement);
    var altAxis = getAltAxis (mainAxis);
    var popperOffsets = state.modifiersData.popperOffsets;
    var referenceRect = state.rects.reference;
    var popperRect = state.rects.popper;
    var tetherOffsetValue = typeof tetherOffset === 'função'? tetherOffset (Object.assign ({}, state.rects, {
      colocação: state.placement
    })): tetherOffset;
    var data = {
      x: 0,
      y: 0
    };

    if (! popperOffsets) {
      Retorna;
    }

    if (checkMainAxis || checkAltAxis) {
      var mainSide = mainAxis === 'y'? topo: esquerda;
      var altSide = mainAxis === 'y'? canto inferior direito;
      var len = mainAxis === 'y'? 'altura largura';
      var offset = popperOffsets [mainAxis];
      var min $ 1 = popperOffsets [mainAxis] + estouro [mainSide];
      var max $ 1 = popperOffsets [mainAxis] - estouro [altSide];
      var aditivo = amarração? -popperRect [len] / 2: 0;
      var minLen = variação === iniciar? referenceRect [len]: popperRect [len];
      var maxLen = variação === iniciar? -popperRect [len]: -referenceRect [len]; // Precisamos incluir a seta no cálculo para que a seta não vá
      // fora dos limites de referência

      var arrowElement = state.elements.arrow;
      var arrowRect = tether && arrowElement? getLayoutRect (arrowElement): {
        largura: 0,
        altura: 0
      };
      var arrowPaddingObject = state.modifiersData ['arrow # persistent']? state.modifiersData ['arrow # persistent']. padding: getFreshSideObject ();
      var arrowPaddingMin = arrowPaddingObject [mainSide];
      var arrowPaddingMax = arrowPaddingObject [altSide]; // Se o comprimento de referência for menor que o comprimento da seta, não queremos
      // para incluir seu tamanho total no cálculo. Se a referência for pequena
      // e perto da borda de um limite, o popper pode transbordar mesmo se o
      // a referência também não está transbordando (por exemplo, elementos virtuais sem
      // largura ou altura)

      var arrowLen = dentro de (0, referenceRect [len], arrowRect [len]);
      var minOffset = isBasePlacement? referenceRect [len] / 2 - aditivo - arrowLen - arrowPaddingMin - tetherOffsetValue: minLen - arrowLen - arrowPaddingMin - tetherOffsetValue;
      var maxOffset = isBasePlacement? -referenceRect [len] / 2 + aditivo + arrowLen + arrowPaddingMax + tetherOffsetValue: maxLen + arrowLen + arrowPaddingMax + tetherOffsetValue;
      var arrowOffsetParent = state.elements.arrow && getOffsetParent (state.elements.arrow);
      var clientOffset = arrowOffsetParent? mainAxis === 'y'? arrowOffsetParent.clientTop || 0: arrowOffsetParent.clientLeft || 0: 0;
      var offsetModifierValue = state.modifiersData.offset? state.modifiersData.offset [state.placement] [mainAxis]: 0;
      var tetherMin = popperOffsets [mainAxis] + minOffset - offsetModifierValue - clientOffset;
      var tetherMax = popperOffsets [mainAxis] + maxOffset - offsetModifierValue;

      if (checkMainAxis) {
        var preventedOffset = within (tether? min (min $ 1, tetherMin): min $ 1, deslocamento, tether? max (max $ 1, tetherMax): max $ 1);
        popperOffsets [mainAxis] = preventedOffset;
        dados [mainAxis] = preventedOffset - deslocamento;
      }

      if (checkAltAxis) {
        var _mainSide = mainAxis === 'x'? topo: esquerda;

        var _altSide = mainAxis === 'x'? canto inferior direito;

        var _offset = popperOffsets [altAxis];

        var _min = _offset + overflow [_mainSide];

        var _max = _offset - estouro [_altSide];

        var _preventedOffset = within (tether? min (_min, tetherMin): _min, _offset, tether? max (_max, tetherMax): _max);

        popperOffsets [altAxis] = _preventedOffset;
        dados [altAxis] = _preventedOffset - _offset;
      }
    }

    state.modifiersData [nome] = dados;
  } // eslint-disable-next-line import / no-unused-modules


  var preventOverflow $ 1 = {
    nome: 'preventOverflow',
    habilitado: verdadeiro,
    fase: 'principal',
    fn: preventOverflow,
    requerIfExists: ['deslocamento']
  };

  var toPaddingObject = function toPaddingObject (preenchimento, estado) {
    padding = typeof padding === 'função'? preenchimento (Object.assign ({}, state.rects, {
      colocação: state.placement
    })) : preenchimento;
    return mergePaddingObject (typeof padding! == 'number'? padding: expandToHashMap (padding, basePlacements));
  };

  seta de função (_ref) {
    var _state $ modifiersData $;

    var state = _ref.state,
        name = _ref.name,
        options = _ref.options;
    var arrowElement = state.elements.arrow;
    var popperOffsets = state.modifiersData.popperOffsets;
    var basePlacement = getBasePlacement (state.placement);
    eixo var = getMainAxisFromPlacement (basePlacement);
    var isVertical = [esquerda, direita] .indexOf (basePlacement)> = 0;
    var len = isVertical? 'altura largura';

    if (! arrowElement ||! popperOffsets) {
      Retorna;
    }

    var paddingObject = toPaddingObject (options.padding, state);
    var arrowRect = getLayoutRect (arrowElement);
    var minProp = axis === 'y'? topo: esquerda;
    var maxProp = axis === 'y'? canto inferior direito;
    var endDiff = state.rects.reference [len] + state.rects.reference [axis] - popperOffsets [axis] - state.rects.popper [len];
    var startDiff = popperOffsets [eixo] - state.rects.reference [axis];
    var arrowOffsetParent = getOffsetParent (arrowElement);
    var clientSize = arrowOffsetParent? eixo === 'y'? arrowOffsetParent.clientHeight || 0: arrowOffsetParent.clientWidth || 0: 0;
    var centerToReference = endDiff / 2 - startDiff / 2; // Certifique-se de que a seta não transborde o popper se o ponto central for
    // fora dos limites do popper

    var min = paddingObject [minProp];
    var max = clientSize - arrowRect [len] - paddingObject [maxProp];
    var center = clientSize / 2 - arrowRect [len] / 2 + centerToReference;
    deslocamento de var = dentro (min, centro, max); // Evita quebra de realce de sintaxe ...

    var axisProp = eixo;
    state.modifiersData [name] = (_state $ modifiersData $ = {}, _state $ modifiersData $ [axisProp] = offset, _state $ modifiersData $ .centerOffset = offset - center, _state $ modifiersData $);
  }

  efeito da função (_ref2) {
    var state = _ref2.state,
        options = _ref2.options;
    var _options $ element = options.element,
        arrowElement = _options $ element === void 0? '[data-popper-arrow]': _options $ element;

    if (arrowElement == null) {
      Retorna;
    } // seletor CSS


    if (typeof arrowElement === 'string') {
      arrowElement = state.elements.popper.querySelector (arrowElement);

      if (! arrowElement) {
        Retorna;
      }
    }

    {
      if (! isHTMLElement (arrowElement)) {
        console.error (['Popper: o elemento "arrow" deve ser um HTMLElement (não um SVGElement).', 'Para usar uma seta SVG, envolva-o em um HTMLElement que será usado como', 'a seta.']. Junte(' '));
      }
    }

    if (! contains (state.elements.popper, arrowElement)) {
      {
        console.error (['Popper: modificador "arrow" \' elemento` deve ser um filho do popper ',' elemento. ']. join (' '));
      }

      Retorna;
    }

    state.elements.arrow = arrowElement;
  } // eslint-disable-next-line import / no-unused-modules


  var seta $ 1 = {
    nome: 'seta',
    habilitado: verdadeiro,
    fase: 'principal',
    fn: seta,
    efeito: efeito,
    requer: ['popperOffsets'],
    requerIfExists: ['preventOverflow']
  };

  function getSideOffsets (overflow, rect, preventedOffsets) {
    if (preventedOffsets === void 0) {
      preventedOffsets = {
        x: 0,
        y: 0
      };
    }

    Retorna {
      top: overflow.top - rect.height - preventedOffsets.y,
      direita: overflow.right - rect.width + preventedOffsets.x,
      bottom: overflow.bottom - rect.height + preventedOffsets.y,
      esquerda: overflow.left - rect.width - preventedOffsets.x
    };
  }

  function isAnySideFullyClipped (overflow) {
    return [top, right, bottom, left] .alguns (função (lado) {
      retorno estouro [lado]> = 0;
    });
  }

  function hide (_ref) {
    var state = _ref.state,
        nome = _ref.name;
    var referenceRect = state.rects.reference;
    var popperRect = state.rects.popper;
    var preventedOffsets = state.modifiersData.preventOverflow;
    var referenceOverflow = detectOverflow (state, {
      elementContext: 'referência'
    });
    var popperAltOverflow = detectOverflow (state, {
      altBoundary: true
    });
    var referenceClippingOffsets = getSideOffsets (referenceOverflow, referenceRect);
    var popperEscapeOffsets = getSideOffsets (popperAltOverflow, popperRect, preventedOffsets);
    var isReferenceHidden = isAnySideFullyClipped (referenceClippingOffsets);
    var hasPopperEscaped = isAnySideFullyClipped (popperEscapeOffsets);
    state.modifiersData [nome] = {
      referenceClippingOffsets: referenceClippingOffsets,
      popperEscapeOffsets: popperEscapeOffsets,
      isReferenceHidden: isReferenceHidden,
      hasPopperEscaped: hasPopperEscaped
    };
    state.attributes.popper = Object.assign ({}, state.attributes.popper, {
      'data-popper-reference-hidden': isReferenceHidden,
      'data-popper-escaped': hasPopperEscaped
    });
  } // eslint-disable-next-line import / no-unused-modules


  var esconder $ 1 = {
    nome: 'ocultar',
    habilitado: verdadeiro,
    fase: 'principal',
    requerIfExists: ['preventOverflow'],
    fn: ocultar
  };

  var defaultModifiers $ 1 = [eventListeners, popperOffsets $ 1, computeStyles $ 1, applyStyles $ 1];
  var createPopper $ 1 = / * # __ PURE __ * / popperGenerator ({
    defaultModifiers: defaultModifiers $ 1
  }); // eslint-disable-next-line import / no-unused-modules

  var defaultModifiers = [eventListeners, popperOffsets $ 1, computeStyles $ 1, applyStyles $ 1, deslocamento $ 1, flip $ 1, preventOverflow $ 1, seta $ 1, ocultar $ 1];
  var createPopper = / * # __ PURE __ * / popperGenerator ({
    defaultModifiers: defaultModifiers
  }); // eslint-disable-next-line import / no-unused-modules

  exportações.applyStyles = applyStyles $ 1;
  exportações.arrow = seta $ 1;
  exportações.computeStyles = computeStyles $ 1;
  exportações.createPopper = createPopper;
  exportações.createPopperLite = createPopper $ 1;
  exportações.defaultModifiers = defaultModifiers;
  exportações.detectOverflow = detectOverflow;
  exportações.eventListeners = eventListeners;
  exportações.flip = flip $ 1;
  exportações.ocultar = ocultar $ 1;
  export.offset = deslocamento $ 1;
  exportações.popperGenerator = popperGenerator;
  exportações.popperOffsets = popperOffsets $ 1;
  exportações.preventOverflow = preventOverflow $ 1;

  Object.defineProperty (exportações, '__esModule', {valor: verdadeiro});

})));
// # sourceMappingURL = popper.js.map