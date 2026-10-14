// scripts/contraste.mjs
// Auditoría completa de contraste WCAG 2.1 para EcoSwipe (rediseno-v1.1)

function sRGBtoLinear(c) {
  const v = c / 255;
  return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

function relLuminance([r, g, b]) {
  return 0.2126 * sRGBtoLinear(r) + 0.7152 * sRGBtoLinear(g) + 0.0722 * sRGBtoLinear(b);
}

function blend(fgRgb, fgAlpha, bgRgb) {
  return [
    Math.round(fgRgb[0] * fgAlpha + bgRgb[0] * (1 - fgAlpha)),
    Math.round(fgRgb[1] * fgAlpha + bgRgb[1] * (1 - fgAlpha)),
    Math.round(fgRgb[2] * fgAlpha + bgRgb[2] * (1 - fgAlpha))
  ];
}

function contrastRatio(rgb1, rgb2) {
  const l1 = relLuminance(rgb1);
  const l2 = relLuminance(rgb2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

const PALETTE = {
  'verde-bosque': [28, 59, 32],       // #1C3B20
  'verde-hoja': [30, 132, 73],        // #1E8449
  'crema': [251, 247, 238],           // #FBF7EE
  'menta': [200, 230, 201],           // #C8E6C9
  'terracota': [228, 121, 59],        // #E4793B
  'gris-calido': [90, 107, 92],       // #5A6B5C
  'white': [255, 255, 255],           // #FFFFFF
  'brand-600': [25, 111, 61],         // #196F3D (hover btn-primary)
  'brand-700': [20, 90, 50],          // #145A32 (active btn-primary)
  'brand-50': [234, 243, 235],        // #EAF3EB
  'alerta-rojo': [185, 28, 28],       // #B91C1C (red-700)
};

// Combinaciones completas de clases de texto / fondo usadas en src/
const COMBINACIONES = [
  // 1. Textos principales sobre fondos claros
  {
    contexto: 'Cuerpo y títulos generales (p, h1..h3)',
    textName: 'verde-bosque (#1C3B20)', textRgb: PALETTE['verde-bosque'],
    bgName: 'crema (#FBF7EE)', bgRgb: PALETTE['crema'],
    tipoTexto: 'Normal (16px)'
  },
  {
    contexto: 'Tarjetas de contenido y modales (bg-white)',
    textName: 'verde-bosque (#1C3B20)', textRgb: PALETTE['verde-bosque'],
    bgName: 'blanco (#FFFFFF)', bgRgb: PALETTE['white'],
    tipoTexto: 'Normal (14px / 16px)'
  },
  {
    contexto: 'Texto de lectura secundario (text-verde-bosque/90)',
    textName: 'verde-bosque/90', textRgb: blend(PALETTE['verde-bosque'], 0.90, PALETTE['crema']),
    bgName: 'crema (#FBF7EE)', bgRgb: PALETTE['crema'],
    tipoTexto: 'Normal (16px)'
  },
  {
    contexto: 'Texto de lectura secundario (text-verde-bosque/85)',
    textName: 'verde-bosque/85', textRgb: blend(PALETTE['verde-bosque'], 0.85, PALETTE['crema']),
    bgName: 'crema (#FBF7EE)', bgRgb: PALETTE['crema'],
    tipoTexto: 'Normal (16px)'
  },
  {
    contexto: 'Texto de lectura secundario (text-verde-bosque/80)',
    textName: 'verde-bosque/80', textRgb: blend(PALETTE['verde-bosque'], 0.80, PALETTE['crema']),
    bgName: 'crema (#FBF7EE)', bgRgb: PALETTE['crema'],
    tipoTexto: 'Normal (16px)'
  },
  {
    contexto: 'Texto de lectura secundario (text-verde-bosque/75)',
    textName: 'verde-bosque/75', textRgb: blend(PALETTE['verde-bosque'], 0.75, PALETTE['crema']),
    bgName: 'crema (#FBF7EE)', bgRgb: PALETTE['crema'],
    tipoTexto: 'Normal (16px)'
  },
  {
    contexto: 'Metadatos en perfil (text-verde-bosque/70)',
    textName: 'verde-bosque/70', textRgb: blend(PALETTE['verde-bosque'], 0.70, PALETTE['crema']),
    bgName: 'crema (#FBF7EE)', bgRgb: PALETTE['crema'],
    tipoTexto: 'Normal (14px)'
  },

  // 2. Gris Cálido (#5A6B5C)
  {
    contexto: 'Metadatos y etiquetas secundarias en Crema',
    textName: 'gris-calido (#5A6B5C)', textRgb: PALETTE['gris-calido'],
    bgName: 'crema (#FBF7EE)', bgRgb: PALETTE['crema'],
    tipoTexto: 'Normal (14px)'
  },
  {
    contexto: 'Metadatos en tarjetas y modales (bg-white)',
    textName: 'gris-calido (#5A6B5C)', textRgb: PALETTE['gris-calido'],
    bgName: 'blanco (#FFFFFF)', bgRgb: PALETTE['white'],
    tipoTexto: 'Normal (14px)'
  },
  {
    contexto: 'Gris Cálido sobre Menta sólida (#C8E6C9)',
    textName: 'gris-calido (#5A6B5C)', textRgb: PALETTE['gris-calido'],
    bgName: 'menta (#C8E6C9)', bgRgb: PALETTE['menta'],
    tipoTexto: 'Normal (14px)'
  },
  {
    contexto: 'Gris Cálido sobre bg-menta/60 mezclado en Crema',
    textName: 'gris-calido (#5A6B5C)', textRgb: PALETTE['gris-calido'],
    bgName: 'menta/60 sobre Crema', bgRgb: blend(PALETTE['menta'], 0.60, PALETTE['crema']),
    tipoTexto: 'Normal (14px)'
  },
  {
    contexto: 'Gris Cálido sobre bg-menta/30 mezclado en Crema',
    textName: 'gris-calido (#5A6B5C)', textRgb: PALETTE['gris-calido'],
    bgName: 'menta/30 sobre Crema', bgRgb: blend(PALETTE['menta'], 0.30, PALETTE['crema']),
    tipoTexto: 'Normal (14px)'
  },

  // 3. Verde Hoja (#1E8449)
  {
    contexto: 'Verde Hoja sobre Crema en texto normal (evaluación)',
    textName: 'verde-hoja (#1E8449)', textRgb: PALETTE['verde-hoja'],
    bgName: 'crema (#FBF7EE)', bgRgb: PALETTE['crema'],
    tipoTexto: 'Normal (<18.66px negrita)'
  },
  {
    contexto: 'Verde Hoja sobre Crema en Texto Grande (≥18.66px negrita)',
    textName: 'verde-hoja (Large)', textRgb: PALETTE['verde-hoja'],
    bgName: 'crema (#FBF7EE)', bgRgb: PALETTE['crema'],
    tipoTexto: 'Grande (≥18.66px negrita / ≥24px)'
  },
  {
    contexto: 'Verde Hoja sobre Blanco (precios y destaques)',
    textName: 'verde-hoja (#1E8449)', textRgb: PALETTE['verde-hoja'],
    bgName: 'blanco (#FFFFFF)', bgRgb: PALETTE['white'],
    tipoTexto: 'Normal (14px / 16px)'
  },
  {
    contexto: 'Verde Hoja sobre Menta sólida (#C8E6C9)',
    textName: 'verde-hoja (#1E8449)', textRgb: PALETTE['verde-hoja'],
    bgName: 'menta (#C8E6C9)', bgRgb: PALETTE['menta'],
    tipoTexto: 'Normal (14px)'
  },
  {
    contexto: 'Verde Hoja sobre bg-menta/50 mezclado en Crema',
    textName: 'verde-hoja (#1E8449)', textRgb: PALETTE['verde-hoja'],
    bgName: 'menta/50 sobre Crema', bgRgb: blend(PALETTE['menta'], 0.50, PALETTE['crema']),
    tipoTexto: 'Normal (14px)'
  },

  // 4. Botones, Controles y Estados Interactivos
  {
    contexto: 'btn-primary: Reposo (Blanco sobre Verde Hoja)',
    textName: 'blanco (#FFFFFF)', textRgb: PALETTE['white'],
    bgName: 'verde-hoja (#1E8449)', bgRgb: PALETTE['verde-hoja'],
    tipoTexto: 'Normal (14px SemiBold)'
  },
  {
    contexto: 'btn-primary: Hover (Blanco sobre #196F3D)',
    textName: 'blanco (#FFFFFF)', textRgb: PALETTE['white'],
    bgName: 'verde-hoja-hover (#196F3D)', bgRgb: PALETTE['brand-600'],
    tipoTexto: 'Normal (14px SemiBold)'
  },
  {
    contexto: 'btn-primary: Active (Blanco sobre #145A32)',
    textName: 'blanco (#FFFFFF)', textRgb: PALETTE['white'],
    bgName: 'verde-hoja-active (#145A32)', bgRgb: PALETTE['brand-700'],
    tipoTexto: 'Normal (14px SemiBold)'
  },
  {
    contexto: 'btn-primary: Disabled (Opacidad 50%)',
    textName: 'blanco/50', textRgb: blend(PALETTE['white'], 0.50, PALETTE['verde-hoja']),
    bgName: 'verde-hoja (#1E8449)', bgRgb: PALETTE['verde-hoja'],
    tipoTexto: 'Normal (14px SemiBold)'
  },
  {
    contexto: 'btn-secondary: Reposo (Verde Bosque sobre Blanco)',
    textName: 'verde-bosque (#1C3B20)', textRgb: PALETTE['verde-bosque'],
    bgName: 'blanco (#FFFFFF)', bgRgb: PALETTE['white'],
    tipoTexto: 'Normal (14px SemiBold)'
  },
  {
    contexto: 'btn-secondary: Hover (Verde Bosque sobre Crema)',
    textName: 'verde-bosque (#1C3B20)', textRgb: PALETTE['verde-bosque'],
    bgName: 'crema (#FBF7EE)', bgRgb: PALETTE['crema'],
    tipoTexto: 'Normal (14px SemiBold)'
  },
  {
    contexto: 'Chip inactivo: Reposo (Gris Cálido sobre Blanco)',
    textName: 'gris-calido (#5A6B5C)', textRgb: PALETTE['gris-calido'],
    bgName: 'blanco (#FFFFFF)', bgRgb: PALETTE['white'],
    tipoTexto: 'Normal (14px SemiBold)'
  },
  {
    contexto: 'Chip activo: Reposo (Crema sobre Verde Bosque)',
    textName: 'crema (#FBF7EE)', textRgb: PALETTE['crema'],
    bgName: 'verde-bosque (#1C3B20)', bgRgb: PALETTE['verde-bosque'],
    tipoTexto: 'Normal (14px SemiBold)'
  },

  // 5. PerfilVendedor con Cabecera Verde Bosque
  {
    contexto: 'PerfilVendedor: Título taller (Crema sobre Verde Bosque)',
    textName: 'crema (#FBF7EE)', textRgb: PALETTE['crema'],
    bgName: 'verde-bosque (#1C3B20)', bgRgb: PALETTE['verde-bosque'],
    tipoTexto: 'Grande (24px Fredoka)'
  },
  {
    contexto: 'PerfilVendedor: Subtítulo (text-crema/80 sobre Verde Bosque)',
    textName: 'crema/80', textRgb: blend(PALETTE['crema'], 0.80, PALETTE['verde-bosque']),
    bgName: 'verde-bosque (#1C3B20)', bgRgb: PALETTE['verde-bosque'],
    tipoTexto: 'Normal (14px / 16px)'
  },
  {
    contexto: 'PerfilVendedor: Insignia verificada (Menta sobre Verde Bosque)',
    textName: 'menta (#C8E6C9)', textRgb: PALETTE['menta'],
    bgName: 'verde-bosque (#1C3B20)', bgRgb: PALETTE['verde-bosque'],
    tipoTexto: 'Normal (14px)'
  },
  {
    contexto: 'PerfilVendedor: Métrica Terracota Grande (≥18.66px negrita)',
    textName: 'terracota (Large)', textRgb: PALETTE['terracota'],
    bgName: 'verde-bosque (#1C3B20)', bgRgb: PALETTE['verde-bosque'],
    tipoTexto: 'Grande (≥18.66px negrita / ≥24px)'
  },
  {
    contexto: 'PerfilVendedor: Terracota Texto Pequeño (<18.66px negrita)',
    textName: 'terracota (Small)', textRgb: PALETTE['terracota'],
    bgName: 'verde-bosque (#1C3B20)', bgRgb: PALETTE['verde-bosque'],
    tipoTexto: 'Normal (<18.66px)'
  },

  // 6. Reglas Restrictivas y Badges
  {
    contexto: 'Terracota sobre Crema (PROHIBIDO para texto)',
    textName: 'terracota (#E4793B)', textRgb: PALETTE['terracota'],
    bgName: 'crema (#FBF7EE)', bgRgb: PALETTE['crema'],
    tipoTexto: 'Cualquiera'
  },
  {
    contexto: 'badge-entrega / badge-disponible (Verde Bosque sobre Menta)',
    textName: 'verde-bosque (#1C3B20)', textRgb: PALETTE['verde-bosque'],
    bgName: 'menta (#C8E6C9)', bgRgb: PALETTE['menta'],
    tipoTexto: 'Normal (14px SemiBold)'
  },
  {
    contexto: 'badge-delivery (Verde Bosque sobre menta/50 en Crema)',
    textName: 'verde-bosque (#1C3B20)', textRgb: PALETTE['verde-bosque'],
    bgName: 'menta/50 sobre Crema', bgRgb: blend(PALETTE['menta'], 0.50, PALETTE['crema']),
    tipoTexto: 'Normal (14px SemiBold)'
  },
  {
    contexto: 'badge-recojo (Gris Cálido sobre Crema)',
    textName: 'gris-calido (#5A6B5C)', textRgb: PALETTE['gris-calido'],
    bgName: 'crema (#FBF7EE)', bgRgb: PALETTE['crema'],
    tipoTexto: 'Normal (14px SemiBold)'
  },
  {
    contexto: 'Alerta de formulario (Rojo sobre Crema)',
    textName: 'alerta-rojo (#B91C1C)', textRgb: PALETTE['alerta-rojo'],
    bgName: 'crema (#FBF7EE)', bgRgb: PALETTE['crema'],
    tipoTexto: 'Normal (14px)'
  },

  // 7. Escala Móvil (12px - 13px)
  {
    contexto: 'Móvil: Barra inferior activo (12px Verde Bosque sobre Crema)',
    textName: 'verde-bosque (#1C3B20)', textRgb: PALETTE['verde-bosque'],
    bgName: 'crema (#FBF7EE)', bgRgb: PALETTE['crema'],
    tipoTexto: 'Normal (12px SemiBold)'
  },
  {
    contexto: 'Móvil: Barra inferior inactivo (12px Gris Cálido sobre Crema)',
    textName: 'gris-calido (#5A6B5C)', textRgb: PALETTE['gris-calido'],
    bgName: 'crema (#FBF7EE)', bgRgb: PALETTE['crema'],
    tipoTexto: 'Normal (12px SemiBold)'
  },
  {
    contexto: 'Móvil: LoteCard precio "/kg" (13px Gris Cálido sobre Blanco)',
    textName: 'gris-calido (#5A6B5C)', textRgb: PALETTE['gris-calido'],
    bgName: 'blanco (#FFFFFF)', bgRgb: PALETTE['white'],
    tipoTexto: 'Normal (13px)'
  },
  {
    contexto: 'Móvil: LoteCard "Delivery · Recojo" (13px Gris Cálido sobre Blanco)',
    textName: 'gris-calido (#5A6B5C)', textRgb: PALETTE['gris-calido'],
    bgName: 'blanco (#FFFFFF)', bgRgb: PALETTE['white'],
    tipoTexto: 'Normal (13px)'
  },
  {
    contexto: 'Móvil: LoteCard metadatos (13px Gris Cálido sobre Blanco)',
    textName: 'gris-calido (#5A6B5C)', textRgb: PALETTE['gris-calido'],
    bgName: 'blanco (#FFFFFF)', bgRgb: PALETTE['white'],
    tipoTexto: 'Normal (13px)'
  },
  {
    contexto: 'Móvil: LoteCard vendedor y calificación (13px Verde Bosque sobre Blanco)',
    textName: 'verde-bosque (#1C3B20)', textRgb: PALETTE['verde-bosque'],
    bgName: 'blanco (#FFFFFF)', bgRgb: PALETTE['white'],
    tipoTexto: 'Normal (13px SemiBold)'
  },
  {
    contexto: 'Móvil: Mercado contador y orden (13px Gris Cálido sobre Crema)',
    textName: 'gris-calido (#5A6B5C)', textRgb: PALETTE['gris-calido'],
    bgName: 'crema (#FBF7EE)', bgRgb: PALETTE['crema'],
    tipoTexto: 'Normal (13px)'
  },
  {
    contexto: 'Móvil: Badges 12-13px (Verde Bosque sobre Menta)',
    textName: 'verde-bosque (#1C3B20)', textRgb: PALETTE['verde-bosque'],
    bgName: 'menta (#C8E6C9)', bgRgb: PALETTE['menta'],
    tipoTexto: 'Normal (12px SemiBold)'
  },
  {
    contexto: 'Móvil: Franja Datos de Ejemplo (12px Crema sobre Verde Bosque)',
    textName: 'crema (#FBF7EE)', textRgb: PALETTE['crema'],
    bgName: 'verde-bosque (#1C3B20)', bgRgb: PALETTE['verde-bosque'],
    tipoTexto: 'Normal (12px SemiBold)'
  }
];

function runAudit() {
  console.log('| Contexto | Texto | Fondo | Ratio | AA Normal (≥4.5:1) | AA Large (≥3.0:1) | Veredicto |');
  console.log('|---|---|---|:---:|:---:|:---:|---|');

  const rows = [];

  for (const c of COMBINACIONES) {
    const ratio = contrastRatio(c.textRgb, c.bgRgb);
    const passNormal = ratio >= 4.5;
    const passLarge = ratio >= 3.0;

    let veredicto = 'CUMPLE AA Normal';
    if (!passNormal && passLarge) {
      veredicto = c.tipoTexto.includes('Grande') ? 'CUMPLE AA (Solo Texto Grande)' : 'FALLA AA Normal (<4.5)';
    } else if (!passNormal && !passLarge) {
      veredicto = 'NO CUMPLE AA (Prohibido)';
    }

    const row = {
      contexto: c.contexto,
      texto: c.textName,
      fondo: c.bgName,
      ratio: ratio.toFixed(2) + ':1',
      passNormal: passNormal ? 'PASS' : 'FAIL',
      passLarge: passLarge ? 'PASS' : 'FAIL',
      veredicto
    };
    rows.push(row);

    console.log(`| ${row.contexto} | ${row.texto} | ${row.fondo} | ${row.ratio} | ${row.passNormal} | ${row.passLarge} | ${row.veredicto} |`);
  }

  return rows;
}

runAudit();
