import { useEffect, useState } from "react";
import { db, auth } from "./firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const user = auth.currentUser;

  useEffect(() => {
    async function loadOrders() {
      if (!user) return;

      const q = query(
        collection(db, "orders"),
        where("userId", "==", user.uid)
      );

      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setOrders(data);
    }

    loadOrders();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>📦 As Minhas Encomendas</h2>

      {orders.length === 0 && <p>Ainda não tens encomendas.</p>}

      {orders.map((order) => (
        <div
          key={order.id}
          style={{
            background: "white",
            padding: 15,
            marginBottom: 10,
            borderRadius: 8,
          }}
        >
          <p><b>Status:</b> {order.status}</p>
          <p><b>Total:</b> {order.total} €</p>

          <p><b>Data:</b> {order.createdAt?.toDate?.().toLocaleString?.()}</p>

          <h4>Produtos:</h4>

          {order.items.map((item, i) => (
            <div key={i} style={{ marginLeft: 10 }}>
              • {item.name} ({item.size}) x{item.qty}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}