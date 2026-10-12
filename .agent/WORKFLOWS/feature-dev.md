# WORKFLOW: Feature Development (feature-dev.md)

SOP untuk menambah fitur baru pada project ini. Agent WAJIB mengikuti urutan ini.

## Trigger
Ada kebutuhan fitur baru di `TASK.md` atau PRD.

## Steps

1. **Baca Konteks**
   - `RULES.md` (hard constraints) — selalu dimuat.
   - `ARCHITECTURE.md` section yang relevan (direktori, data model, error handling).
   - `KNOWLEDGE.md` (gotchas, terminology).
   - `TASK.md` task aktif.

2. **Identifikasi Dampak**
   - Cari semua file yang akan terpengaruh (gunakan ripgrep):
   ```bash
   rg "symbol|path|import" src/
   ```
   - Catat di `TASK.md` bagian `Primary Affected Files`.

3. **TDD: RED**
   - Tulis unit test untuk acceptance criteria task.
   - Jalankan: `npx vitest run <test-file>` → pastikan GAGAL (bukan karena import error).

4. **TDD: GREEN**
   - Implementasi minimal sampai test lulus.
   - Ikuti pola error handling `Result<T, E>` dari `RULES.md` section 2.3.
   - Ikuti struktur tipe dari `ARCHITECTURE.md` section 5.1 (SlideModel dll).

5. **TDD: REFACTOR**
   - Bersihkan: hapus dead code, pastikan anti-slop compliance.
   - Perbarui `KNOWLEDGE.md` jika ada gotcha baru.

6. **Verification Gates**
   ```bash
   npm run lint
   npm run typecheck
   npm test
   ```
   Semua exit code = 0.

7. **Containment Audit**
   - `git status` → hanya Primary Affected Files berubah.
   - `git diff` → review perubahan; zero secret, zero sprawl.

8. **Mark DONE**
   - Update status task di `TASK.md` → `DONE`.
   - Update Summary Progress.
   - Commit: `[TASK-XXX] feat: deskripsi singkat`.

## Stop & Escalate
Berdasarkan `RULES.md` dan aturan stop TASK.md: kontradiksi PRD/TSD, verifikasi gagal 3x, perlu package baru, mutasi di luar scope, perubahan kontrak breaking. Hentikan dan minta konfirmasi manusia.