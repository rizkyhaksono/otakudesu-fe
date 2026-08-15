/**
 * UI dictionaries.
 *
 * Only the site's own chrome is translated. The catalogue itself — titles,
 * synopses, chapter names — comes from Indonesian upstreams and cannot be
 * translated without inventing content, so it is passed through as-is.
 *
 * `id` is the source of truth; every other locale must have the same keys,
 * which is enforced by the `Dictionary` type below.
 */

export const LOCALES = ["id", "en", "ja"] as const;
export type Locale = (typeof LOCALES)[number];

export const LOCALE_NAMES: Record<Locale, string> = {
  id: "Bahasa Indonesia",
  en: "English",
  ja: "日本語",
};

export const DEFAULT_LOCALE: Locale = "id";

const id = {
  nav: {
    anime: "Anime",
    comic: "Komik",
    movie: "Film",
    tv: "TV Live",
    bookmark: "Bookmark",
    search: "Cari",
    menu: "Menu",
    ongoing: "Sedang tayang",
    completed: "Selesai tayang",
    schedule: "Jadwal rilis",
    genres: "Genre",
    directory: "Daftar A–Z",
    latest: "Update terbaru",
    browse: "Jelajahi katalog",
    novels: "Novel",
    theme: "Ganti tema",
    language: "Bahasa",
  },
  common: {
    seeAll: "Lihat semua",
    home: "Beranda",
    back: "Kembali",
    retry: "Coba lagi",
    loading: "Memuat…",
    empty: "Belum ada data",
    prev: "Sebelumnya",
    next: "Berikutnya",
    continue: "Lanjutkan",
    clear: "Bersihkan",
    close: "Tutup",
    skip: "Lewati",
    done: "Selesai",
  },
  support: {
    title: "Proyek ini open source",
    body: "Natee dibangun terbuka dan gratis selamanya. Kalau membantu, satu bintang di GitHub sangat berarti — itu yang membuat proyek ini terus diperbarui.",
    star: "Beri bintang",
    fork: "Fork repo",
    later: "Nanti saja",
    docked: "Dukung proyek ini",
  },
  tour: {
    title: "Sekilas isi Natee",
    step1Title: "Anime",
    step1Body: "Ribuan judul sub Indo, lengkap dengan jadwal rilis dan banyak pilihan server.",
    step2Title: "Komik",
    step2Body: "Manga, manhwa, manhua dan novel — pembaca bawaan dengan mode gulir dan halaman.",
    step3Title: "Film & serial",
    step3Body: "Metadata dari TMDB, pemutar dari beberapa server, plus tautan Letterboxd.",
    step4Title: "TV Indonesia",
    step4Body: "Siaran langsung puluhan channel lokal, langsung dari browser.",
    step5Title: "Riwayat & bookmark",
    step5Body: "Tersimpan di perangkatmu sendiri. Tanpa akun, tanpa server.",
  },
};

/**
 * Shape is taken from `id` without `as const`, so keys are enforced across every
 * locale while the values stay plain strings — with `as const` the literals
 * themselves would become the type and no translation could differ.
 */
export type Dictionary = typeof id;

const en: Dictionary = {
  nav: {
    anime: "Anime",
    comic: "Comics",
    movie: "Movies",
    tv: "Live TV",
    bookmark: "Bookmarks",
    search: "Search",
    menu: "Menu",
    ongoing: "Currently airing",
    completed: "Finished airing",
    schedule: "Release schedule",
    genres: "Genres",
    directory: "A–Z directory",
    latest: "Latest updates",
    browse: "Browse catalogue",
    novels: "Novels",
    theme: "Toggle theme",
    language: "Language",
  },
  common: {
    seeAll: "See all",
    home: "Home",
    back: "Back",
    retry: "Try again",
    loading: "Loading…",
    empty: "Nothing here yet",
    prev: "Previous",
    next: "Next",
    continue: "Continue",
    clear: "Clear",
    close: "Close",
    skip: "Skip",
    done: "Done",
  },
  support: {
    title: "This project is open source",
    body: "Natee is built in the open and free forever. If it helps you, a star on GitHub goes a long way — it is what keeps the project maintained.",
    star: "Star the repo",
    fork: "Fork it",
    later: "Maybe later",
    docked: "Support this project",
  },
  tour: {
    title: "What Natee gives you",
    step1Title: "Anime",
    step1Body: "Thousands of subtitled titles with a release schedule and several servers per episode.",
    step2Title: "Comics",
    step2Body: "Manga, manhwa, manhua and novels — with a built-in reader in strip or paged mode.",
    step3Title: "Movies & series",
    step3Body: "TMDB metadata, multiple players to switch between, and Letterboxd links.",
    step4Title: "Indonesian TV",
    step4Body: "Dozens of local channels streaming live, straight in the browser.",
    step5Title: "History & bookmarks",
    step5Body: "Kept on your own device. No account, no server.",
  },
};

const ja: Dictionary = {
  nav: {
    anime: "アニメ",
    comic: "マンガ",
    movie: "映画",
    tv: "ライブTV",
    bookmark: "ブックマーク",
    search: "検索",
    menu: "メニュー",
    ongoing: "放送中",
    completed: "放送終了",
    schedule: "放送スケジュール",
    genres: "ジャンル",
    directory: "A–Z 一覧",
    latest: "最新の更新",
    browse: "カタログを見る",
    novels: "小説",
    theme: "テーマ切替",
    language: "言語",
  },
  common: {
    seeAll: "すべて見る",
    home: "ホーム",
    back: "戻る",
    retry: "再試行",
    loading: "読み込み中…",
    empty: "データがありません",
    prev: "前へ",
    next: "次へ",
    continue: "続きから",
    clear: "クリア",
    close: "閉じる",
    skip: "スキップ",
    done: "完了",
  },
  support: {
    title: "このプロジェクトはオープンソースです",
    body: "Natee は公開開発で、ずっと無料です。役に立ったら GitHub でスターをいただけると、開発を続ける大きな力になります。",
    star: "スターを付ける",
    fork: "フォークする",
    later: "あとで",
    docked: "プロジェクトを支援",
  },
  tour: {
    title: "Natee でできること",
    step1Title: "アニメ",
    step1Body: "字幕付きの作品を多数収録。放送スケジュールと複数の再生サーバーに対応。",
    step2Title: "マンガ",
    step2Body: "マンガ・マンファ・マンフア・小説。縦スクロールとページ送りの両方に対応したビューア付き。",
    step3Title: "映画・ドラマ",
    step3Body: "TMDB のメタデータ、切り替え可能な複数プレーヤー、Letterboxd へのリンク。",
    step4Title: "インドネシアのTV",
    step4Body: "多数のローカル局をブラウザから直接ライブ視聴。",
    step5Title: "履歴とブックマーク",
    step5Body: "端末内に保存。アカウント不要、サーバー保存なし。",
  },
};

export const DICTIONARIES: Record<Locale, Dictionary> = { id, en, ja };

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}
