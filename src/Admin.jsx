import { useEffect, useState } from "react";

export default function Admin() {

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    const res = await fetch("http://localhost:3001/encomendas");
    const data = await res.json();

    setOrders(data);
  };

  return (
    <div style={{ padding: 40 }}>

      <h1>🧾 Painel Admin</h1>

      {orders.map((order) => (

        <div
          key={order._id}
          style={{
            border: "1px solid #ccc",
            marginBottom: 20,
            padding: 20,
            borderRadius: 10
          }}
        >

          <h3>
            Encomenda #{order._id}
          </h3>

          <p>
            Total: {order.total} €
          </p>

          <p>
            Data:
            {" "}
            {new Date(order.createdAt).toLocaleString()}
          </p>

          <h4>Produtos:</h4>

          {order.items.map((item, index) => (
            <div key={index}>
              {item.name} - {item.price} €
            </div>
          ))}

        </div>

      ))}

    </div>
  );
}