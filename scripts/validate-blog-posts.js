const fs = require('fs');
const path = require('path');

const BLOG_POSTS_PATH = path.join(__dirname, '../src/assets/data/blog-posts.json');
const REQUIRED_LANGS = ['es', 'en'];

try {
  const data = JSON.parse(fs.readFileSync(BLOG_POSTS_PATH, 'utf8'));
  const posts = data.posts;

  console.log(`\n✨ Validando ${posts.length} posts del blog...\n`);

  let hasErrors = false;

  posts.forEach((post, index) => {
    console.log(`📄 Post ${index + 1}: ${post.id}`);

    // Validar meta title length (50-60 chars)
    REQUIRED_LANGS.forEach(lang => {
      const titleLen = post.metaTitle[lang]?.length;
      if (!titleLen || titleLen < 50 || titleLen > 60) {
        console.error(`  ❌ metaTitle[${lang}] debe tener 50-60 caracteres (actual: ${titleLen})`);
        hasErrors = true;
      } else {
        console.log(`  ✅ metaTitle[${lang}]: ${titleLen} chars`);
      }
    });

    // Validar meta description length (120-160 chars)
    REQUIRED_LANGS.forEach(lang => {
      const descLen = post.metaDescription[lang]?.length;
      if (!descLen || descLen < 120 || descLen > 160) {
        console.error(`  ❌ metaDescription[${lang}] debe tener 120-160 caracteres (actual: ${descLen})`);
        hasErrors = true;
      } else {
        console.log(`  ✅ metaDescription[${lang}]: ${descLen} chars`);
      }
    });

    // Validar featured image
    const imagePath = path.join(__dirname, `../src${post.featuredImage.url}`);
    if (!fs.existsSync(imagePath)) {
      console.error(`  ❌ featuredImage no existe: ${post.featuredImage.url}`);
      hasErrors = true;
    } else {
      console.log(`  ✅ featuredImage existe`);
    }

    console.log('');
  });

  // Validar slugs únicos
  const slugsEs = posts.map(p => p.slug.es);
  const duplicates = slugsEs.filter((s, i) => slugsEs.indexOf(s) !== i);
  if (duplicates.length > 0) {
    console.error(`❌ Slugs duplicados en ES: ${duplicates.join(', ')}`);
    hasErrors = true;
  }

  if (hasErrors) {
    console.error('\n❌ Validación fallida. Corrige los errores antes de continuar.\n');
    process.exit(1);
  } else {
    console.log('✅ ¡Todos los posts son válidos!\n');
    process.exit(0);
  }
} catch (error) {
  console.error(`❌ Error al leer o parsear blog-posts.json: ${error.message}`);
  process.exit(1);
}
