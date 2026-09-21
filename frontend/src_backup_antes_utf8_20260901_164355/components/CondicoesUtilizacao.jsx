import { Link } from "react-router-dom";

export default function CondicoesUtilizacao() {
  return (
    <div className="legal-page">
      <section className="legal-page-content">
        <h1>Condições de utilização</h1>

        <p>
          As presentes condições regulam a utilização do website JomaBasto
          e a aquisição de produtos através da loja online.
        </p>

        <h2>1. Identificação</h2>
        <p>
          JomaBasto — Sónia Fernandes<br />
          NIF: 212042815<br />
          Avenida da Igreja — Loja 4<br />
          4880-231 Mondim de Basto<br />
          Portugal
        </p>

        <p>
          Telefone: 924 176 159
        </p>

        <h2>2. Utilização do website</h2>
        <p>
          O utilizador compromete-se a utilizar o website de forma lícita,
          responsável e de acordo com a legislação aplicável.
        </p>

        <h2>3. Produtos e preços</h2>
        <p>
          A JomaBasto procura manter atualizadas as informações relativas aos
          produtos, preços, disponibilidade e características apresentadas no
          website. Podem ocorrer alterações sem aviso prévio.
        </p>

        <h2>4. Encomendas</h2>
        <p>
          A encomenda apenas será considerada aceite após a respetiva
          confirmação e processamento. A disponibilidade dos produtos está
          sujeita ao stock existente.
        </p>

        <h2>5. Pagamentos</h2>
        <p>
          Os pagamentos realizados através da loja são processados através
          dos meios de pagamento disponibilizados no processo de checkout.
        </p>

        <h2>6. Entregas</h2>
        <p>
          A JomaBasto efetua vendas para Portugal e para o estrangeiro.
          As condições, custos e prazos de entrega poderão variar consoante
          o destino da encomenda.
        </p>

        <h2>7. Trocas e devoluções</h2>
        <p>
          As trocas e devoluções são tratadas de acordo com a legislação
          aplicável aos contratos celebrados à distância e com as condições
          apresentadas ao cliente no momento da compra.
        </p>

        <h2>8. Propriedade intelectual</h2>
        <p>
          Os conteúdos, textos, imagens, elementos gráficos e restantes
          materiais disponibilizados no website não podem ser utilizados,
          reproduzidos ou distribuídos sem autorização quando tal seja
          legalmente exigível.
        </p>

        <h2>9. Alterações</h2>
        <p>
          A JomaBasto poderá atualizar estas condições sempre que necessário,
          sendo publicada no website a versão em vigor.
        </p>

        <div className="legal-page-back">
          <Link to="/">Voltar à loja</Link>
        </div>
      </section>
    </div>
  );
}
