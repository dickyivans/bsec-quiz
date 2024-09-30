import React, { useState } from "react";
import { quizData } from "../data";
import Swal from "sweetalert2"; // Import SweetAlert
import "./quiz.css";

const Quiz: React.FC = () => {
  const [quizHistory, setQuizHistory] = useState<
    { question: string; answer: string; type: string }[]
  >([]); // Menyimpan soal kuis yang sebenarnya
  const [currentIndex, setCurrentIndex] = useState(0); // Menyimpan indeks soal yang sedang ditampilkan
  const [isQuizStarted, setIsQuizStarted] = useState(false); // Melacak apakah kuis sudah dimulai
  const [showAnswer, setShowAnswer] = useState(false); // Melacak apakah jawaban ditampilkan
  const [isImageVisible, setIsImageVisible] = useState(true); // Mengontrol visibilitas gambar
  const [isSPVSelected, setIsSPVSelected] = useState(false); // Flag untuk menandakan pilihan SPV

  const handleStartQuiz = () => {
    setIsImageVisible(false); // Menyembunyikan gambar dengan animasi
    const randomQuiz = quizData[Math.floor(Math.random() * quizData.length)];
    setQuizHistory([randomQuiz]);
    setCurrentIndex(0); // Reset ke soal pertama
    setIsQuizStarted(true); // Kuis dimulai
    setShowAnswer(false); // Jawaban disembunyikan saat kuis dimulai
    setIsSPVSelected(false); // Reset flag SPV
  };

  const handleStartSPVQuiz = () => {
    setIsImageVisible(false); // Menyembunyikan gambar dengan animasi
    // Filter soal berdasarkan tipe SPV
    const spvQuizzes = quizData.filter((quiz) => quiz.type === "SPV");
    if (spvQuizzes.length > 0) {
      // Simpan semua soal SPV ke dalam quizHistory
      setQuizHistory(spvQuizzes);
      setCurrentIndex(0); // Reset ke soal pertama
      setIsQuizStarted(true); // Kuis dimulai
      setShowAnswer(false); // Jawaban disembunyikan saat kuis dimulai
      setIsSPVSelected(true); // Set flag SPV ke true
    } else {
      alert("Tidak ada soal SPV tersedia!");
    }
  };

  const handleShowNextQuiz = () => {
    if (currentIndex < quizHistory.length - 1) {
      // Jika ada soal berikutnya, maju ke soal tersebut
      setCurrentIndex(currentIndex + 1);
    } else {
      // Cek flag pilihan SPV
      if (!isSPVSelected) {
        // Jika flag tidak aktif, ambil soal acak baru
        const randomQuiz =
          quizData[Math.floor(Math.random() * quizData.length)];
        setQuizHistory([...quizHistory, randomQuiz]);
        setCurrentIndex(currentIndex + 1); // Maju ke soal baru
      } else {
        // Tampilkan alert dengan SweetAlert dan refresh halaman
        Swal.fire({
          title: "Anda telah menyelesaikan semua soal!",
          text: "Klik OK untuk kembali ke menu awal.",
          icon: "success",
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.reload(); // Refresh halaman
          }
        });
      }
    }
    setShowAnswer(false); // Reset tampilan jawaban
  };

  const handleShowPreviousQuiz = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
    setShowAnswer(false); // Jawaban disembunyikan saat mundur ke soal sebelumnya
  };

  const handleShowAnswer = () => {
    setShowAnswer(true); // Tampilkan jawaban
  };

  return (
    <div className="container mt-5">
      {/* Tampilkan gambar hanya jika isImageVisible bernilai true */}
      {isImageVisible && (
        <img src="src/assets/study.png" alt="logo" className="img-fluid" />
      )}

      {/* Container untuk soal dan jawaban */}
      <div className="container">
        {!isQuizStarted ? (
          // Tampilkan pesan sambutan sebelum kuis dimulai
          <div className="mt-4 text-center">
            <h3>Hi, Selamat datang di web latihan persiapan BSEC</h3>
            <p>Semangat yaa !!!</p>
            <button
              className="btn mt-3 secondary-btn"
              onClick={handleStartQuiz}
            >
              Mulai Kuis
            </button>

            <button
              className="btn mt-3 ms-2 btn-outline-light"
              onClick={handleStartSPVQuiz}
            >
              Mulai sebagai SPV
            </button>
          </div>
        ) : (
          // Tampilkan soal kuis setelah dimulai
          <div className="mt-4 text-center">
            <h3>{quizHistory[currentIndex].question}</h3>
            {/* Tampilkan tombol untuk melihat jawaban */}
            {!showAnswer ? (
              <button
                className="btn btn-success mt-3"
                onClick={handleShowAnswer}
              >
                Tampilkan Jawaban
              </button>
            ) : (
              <p className="mt-3">{quizHistory[currentIndex].answer}</p>
            )}
          </div>
        )}
      </div>

      {/* Container terpisah untuk tombol navigasi */}
      {isQuizStarted && (
        <div className="navigation-buttons d-flex align-items-center justify-content-between">
          {/* Tombol "Soal Sebelumnya" hanya ditampilkan setelah kuis dimulai dan ada soal sebelumnya */}
          <button
            className={`btn secondary-btn me-2 ${
              currentIndex === 0 ? "disabled" : ""
            }`}
            onClick={currentIndex > 0 ? handleShowPreviousQuiz : undefined} // Tidak jalankan fungsi jika tidak aktif
            disabled={currentIndex === 0} // Menonaktifkan tombol jika sudah di soal pertama
          >
            Sebelumnya
          </button>
          <button className="btn btn-primary" onClick={handleShowNextQuiz}>
            Selanjutnya
          </button>
        </div>
      )}
    </div>
  );
};

export default Quiz;
