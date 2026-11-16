# RD Station Phone Mask & Formatter

Este é um script em JavaScript puro (Vanilla JS) desenvolvido para aplicar uma máscara de telefone brasileiro amigável em formulários, enquanto formata o valor real para o padrão E.164 (`+55...`), garantindo compatibilidade total com o ConversionMapper do **RD Station**.

## 📌 O Problema
Muitas vezes, ao aplicar máscaras de telefone diretamente no campo original de um formulário, o RD Station captura o valor com os caracteres especiais (parênteses, espaços, traços). Além disso, integrações via API ou WhatsApp geralmente exigem o código do país (`+55`). 

## 💡 A Solução
Este script resolve esse problema dividindo o campo de telefone em dois:
1. **Um campo Visual:** Criado dinamicamente para o usuário interagir. Ele recebe a máscara amigável `(XX) XXXXX-XXXX`.
2. **O campo Original (Oculto):** O campo real do formulário é escondido visualmente, mas mantido no DOM. Ele recebe os números limpos com o prefixo `+55` em tempo real e dispara os eventos necessários para que o RD Station leia a conversão perfeitamente.

## ✨ Funcionalidades

* **Máscara Dinâmica Brasileira:** Formata o número automaticamente para `(XX) XXXX-XXXX` ou `(XX) XXXXX-XXXX` enquanto o usuário digita.
* **Formatação E.164 Automática:** Converte o número para o padrão internacional (ex: `+5511999999999`) no campo original.
* **Preservação de Atributos:** Transfere automaticamente o atributo `required` e o `id` do campo original para o campo visual, garantindo que a validação do navegador e as tags `<label>` continuem funcionando.
* **Sincronização em Tempo Real:** Dispara eventos de `input` e `change` no campo oculto para garantir que rastreadores de conversão (como RD Station) detectem a mudança de imediato.
* **Suporte a Formulários Dinâmicos:** Possui um temporizador integrado (`setInterval`) que verifica a existência de novos formulários por 15 segundos após o carregamento, garantindo que funcione em pop-ups ou formulários carregados assincronamente.

## 🚀 Como Usar

Não é necessária nenhuma biblioteca externa (como jQuery). Basta inserir o código na sua página.

### Opção 1: Via Google Tag Manager (GTM)
Crie uma nova tag do tipo **HTML Personalizado**, cole o código dentro de tags `<script>` e acione em "All Pages" (ou nas páginas específicas onde estão os formulários).

```html
<script>
// Cole o código do script aqui
</script>
```

### Opção 2: Inserção Direta no HTML
Adicione o script logo antes do fechamento da tag `</body>` no seu site ou Landing Page.

## ⚙️ Como Funciona o Código (Under the Hood)

1. **Busca os campos:** O script procura todos os `input[name="phone"]` que não sejam do tipo hidden e que ainda não tenham sido processados.
2. **Clonagem e Substituição:** Ele cria o `phone_visual`, copia as classes e placeholder do original, e esconde o original usando CSS (opacity 0, z-index -1) para que ele continue sendo um campo válido para o RD Station ler.
3. **Event Listeners:** Sempre que o usuário digita, perde o foco ou envia o formulário, a função `syncPhone` é acionada, formatando a máscara visual e injetando o valor real (com `+55`) no campo escondido.

## ⚠️ Requisitos / Observações
* O campo original de telefone do seu formulário deve possuir o atributo `name="phone"`. Se o seu formulário utiliza um nome diferente (ex: `name="telefone"` ou `name="celular"`), você precisará alterar o seletor `input[name="phone"]` na terceira linha do script.
