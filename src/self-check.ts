import assert from 'node:assert';
import { useAuthStore } from './features/auth/store/useAuthStore.js';

async function runFrontendSelfCheck() {
  console.log('🧪 Starting Frontend Self-Check Verification...');

  try {
    // 1. Check Auth Store Initial State & Login Simulation
    console.log('  1. Testing Zustand Auth Store...');
    const store = useAuthStore.getState();
    assert.strictEqual(typeof store.setAuth, 'function', 'setAuth should be a function');
    assert.strictEqual(typeof store.logout, 'function', 'logout should be a function');

    // Simulate login
    store.setAuth('test_token_123', {
      id: 'admin_id_1',
      name: 'Admin Test',
      email: 'admin@test.com',
      role: 'ADMIN',
    });

    const activeState = useAuthStore.getState();
    assert.strictEqual(activeState.token, 'test_token_123');
    assert.strictEqual(activeState.user?.email, 'admin@test.com');
    console.log('     ✓ Auth Store Login PASSED');

    // Simulate logout
    store.logout();
    const loggedOutState = useAuthStore.getState();
    assert.strictEqual(loggedOutState.token, null);
    assert.strictEqual(loggedOutState.user, null);
    console.log('     ✓ Auth Store Logout PASSED');

    // 2. Check Navbar Specifications
    console.log('  2. Testing Navbar Component Configurations...');
    const { BELAJAR_ISLAM_SUBMENUS, KHUTBAH_CATEGORIES, EXTERNAL_LINKS } = await import('./shared/components/layout/PublicNavbar.js');
    assert.strictEqual(BELAJAR_ISLAM_SUBMENUS.length, 2, 'Belajar Islam should have 2 sub-menus');
    assert.strictEqual(BELAJAR_ISLAM_SUBMENUS[0].items.length, 7, 'Hukum Islam should have 7 child items');
    assert.strictEqual(BELAJAR_ISLAM_SUBMENUS[1].items.length, 11, 'Belajar Islam should have 11 child items');
    assert.strictEqual(KHUTBAH_CATEGORIES.length, 4, 'Khutbah Mega Menu should have 4 categories');
    assert.strictEqual(EXTERNAL_LINKS.length, 5, 'External links should have 5 subdomains');
    console.log('     ✓ Navbar Specifications PASSED');

    // 3. Check Tag Navigation Hierarchy
    console.log('  3. Testing Tag Navigation Hierarchy...');
    const { getCategoryNavInfo } = await import('./pages/public/HomePage.js');
    const akhlaqNav = getCategoryNavInfo(undefined, 'Akhlaq');
    assert.strictEqual(akhlaqNav.parent, 'Topik Kajian');
    assert.strictEqual(akhlaqNav.current, 'Akhlaq');
    assert.strictEqual(akhlaqNav.title, 'AKHLAQ');

    const sirahNav = getCategoryNavInfo(undefined, 'sirah-sejarah');
    assert.strictEqual(sirahNav.parent, 'Sejarah Islam');
    assert.strictEqual(sirahNav.current, 'Sirah & Sejarah');

    const haditsNav = getCategoryNavInfo(undefined, 'hadits-sunnah');
    assert.strictEqual(haditsNav.parent, "Al-Qur'an & Hadits");
    assert.strictEqual(haditsNav.current, 'Hadits & Sunnah');

    const shalatNav = getCategoryNavInfo(undefined, 'Shalat');
    assert.strictEqual(shalatNav.parent, 'Hukum Islam');
    assert.strictEqual(shalatNav.current, 'Shalat');
    assert.strictEqual(shalatNav.title, 'SHALAT');

    const khutbahNav = getCategoryNavInfo(undefined, 'Naskah Khutbah');
    assert.strictEqual(khutbahNav.parent, undefined);
    assert.strictEqual(khutbahNav.current, 'Naskah Khutbah');
    assert.strictEqual(khutbahNav.title, 'NASKAH KHUTBAH');
    console.log('     ✓ Tag Navigation Hierarchy PASSED');

    // 4. Check Article Carousel Component
    console.log('  4. Testing Article Carousel Export...');
    const { ArticleCarousel } = await import('./features/articles/components/ArticleCarousel.js');
    assert.strictEqual(typeof ArticleCarousel, 'function', 'ArticleCarousel should be a functional component');
    console.log('     ✓ Article Carousel Export PASSED');

    // 5. Check RichTextEditor Component
    console.log('  5. Testing RichTextEditor Export...');
    const { RichTextEditor } = await import('./features/articles/components/RichTextEditor.js');
    assert.strictEqual(typeof RichTextEditor, 'function', 'RichTextEditor should be a functional component');
    console.log('     ✓ RichTextEditor Export PASSED');

    // 6. Check DynamicMeta Component
    console.log('  6. Testing DynamicMeta Export...');
    const { DynamicMeta } = await import('./shared/components/common/DynamicMeta.js');
    assert.strictEqual(typeof DynamicMeta, 'function', 'DynamicMeta should be a functional component');
    console.log('     ✓ DynamicMeta Component Export PASSED');

    console.log('\n🎉 ALL FRONTEND SELF-CHECKS PASSED SUCCESSFULLY!');
  } catch (error) {
    console.error('\n❌ Self-Check Failed:', error);
    process.exit(1);
  }
}

runFrontendSelfCheck();
