import { headers } from 'next/headers'
import Link from 'next/link'

// ── Detección server-side ────────────────────────────────────────────────────
function check3DS(ua: string): boolean {
  return /Nintendo 3DS/i.test(ua)
}

// ── Vista 3DS: HTML puro, sin React, sin JS, sin fuentes externas ────────────
function View3DS() {
  // Retornamos HTML como string inyectado directo — sin componentes React complejos
  return (
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=400" />
        <title>Pershia</title>
        <style dangerouslySetInnerHTML={{ __html: `
          * { margin:0; padding:0; box-sizing:border-box; }
          body {
            width: 400px;
            background: #f5f0eb;
            color: #222;
            font-family: sans-serif;
            font-size: 13px;
          }
          .header {
            background: #222;
            color: #f5f0eb;
            text-align: center;
            padding: 10px;
            border-bottom: 3px solid #c8a97e;
          }
          .logo {
            font-size: 24px;
            font-weight: bold;
            letter-spacing: 6px;
          }
          .tagline {
            font-size: 9px;
            letter-spacing: 2px;
            color: #c8a97e;
            margin-top: 2px;
          }
          .hero {
            background: #c8a97e;
            padding: 14px;
            text-align: center;
          }
          .hero-title {
            font-size: 14px;
            font-weight: bold;
            color: #fff;
            margin-bottom: 4px;
          }
          .hero-desc {
            font-size: 11px;
            color: #fff;
            line-height: 1.5;
            margin-bottom: 10px;
          }
          .btn {
            display: inline-block;
            background: #222;
            color: #f5f0eb;
            padding: 7px 20px;
            font-size: 11px;
            font-weight: bold;
            text-decoration: none;
            letter-spacing: 1px;
          }
          .features { padding: 10px 14px; }
          .feat {
            padding: 8px 0;
            border-bottom: 1px solid #ddd;
          }
          .feat-title {
            font-weight: bold;
            font-size: 12px;
            color: #222;
          }
          .feat-desc {
            font-size: 11px;
            color: #666;
            margin-top: 1px;
          }
          .footer {
            text-align: center;
            padding: 8px;
            font-size: 10px;
            color: #999;
            border-top: 1px solid #ddd;
          }
        `}} />
      </head>
      <body>
        <div className="header">
          <div className="logo">PERSHIA</div>
          <div className="tagline">TU GUARDARROPA DIGITAL</div>
        </div>

        <div className="hero">
          <img
            src="/images.jpg"
            alt="Pershia"
            width="120"
            height="120"
            style={{ display:'block', margin:'0 auto 10px', border:'2px solid #fff' }}
          />
          <div className="hero-title">Organiza tu estilo</div>
          <div className="hero-desc">
            Guarda tus prendas, crea outfits y arma colecciones.
          </div>
          <a className="btn" href="/wardrobe">ENTRAR AL ARMARIO</a>
        </div>

        <div className="features">
          <div className="feat">
            <div className="feat-title">👕 Items</div>
            <div className="feat-desc">Registra cada prenda de tu closet</div>
          </div>
          <div className="feat">
            <div className="feat-title">✨ Outfits</div>
            <div className="feat-desc">Combina prendas y guarda looks</div>
          </div>
          <div className="feat">
            <div className="feat-title">📁 Colecciones</div>
            <div className="feat-desc">Agrupa por ocasión o temporada</div>
          </div>
        </div>

        <div className="footer">Pershia 2025 — Nintendo 3DS</div>
      </body>
    </html>
  )
}

// ── Vista normal ─────────────────────────────────────────────────────────────
function ViewNormal() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#0f0f0f]">
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#c8a97e]/10 blur-[120px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-xl">
        <p className="text-xs tracking-[0.4em] uppercase text-[#c8a97e]/60 mb-4 font-light">
          Tu guardarropa digital
        </p>
        <h1
          className="text-7xl md:text-9xl font-black text-white mb-2 leading-none"
          style={{ fontFamily: 'Georgia, serif', letterSpacing: '-0.04em' }}
        >
          Pershia
        </h1>
        <div className="flex items-center gap-3 my-6 w-full justify-center">
          <div className="h-px w-16 bg-[#c8a97e]/30" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#c8a97e]" />
          <div className="h-px w-16 bg-[#c8a97e]/30" />
        </div>
        <p className="text-[#888] text-base md:text-lg leading-relaxed mb-10 max-w-sm">
          Organiza tus prendas, diseña outfits y arma colecciones para cada ocasión.
        </p>
        <Link
          href="/wardrobe"
          className="group relative inline-flex items-center gap-3 bg-[#c8a97e] text-[#0f0f0f] px-8 py-4 rounded-full font-bold text-sm tracking-widest uppercase transition-all duration-300 hover:bg-white hover:scale-105 shadow-[0_0_40px_rgba(200,169,126,0.25)]"
        >
          Entrar al armario
          <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </Link>
        <div className="flex gap-8 mt-14 text-center">
          {[
            { icon: '👕', label: 'Items' },
            { icon: '✨', label: 'Outfits' },
            { icon: '📁', label: 'Colecciones' },
          ].map(f => (
            <div key={f.label} className="flex flex-col items-center gap-1">
              <span className="text-2xl">{f.icon}</span>
              <span className="text-xs text-[#555] tracking-widest uppercase">{f.label}</span>
            </div>
          ))}
        </div>
      </div>
      <p className="absolute bottom-6 text-[10px] text-[#333] tracking-widest uppercase">
        Pershia © 2025
      </p>
    </div>
  )
}

// ── Server Component — detección en servidor ──────────────────────────────────
export default async function Home() {
  const headersList = await headers()
  const ua = headersList.get('user-agent') ?? ''
  const is3ds = check3DS(ua)

  if (is3ds) return <View3DS />
  return <ViewNormal />
}