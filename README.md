# CodyLingo Streak Widget

Bu widget, kullanıcı adını URL parametresi üzerinden alır ve GitHub public event verilerini kullanarak etkinlik streak'ini hesaplar. El ile streak yazmak gerekmez.

## Kullanım

Aşağıdaki URL formatını kullan:

```text
https://YOUR-USERNAME.github.io/CodyLingo/?username=octocat
```

- `username` → GitHub kullanıcı adı
- Streak, GitHub public activity üzerinden otomatik hesaplanır

## GitHub Pages yayınlama

1. Repo'yu GitHub'a push et.
2. `Settings` → `Pages` sekmesine gir.
3. `Deploy from a branch` seç.
4. Branch: `main` veya `master`
5. Folder: `/ (root)`
6. Kaydet.
7. URL örneği:
   `https://YOUR-USERNAME.github.io/CodyLingo/?username=octocat`

## Profil README ekleme

```md
[![Coding streak](https://YOUR-USERNAME.github.io/CodyLingo/?username=octocat)](https://YOUR-USERNAME.github.io/CodyLingo/?username=octocat)
```

Bu widgetin Duolingo benzeri görünümü ve `public/duo.png` maskotu GitHub Pages'te otomatik olarak yüklenir.
