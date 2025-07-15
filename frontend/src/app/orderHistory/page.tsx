"use client";

export default function OrderHistory() {
  const orders = [
    {
      id: 'ORD001',
      date: '2024-07-10',
      total: '23,000원',
      items: ['Columbia Nariñó (2개)', 'Brazil Serra Do Caparaó (1개)'],
    },
    {
      id: 'ORD002',
      date: '2024-07-05',
      total: '15,000원',
      items: ['Ethiopia Yirgacheffe (1개)', 'Columbia Nariñó (1개)'],
    },
    {
      id: 'ORD003',
      date: '2024-06-28',
      total: '10,000원',
      items: ['Brazil Serra Do Caparaó (2개)'],
    },
  ];

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-24">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">주문 내역</h2>

        {orders.length === 0 ? (
          <p className="text-center text-gray-600">주문 내역이 없습니다.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="border border-gray-200 rounded-md p-4 shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold text-gray-700">주문 번호: {order.id}</h3>
                  <span className="text-sm text-gray-500">{order.date}</span>
                </div>
                <div className="mb-2">
                  <p className="text-gray-700">총 금액: <span className="font-bold">{order.total}</span></p>
                </div>
                <ul className="list-disc list-inside text-gray-600">
                  {order.items.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
