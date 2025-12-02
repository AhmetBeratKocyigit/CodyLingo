import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

// Kenar (Edge) runtime kullanarak çok hızlı yanıt veriyoruz
export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const { searchParams } = url;
    
    // URL'den parametreleri alıyoruz
    // Örnek: /api/widget?username=emre&streak=99
    const username = searchParams.get('username') || 'Developer';
    const streakParam = searchParams.get('streak');

    // Eğer URL'de streak yoksa rastgele bir sayı atayalım (Demo amaçlı)
    const streak = streakParam ? streakParam : '1';

    // *** YENİ: Yerel görsel yolunu dinamik olarak oluşturuyoruz ***
    // Request URL'sinin kökünü (örn: https://senin-siten.vercel.app) alıyoruz
    const baseUrl = url.origin; 
    // public/duo.png dosyasının tam URL'sini oluşturuyoruz
    const duoImageUrl = `${baseUrl}/duo.png`;

    // Font Awesome yerine SVG path kullandık ve yerel görselimizi ayarladık.

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            height: '100%',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f0f0f0', // Body rengi
            fontFamily: '"Arial", sans-serif',
          }}
        >
          {/* Duolingo Widget Kapsayıcısı */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '350px',
              height: '350px',
              // Linear gradient'i Satori (Vercel OG) destekler
              background: 'linear-gradient(to bottom, #4AC0E8 0%, #30CF7C 100%)',
              borderRadius: '40px',
              paddingTop: '20px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            {/* Kırmızı/Bulanık Kenar Efekti (Overlay) */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'radial-gradient(circle at 50% 10%, rgba(255, 0, 0, 0.1) 0%, transparent 70%)',
                zIndex: 0,
              }}
            />

            {/* İçerik Container (Z-index ile efektin üstüne çıksın) */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 10 }}>
              
              {/* Streak Info */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'white', marginBottom: '5px' }}>
                {/* Ateş İkonu (SVG olarak) */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  width="35"
                  height="35"
                  style={{ fill: '#FFC300', marginBottom: '5px', filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))' }}
                >
                  <path d="M159.3 5.4c7.8-7.3 19.9-7.2 27.7 .1c27.6 25.9 53.5 53.8 77.7 84c11-14.4 23.5-30.1 37-42.9c7.9-7.4 20.1-7.5 28.1-.3c23.1 20.8 47.3 54.4 62.4 80.6c4.1 7.1 11.2 11.8 19.3 12.6c27.8 2.8 56.5 16.5 76.5 40c21.2 24.9 31.9 58.7 27.5 91.2c-5.1 37.8-24.3 71.9-52.9 96.5c-28.7 24.7-67.4 39.1-107 39.1c-19.1 0-38.3-3.6-56.3-10.8c-7.9-3.2-16.7-1.7-23.4 3.7c-21.7 17.6-50.5 23.9-78.7 16.6c-48.4-12.6-83-56.7-83-106.4c0-26.6 8.5-52.4 24-73.4c17.5-23.8 42-42.4 69.8-53.2c8.2-3.2 13-12.4 10.9-20.9C111.9 143.9 108 122.3 108 102.7c0-43.2 19.3-81.8 51.3-110.3z"/>
                </svg>
                
                <span
                  style={{
                    fontSize: '50px',
                    fontWeight: 'bold',
                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                  }}
                >
                  {streak}
                </span>
              </div>

              {/* Pratik Metni */}
              <div
                style={{
                  color: 'white',
                  fontSize: '20px',
                  fontWeight: 600,
                  marginBottom: '5px',
                  textShadow: '0 1px 3px rgba(0, 0, 0, 0.15)',
                  textAlign: 'center',
                }}
              >
                Time to code, {username}!
              </div>
            </div>

            {/* Maskot Container */}
            <div
              style={{
                display: 'flex',
                width: '100%',
                flexGrow: 1,
                justifyContent: 'center',
                alignItems: 'flex-end',
                zIndex: 10,
              }}
            >
              {/* Yerel 'duo.png' dosyasını public klasörden yüklüyoruz. */}
              <img
                src={duoImageUrl} 
                alt="Duo Maskot"
                width="200"
                height="180"
                style={{
                  objectFit: 'contain',
                  marginBottom: '-10px' // Biraz aşağı taşması için
                }}
              />
            </div>
          </div>
        </div>
      ),
      {
        width: 400, // Widget'tan biraz daha geniş bir kanvas
        height: 400,
      }
    );
  } catch (e: any) {
    return new Response(`Hata oluştu: ${e.message}`, {
      status: 500,
    });
  }
}