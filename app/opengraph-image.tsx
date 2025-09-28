import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Notulio - AI-Powered Article Learning Platform';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#ffedd6',
          backgroundImage:
            'linear-gradient(135deg, #ffedd6 0%, #ffedd6 60%, #ff7a05 100%)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '40px',
          }}
        >
          <h1
            style={{
              fontSize: '72px',
              fontWeight: 700,
              color: '#333333',
              marginBottom: '20px',
              letterSpacing: '-2px',
            }}
          >
            Notulio
          </h1>
          <p
            style={{
              fontSize: '32px',
              color: '#666666',
              marginBottom: '40px',
              maxWidth: '800px',
              lineHeight: '1.2',
            }}
          >
            Save any web article with a URL. Get AI summaries, flashcards, and
            organized tags automatically.
          </p>
          <div
            style={{
              display: 'flex',
              gap: '40px',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: '#ff7a05',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                📚
              </div>
              <span style={{ color: '#333333', fontSize: '18px' }}>
                Web Scraping
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: '#ff7a05',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                🤖
              </div>
              <span style={{ color: '#333333', fontSize: '18px' }}>
                AI Summaries
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: '#ff7a05',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                🎯
              </div>
              <span style={{ color: '#333333', fontSize: '18px' }}>
                Flashcards
              </span>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
