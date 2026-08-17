# CodyLingo Streak Widget

Bu widget, kullanıcı adını URL sorgusu üzerinden alır ve GitHub public event verilerini kullanarak etkinlik streak'ini hesaplar. GitHub README içinde görüntülenebilmesi için Vercel üzerinde SVG endpoint sunulur.

## Kullanım

Aşağıdaki örnek URL'yi kullan:

```text
https://YOUR-APP.vercel.app/api/widget?username=octocat
```

- `username` → GitHub kullanıcı adı
- Streak, GitHub public activity üzerinden otomatik hesaplanır
- Bu URL doğrudan README içindeki görsel olarak kullanılabilir

## Vercel ile yayınlama

1. Repo'yu GitHub'a push et.
2. Vercel'e giriş yap.
3. `Add New Project` → repo seç.
4. Varsayılan ayarları kullan.
5. Deploy et.
6. Uygulamanın URL'sini al:
   `https://YOUR-APP.vercel.app`
7. Widget URL'si:
   `https://YOUR-APP.vercel.app/api/widget?username=octocat`

## Profil README ekleme

```md
[![Coding streak](https://YOUR-APP.vercel.app/api/widget?username=octocat)](https://YOUR-APP.vercel.app/api/widget?username=octocat)
```

Bu yöntem, GitHub README gibi statik ortamda JavaScript çalışmadığı için gerekli olan dinamik SVG üretimini Vercel üzerinde yapar. Böylece README içinde canlı görsel görünür.

## Yerel test

```bash
npm install
npm run dev
```

Daha sonra tarayıcıda şu adresi aç:

```text
http://localhost:3000/api/widget?username=octocat
```
