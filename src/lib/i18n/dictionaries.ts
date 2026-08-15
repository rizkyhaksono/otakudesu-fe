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
    radio: "Radio",
    news: "Berita",
    more: "Lainnya",
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
    skipToContent: "Lompat ke konten",
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
    title: "Panduan",
    goThere: "Buka sekarang",
    replay: "Lihat panduan lagi",
    introTitle: "Selamat datang di Natee",
    introBody:
      "Satu tempat untuk anime, komik, film, TV dan radio Indonesia. Panduan singkat ini menunjukkan letak tiap fitur — sekitar 30 detik.",
    animeTitle: "Menu Anime",
    animeBody:
      "Sedang tayang, sudah tamat, jadwal rilis, genre dan daftar A–Z. Tiap episode punya beberapa server, jadi kalau satu mati tinggal ganti.",
    comicTitle: "Menu Komik",
    comicBody:
      "Manga, manhwa, manhua dan novel. Pembaca bawaan punya mode gulir dan halaman, plus penanda chapter yang sudah dibaca.",
    movieTitle: "Menu Film",
    movieBody:
      "Metadata dari TMDB dengan beberapa pemutar yang bisa ditukar, plus tautan Letterboxd untuk yang suka mencatat tontonan.",
    moreTitle: "TV, Radio & Berita",
    moreBody:
      "Siaran TV Indonesia, ratusan stasiun radio lokal, dan berita anime terbaru — semuanya ada di menu ini.",
    searchTitle: "Pencarian",
    searchBody:
      "Cari judul apa pun dari sini. Bisa juga dibuka dengan pintasan keyboard tanpa menyentuh mouse.",
    bookmarkTitle: "Bookmark & riwayat",
    bookmarkBody:
      "Tandai judul favorit dan lanjutkan tontonan terakhir. Semua tersimpan di perangkatmu sendiri — tanpa akun, tanpa server.",
    languageTitle: "Bahasa & tema",
    languageBody:
      "Ganti bahasa antara Indonesia, Inggris dan Jepang, atau tukar tema terang dan gelap.",
    outroTitle: "Selesai",
    outroBody:
      "Panduan ini bisa dibuka lagi kapan saja lewat tautan Panduan di bagian bawah halaman. Natee open source — bintang di GitHub sangat membantu.",
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
    radio: "Radio",
    news: "News",
    more: "More",
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
    skipToContent: "Skip to content",
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
    title: "Tour",
    goThere: "Open it now",
    replay: "Replay the tour",
    introTitle: "Welcome to Natee",
    introBody:
      "One place for anime, comics, films, Indonesian TV and radio. This short tour shows where everything lives — about 30 seconds.",
    animeTitle: "The Anime menu",
    animeBody:
      "Currently airing, finished, the release schedule, genres and the A–Z directory. Every episode has several servers, so a dead one is just a click away from a working one.",
    comicTitle: "The Comics menu",
    comicBody:
      "Manga, manhwa, manhua and novels. The built-in reader does strip and paged modes, and marks the chapters you have already read.",
    movieTitle: "The Movies menu",
    movieBody:
      "TMDB metadata with several interchangeable players, plus Letterboxd links if you keep a watch log.",
    moreTitle: "TV, Radio & News",
    moreBody:
      "Indonesian live TV, hundreds of local radio stations, and the latest anime news all sit under this menu.",
    searchTitle: "Search",
    searchBody: "Find any title from here. It also opens with a keyboard shortcut, no mouse needed.",
    bookmarkTitle: "Bookmarks & history",
    bookmarkBody:
      "Save what you like and pick up where you left off. It is all kept on your own device — no account, no server.",
    languageTitle: "Language & theme",
    languageBody: "Switch between Indonesian, English and Japanese, or flip between light and dark.",
    outroTitle: "That's it",
    outroBody:
      "You can replay this any time from the Tour link in the footer. Natee is open source — a star on GitHub genuinely helps.",
  },
};

const ja: Dictionary = {
  nav: {
    anime: "アニメ",
    comic: "マンガ",
    movie: "映画",
    tv: "ライブTV",
    radio: "ラジオ",
    news: "ニュース",
    more: "その他",
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
    skipToContent: "本文へスキップ",
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
    title: "ガイド",
    goThere: "開く",
    replay: "ガイドをもう一度見る",
    introTitle: "Natee へようこそ",
    introBody:
      "アニメ・マンガ・映画・インドネシアのTVとラジオがひとつに。この短いガイドで各機能の場所を確認できます（約30秒）。",
    animeTitle: "アニメメニュー",
    animeBody:
      "放送中・放送終了・スケジュール・ジャンル・A–Z 一覧。各話に複数のサーバーがあるので、繋がらないときは切り替えられます。",
    comicTitle: "マンガメニュー",
    comicBody:
      "マンガ・マンファ・マンフア・小説。内蔵ビューアは縦スクロールとページ送りに対応し、既読の話数も記録します。",
    movieTitle: "映画メニュー",
    movieBody:
      "TMDB のメタデータと切り替え可能な複数プレーヤー、さらに Letterboxd へのリンク。",
    moreTitle: "TV・ラジオ・ニュース",
    moreBody:
      "インドネシアのライブTV、数百のローカルラジオ局、最新のアニメニュースはこのメニューにあります。",
    searchTitle: "検索",
    searchBody: "ここから作品を検索できます。キーボードショートカットでも開けます。",
    bookmarkTitle: "ブックマークと履歴",
    bookmarkBody:
      "お気に入りを保存し、続きから再生できます。すべて端末内に保存され、アカウントもサーバーも不要です。",
    languageTitle: "言語とテーマ",
    languageBody: "インドネシア語・英語・日本語の切り替え、ライト／ダークテーマの切り替えができます。",
    outroTitle: "以上です",
    outroBody:
      "このガイドはフッターの「ガイド」からいつでも再生できます。Natee はオープンソースです — GitHub のスターが励みになります。",
  },
};

export const DICTIONARIES: Record<Locale, Dictionary> = { id, en, ja };

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}
