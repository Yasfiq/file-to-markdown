# WORKFLOW: Bug Fix (bug-fix.md)

SOP untuk memperbaiki bug pada project ini. Agent WAJIB mengikuti urutan ini.

## Trigger
Bug dilaporkan (user report, test failure, anomaly di hasil konversi).

## Steps

1. **Reproduce & Isolate** (jangan langsung fix)
   - Tulis reproduksi minimal (fixture input + expected output) di test.
   - Jalankan test → pastikan gagal dengan cara yang konsisten.
   - Identifikasi layer yang bermasalah: validator / parser / renderer / UI.

2. **Root Cause**
   - Gunakan debugging sistematis; cek asumsi dulu.
   - Cek `KNOWLEDGE.md` apakah gotcha yang sudah diketahui.
   - Jangan patch gejala; cari sebab.

3. **TDD: RED → GREEN → REFACTOR**
   - Sama dengan feature-dev: test dulu, fix minimal, lakukan refactor.
   - Pastikan bug test tetap di test suite sebagai regression guard.

4. **Regression Check**
   - Jalankan seluruh test suite: `npm test`.
   - Pastikan tidak ada test lain yang patah.

5. **Verification & Containment**
   ```bash
   npm run lint && npm run typecheck && npm test
   git status && git diff
   ```
   Mutasi terisolasi pada file yang relevan saja.

6. **Update KNOWLEDGE.md**
   - Catat root cause di Append-Only Log agar tidak terulang.

7. **Mark DONE**
   - Update `TASK.md`, commit: `[TASK-XXX] fix: deskripsi singkat`.

## Stop & Escalate
Sama seperti feature-dev. Tambahan: jika root cause ternyata kontradiksi desain (bukan bug implementasi), berhenti dan lapor ke manusia untuk keputusan.