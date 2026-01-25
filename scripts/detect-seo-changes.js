#!/usr/bin/env node

/**
 * SEO Change Detector
 * 
 * Detecta cambios en elementos críticos de SEO y alerta al equipo.
 * Uso: node scripts/detect-seo-changes.js [--strict]
 * 
 * Elementos monitoreados:
 * - URLs (app-routing.module.ts)
 * - Títulos y H1 (archivos i18n)
 * - Canonical (app.component.ts)
 * - robots.txt
 * - Hreflang (app.component.ts)
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuración
const CRITICAL_FILES = {
  'src/app/app-routing.module.ts': 'URLs / Routing',
  'src/robots.txt': 'robots.txt (indexación)',
  'src/app/app.component.ts': 'Meta tags / Canonical / Hreflang',
  'src/assets/i18n/es.json': 'Títulos y contenido (ES)',
  'src/assets/i18n/en.json': 'Títulos y contenido (EN)',
  'src/sitemap.xml': 'Sitemap'
};

const CRITICAL_PATTERNS = {
  'title': /seo\.home\.title|<title>/gi,
  'h1': /hero\.title|<h1>/gi,
  'canonical': /rel=["']canonical|updateCanonicalUrl/gi,
  'hreflang': /hreflang|updateHreflangTags/gi,
  'robots': /robots|noindex|disallow/gi,
  'url': /path:\s*["']/gi
};

// Colores para terminal
const colors = {
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function getGitDiff() {
  try {
    // Comparar con main (o master si no existe main)
    let baseBranch = 'main';
    try {
      execSync('git rev-parse --verify main', { stdio: 'pipe' });
    } catch {
      baseBranch = 'master';
    }

    return execSync(`git diff ${baseBranch}...HEAD --name-only`, { encoding: 'utf-8' });
  } catch (error) {
    // Si falla, comparar con HEAD (cambios locales)
    try {
      return execSync('git diff --name-only', { encoding: 'utf-8' });
    } catch {
      log('⚠️  No se pudo obtener el diff de Git. Ejecutando en modo local.', 'yellow');
      return '';
    }
  }
}

function getDetailedDiff(file) {
  try {
    return execSync(`git diff HEAD -- "${file}"`, { encoding: 'utf-8' });
  } catch {
    return '';
  }
}

function analyzeChanges() {
  log('\n🔍 SEO Change Detector\n', 'blue');
  
  const changedFiles = getGitDiff().split('\n').filter(Boolean);
  
  if (changedFiles.length === 0) {
    log('✅ No hay cambios detectados.\n', 'green');
    return { critical: [], warnings: [] };
  }

  const criticalChanges = [];
  const warnings = [];

  // 1. Detectar archivos críticos modificados
  changedFiles.forEach(file => {
    if (CRITICAL_FILES[file]) {
      criticalChanges.push({
        file,
        type: CRITICAL_FILES[file],
        severity: 'CRITICAL'
      });
    }
  });

  // 2. Analizar diff de archivos críticos
  criticalChanges.forEach(change => {
    const diff = getDetailedDiff(change.file);
    
    // Detectar patrones críticos en el diff
    Object.keys(CRITICAL_PATTERNS).forEach(pattern => {
      if (CRITICAL_PATTERNS[pattern].test(diff)) {
        change.patterns = change.patterns || [];
        change.patterns.push(pattern);
      }
    });
  });

  // 3. Verificar si existe entrada en changelog
  const changelogPath = 'docs/reference/seo-changelog.md';
  if (criticalChanges.length > 0) {
    if (!fs.existsSync(changelogPath)) {
      warnings.push('⚠️  No existe docs/reference/seo-changelog.md');
    } else {
      const changelog = fs.readFileSync(changelogPath, 'utf-8');
      const today = new Date().toISOString().split('T')[0];
      
      if (!changelog.includes(today) && !changelog.includes('[PLANIFICADO]')) {
        warnings.push(`⚠️  No hay entrada de hoy (${today}) en seo-changelog.md`);
      }
    }
  }

  return { critical: criticalChanges, warnings };
}

function displayResults(results) {
  const { critical, warnings } = results;

  if (critical.length === 0 && warnings.length === 0) {
    log('✅ No hay cambios críticos de SEO detectados.\n', 'green');
    return 0;
  }

  if (critical.length > 0) {
    log('\n🔴 CAMBIOS CRÍTICOS DE SEO DETECTADOS:\n', 'red');
    
    critical.forEach((change, index) => {
      log(`${index + 1}. ${change.file}`, 'bold');
      log(`   Tipo: ${change.type}`, 'yellow');
      
      if (change.patterns) {
        log(`   Patrones detectados: ${change.patterns.join(', ')}`, 'yellow');
      }
      console.log('');
    });

    log('⚠️  ACCIÓN REQUERIDA:', 'red');
    log('   1. Revisar docs/reference/normas-criticas-seo.md', 'yellow');
    log('   2. Registrar cambios en docs/reference/seo-changelog.md', 'yellow');
    log('   3. Seguir proceso en docs/how-to/cambios-seo-seguros.md', 'yellow');
    console.log('');
  }

  if (warnings.length > 0) {
    log('⚠️  ADVERTENCIAS:\n', 'yellow');
    warnings.forEach(warning => log(`   ${warning}`, 'yellow'));
    console.log('');
  }

  // En modo estricto, salir con código de error si hay cambios críticos
  const strictMode = process.argv.includes('--strict');
  if (strictMode && critical.length > 0) {
    log('❌ MODO ESTRICTO: Cambios críticos bloqueados.\n', 'red');
    log('   Para continuar, registra los cambios en seo-changelog.md\n', 'yellow');
    return 1;
  }

  return 0;
}

// Ejecutar
const results = analyzeChanges();
const exitCode = displayResults(results);
process.exit(exitCode);
