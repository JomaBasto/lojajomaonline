import { Link } from "react-router-dom";

export default function PoliticaPrivacidade() {
  return (
    <div className="legal-page">
      <section className="legal-page-content">
        <h1>Política de Privacidade</h1>

        <p>
          A JomaBasto respeita a privacidade dos seus clientes e utilizadores
          e procura tratar os dados pessoais de forma lícita, transparente e
          segura, de acordo com a legislação aplicável, incluindo o
          Regulamento Geral sobre a Proteção de Dados (RGPD).
        </p>

        <h2>1. Responsável pelo tratamento</h2>

        <p>
          <strong>JomaBasto — Sónia Fernandes</strong><br />
          NIF: 212042815<br />
          Avenida da Igreja — Loja 4<br />
          4880-231 Mondim de Basto<br />
          Portugal
        </p>

        <p>
          Telefone: 924 176 159
        </p>

        <h2>2. Dados pessoais tratados</h2>

        <p>
          Dependendo da utilização do website, poderão ser tratados dados
          fornecidos pelo utilizador, nomeadamente nome, endereço de email,
          telefone, morada, código postal e NIF quando este seja fornecido
          pelo cliente.
        </p>

        <h2>3. Finalidades</h2>

        <p>
          Os dados poderão ser tratados para criar e gerir contas de cliente,
          processar encomendas, realizar entregas, processar pagamentos,
          prestar apoio ao cliente e cumprir obrigações legais.
        </p>

        <h2>4. Fundamento do tratamento</h2>

        <p>
          O tratamento dos dados será realizado de acordo com o fundamento
          jurídico aplicável a cada finalidade, incluindo, quando necessário,
          a execução de uma relação contratual ou o cumprimento de obrigações
          legais.
        </p>

        <h2>5. Conservação dos dados</h2>

        <p>
          Os dados pessoais serão conservados durante o período necessário
          para cumprir as finalidades para as quais foram recolhidos e os
          períodos de conservação impostos pela legislação aplicável.
        </p>

        <h2>6. Segurança</h2>

        <p>
          São adotadas medidas técnicas e organizativas adequadas para
          proteger os dados pessoais contra acesso, alteração, divulgação,
          perda ou destruição não autorizados.
        </p>

        <h2>7. Direitos dos titulares</h2>

        <p>
          Nos termos da legislação aplicável, o titular dos dados poderá
          exercer os seus direitos de acesso, retificação, apagamento,
          limitação, oposição e portabilidade, quando aplicáveis.
        </p>

        <p>
          Os pedidos poderão ser apresentados à JomaBasto através dos
          contactos disponibilizados nesta página.
        </p>

        <h2>8. Reclamação</h2>

        <p>
          O titular dos dados tem também o direito de apresentar uma
          reclamação junto da autoridade de controlo competente, nomeadamente
          a Comissão Nacional de Proteção de Dados (CNPD).
        </p>

        <h2>9. Atualizações</h2>

        <p>
          Esta política poderá ser atualizada sempre que necessário. A versão
          publicada nesta página corresponde à versão atualmente disponibilizada
          pela JomaBasto.
        </p>

        <div className="legal-page-back">
          <Link to="/">Voltar à loja</Link>
        </div>
      </section>
    </div>
  );
}
