# Lista de depois (ideias fora do escopo do MVP)

- **Preço de prateleira:** arredondar o preço sugerido para valores como R$ 5,49 ou R$ 5,90 (citado no ADR-003).
- **Margem por categoria:** definir a margem desejada uma vez para um grupo de produtos (decisão por produto no ADR-007).
- **Backup dos dados:** exportar ou copiar os dados para outro aparelho; hoje ficam só no celular (ADR-002).
- **Versão web:** abrir o app no navegador do computador. Foi usado só para conferir as telas durante o desenvolvimento, sem ficar no projeto.
- **Desfazer última compra:** apagar a compra mais recente do histórico e voltar ao custo anterior, para corrigir um custo digitado errado (hoje o custo só muda por "Nova compra" e a compra errada fica no histórico). Proposta P11 da auditoria de 14/10/2026; o aviso "Confira o valor" (RN-09) reduz o problema, mas não corrige depois de gravado.
- **Aviso "Você quis dizer R$ 4,40?":** quando o custo digitado passa dos limites do "Confira o valor" (RN-09) e dividido por 100 ficaria dentro deles, oferecer o valor corrigido com um toque. Hoje só avisa.
- **Máscara de moeda ao digitar:** mostrar "R$ 4,00" enquanto se digita (como app de banco). Hoje o campo aceita o texto livre e completa as duas casas ao sair (RN-08).
- **Tela de tablet e paisagem:** layout em duas colunas (lista e detalhe) em telas largas e modo paisagem. Hoje o conteúdo fica centralizado em até 600 dp e o app só gira em retrato (RNF-11).
- **Editar ou desfazer uma compra do histórico:** continua na lista acima ("Desfazer última compra"). Com a decisão da RN-10, uma compra repetida por engano também só sai por esse recurso futuro.
- **Instalação no iPhone:** o APK é só Android. Para iPhone seria preciso conta de desenvolvedor da Apple e outro perfil de build.
- **Build do APK:** o projeto está configurado (RNF-12), mas o build no EAS fica para a equipe rodar quando decidir (README).
