export function LimitationsSection() {
  return (
    <section className="w-full rounded-lg border border-gray-300 bg-gray-50 p-6 text-sm" aria-labelledby="limitations-heading">
      <h2 id="limitations-heading" className="mb-3 text-base font-semibold text-gray-900">
        Keterbatasan Konversi
      </h2>
      
      <div className="space-y-4 text-gray-800">
        <div>
          <h3 className="font-medium text-gray-900">Privasi & Keamanan</h3>
          <p className="mt-1">
            File PPTX diproses sepenuhnya di browser Anda. Tidak ada data yang dikirim ke server atau pihak ketiga.
            Semua konversi berjalan secara lokal pada perangkat Anda.
          </p>
        </div>

        <div>
          <h3 className="font-medium text-gray-900">Elemen yang Tidak Didukung</h3>
          <ul className="mt-1 list-disc space-y-1 pl-5">
            <li>Gambar, grafik, diagram SmartArt, dan video tidak dapat diekstrak ke teks Markdown.</li>
            <li>Animasi, transisi, dan efek visual akan diabaikan.</li>
            <li>Objek embedded (file Excel, PDF tertanam) tidak dikonversi.</li>
            <li>Format teks lanjutan (bold, italic, strikethrough, highlight) tidak dipertahankan.</li>
          </ul>
          <p className="mt-2">
            Peringatan akan ditampilkan untuk setiap elemen yang tidak dapat dikonversi, dengan informasi nomor slide tempat elemen tersebut berada.
          </p>
        </div>

        <div>
          <h3 className="font-medium text-gray-900">Format Output</h3>
          <p className="mt-1">
            Output adalah Markdown murni (GFM). Tabel dikonversi ke format tabel Markdown. Angka, satuan, dan teks khusus dipertahankan persis seperti aslinya tanpa transformasi.
          </p>
        </div>
      </div>
    </section>
  );
}
