const latihanPage2 = () => {
  //LATIHAN
  /*
Diberikan array of objects yang berisi data siswa:
- Transform data untuk menambahkan status kelulusan (passed: true jika nilai >= 75)
- Filter hanya siswa yang lulus
- Urutkan berdasarkan nilai tertinggi
- Format ulang data sesuai output yang diinginkan dan per kelas
- Tampilkan di ui
*/

  type studentType = {
    id: number;
    name: string;
    class: string;
    score: number;
  };

  type studentWithGradeType = studentType & { grade: string};

  const students: studentType[] = [
    { id: 1, name: "Budi", class: "A", score: 85 },
    { id: 2, name: "Ani", class: "C", score: 70 },
    { id: 3, name: "Cindy", class: "B", score: 92 },
    { id: 4, name: "David", class: "A", score: 65 },
    { id: 5, name: "Eva", class: "B", score: 88 },
    { id: 6, name: "Evale", class: "C", score: 88 },
  ];

  const getGrade = (score: number) => {
    if (score >= 90) return "Excellent";
    if (score >= 80) return "Great";
    if (score >= 70) return "Good";
    return "Enough";
  };

  const organizeStudent = (students: studentType[]) => {
    const studentMap = students
      .map((student) => ({
        ...student,
        name: student.name.toUpperCase(),
        grade: getGrade(student.score),
      }))
      .filter((student) => student.grade != "Enough")
      .sort((a, b) => b.score - a.score);

    const groupByClass = studentMap.reduce(
      (
        acc: Record<string, { students: studentWithGradeType[]; averageScore: number }>,
        student
      ) => {
        if (!acc[student.class]) {
          acc[student.class] = { students: [], averageScore: 0 };
        }

        acc[student.class].students.push(student);

        const totalScore = acc[student.class].students.reduce(
          (sum, s) => sum + s.score,
          0
        );
        acc[student.class].averageScore =
          totalScore / acc[student.class].students.length;

        return acc;
      },
      {}
    );
    return groupByClass;
  };

  console.log(organizeStudent(students));

  return (
    <div>
      <h1>Daftar Siswa yang Lulus</h1>
      {Object.entries(organizeStudent(students)).map(([className, data]) => (
        <div
          key={className}
          style={{
            border: "1px solid black",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <h2>Kelas {className}</h2>
          <p>Rata-rata Nilai: {data.averageScore.toFixed(2)}</p>
          <ul>
            {data.students.map((student) => (
              <li key={student.id}>
                {student.name} - Nilai: {student.score} ({student.grade})
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default latihanPage2;
