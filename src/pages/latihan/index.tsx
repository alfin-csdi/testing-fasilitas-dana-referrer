const LatihanPage = () => {
  //NOMOR 1

  /*
Buatlah fungsi yang menerima array of numbers dan melakukan transformasi berikut:
- Kalikan setiap angka genap dengan 2
- Kalikan setiap angka ganjil dengan 3
- Filter hasil yang lebih besar dari 10
*/

  // Input: [1, 2, 3, 4, 5]
  // Output: [15, 12, 15]

  function transformNumbers(numbers: number[]) {
    return numbers
      .map((num) => (num % 2 === 0 ? num * 2 : num * 3))
      .filter((num) => num > 10);
  }

  //NOMOR 2

  /*
Diberikan array of objects yang merepresentasikan transaksi.
Buatlah fungsi untuk:
1. Menghitung total pembelian per user
2. Filter transaksi di atas 100
3. Tambahkan status 'high-value' jika transaksi di atas 1000
*/

  type transactionsType = {
    userId: number;
    amount: number;
    type: string;
  };

  // Tipe hasil analisis transaksi
  type AnalyzedTransaction = {
    userId: number;
    total: number;
    status: "high-value" | "normal"; // Status hanya boleh "high-value" atau "normal"
  };

  const transactions: transactionsType[] = [
    { userId: 1, amount: 500, type: "purchase" },
    { userId: 2, amount: 1200, type: "purchase" },
    { userId: 1, amount: 75, type: "purchase" },
  ];

  const analyzeTransactions = (
    transactions: transactionsType[]
  ): AnalyzedTransaction[] => {
    // Hitung total pembelian per userId
    const totalBeli: Record<number, number> = transactions.reduce(
      (acc, curr) => {
        acc[curr.userId] = (acc[curr.userId] || 0) + curr.amount;
        return acc;
      },
      {} as Record<number, number>
    ); // Beri tipe untuk mencegah error

    console.log(totalBeli);

    //transfor ke format baru
    return Object.entries(totalBeli).map(([userId, total]) => ({
      userId: parseInt(userId),
      total,
      status: total > 1000 ? "high-value" : "normal",
    }));
  };

  //NOMOR 3

  /*
Buatlah komponen React yang:
1. Menerima data products
2. Filter products yang active
3. Group by category
4. Render dalam format yang terorganisir
*/

  type ProductType = {
    id: number;
    name: string;
    category: string;
    price: number;
    active: boolean;
  };

  const products: ProductType[] = [
    {
      id: 1,
      name: "Laptop",
      category: "Electronics",
      price: 1000,
      active: true,
    },
    { id: 2, name: "Book", category: "Books", price: 20, active: true },
    {
      id: 3,
      name: "Phone",
      category: "Electronics",
      price: 500,
      active: false,
    },
    { id: 4, name: "Book2", category: "Books", price: 40, active: true },
  ];

  const organizedProduct = products
    .filter((product) => product.active) // Hanya produk yang aktif
    .reduce((acc: Record<string, ProductType[]>, product) => {
      // Pastikan kategori ada dalam acc, jika tidak buat array baru
      if (!acc[product.category]) {
        acc[product.category] = [];
      }

      acc[product.category].push(product);
      return acc;
    }, {} as Record<string, ProductType[]>);

  //LATIHAN 1
  /*
Diberikan array of objects yang berisi data siswa:
- Transform data untuk menambahkan status kelulusan (passed: true jika nilai >= 75)
- Filter hanya siswa yang lulus
- Urutkan berdasarkan nilai tertinggi
- Format ulang data sesuai output yang diinginkan
*/

  const students = [
    { id: 1, name: "Budi", score: 85 },
    { id: 2, name: "Ani", score: 70 },
    { id: 3, name: "Cindy", score: 92 },
    { id: 4, name: "David", score: 65 },
    { id: 5, name: "Eva", score: 88 },
  ];

  const studentGrade = (score: number): string => {
    if (score >= 90) return "A";
    if (score >= 80) return "B";
    if (score >= 75) return "C";
    return "D";
  };

  const organizeStudents = (students) => {
    const newData = students
      .map((student) => ({
        studentId: student.id,
        name: student.name.toUpperCase(),
        score: Number(student.score),
        grade: studentGrade(student.score),
      }))
      .filter((student) => student.score >= 75)
      .sort((a, b) => b.score - a.score);
    
      return newData
  };

  return (
    <div>
      <h3 className="mt-5">Nomor 1</h3>
      <p>{transformNumbers([1, 2, 3, 4, 5]).join(", ")}</p>
      <h3 className="mt-5">Nomor 2</h3>
      {analyzeTransactions(transactions).map((user) => (
        <p key={user.userId}>
          User {user.userId}: Total {user.total} - Status: {user.status}
        </p>
      ))}
      <h3 className="mt-5">Nomor 3</h3>
      <div>
        {Object.entries(organizedProduct).map(([category, items]) => (
          <div key={category}>
            <h2>{category}</h2>
            {items.map((item) => (
              <div key={item.id}>
                {item.name} - ${item.price}
              </div>
            ))}
          </div>
        ))}
      </div>
      <h3 className="mt-5">Latihan 1</h3>
      <div>
        {organizeStudents(students).map((student) => (
          <ul key={student.id}>
            <p>{student.name} - {student.score} - {student.grade}</p>
          </ul>
        ))}
      </div>
    </div>
  );
};

export default LatihanPage;
