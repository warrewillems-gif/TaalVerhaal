import {
  coverVosje,
  iconSun,
  iconKnife,
  iconOven,
  iconBread,
  coverPingu,
  iconTowel,
  iconUmbrella,
  iconSunglasses,
  iconCrab,
} from "./assets";

const base = import.meta.env.BASE_URL;

export interface Track {
  id: number;
  title: string;
  duration: string;
  disabled: boolean;
  icon: string;
  color: string;
  activeBg: string;
  activeShadow: string;
  progressColor: string;
  // Path relative to the public/ folder, e.g. /audio/vosje-bakt-brood/01-de-zonnige-ochtend.mp3
  audioSrc: string;
  // Keyboard key that triggers this track on the story detail page
  keyBinding: string;
}

export interface Story {
  id: string;
  title: string;
  titleArabic?: string;
  titleSecondary?: string;
  subtitle: string;
  description: string;
  language: string;
  image: string;
  emoji: string;
  tracks: Track[];
}

export const stories: Story[] = [
  {
    id: "vosje-bakt-brood",
    title: "Vosje Bakt Brood",
    titleArabic: "الذئب الصغير يخبز الخبز",
    subtitle: "Een lekker bakkersavontuur!",
    description:
      "Lees het verhaal over vosje die een heerlijk brood bakt!",
    language: "Arabisch → Nederlands",
    image: coverVosje,
    emoji: "🦊",
    tracks: [
      {
        id: 1,
        title: "Pagina 1",
        duration: "0:16",
        disabled: false,
        icon: iconSun,
        color: "#e8dcc8",
        activeBg: "#e8dcc8",
        activeShadow: "#b5a48a",
        progressColor: "from-amber-300 to-yellow-200",
        audioSrc: `${base}audio/vosje-bakt-brood/vosje-bakt-brood-pagina1.m4a`,
        keyBinding: "z",
      },
      {
        id: 2,
        title: "Pagina 2",
        duration: "0:18",
        disabled: false,
        icon: iconBread,
        color: "#c47c2b",
        activeBg: "#a0621e",
        activeShadow: "#7c4a14",
        progressColor: "from-yellow-600 to-amber-400",
        audioSrc: `${base}audio/vosje-bakt-brood/vosje-bakt-brood-pagina2.m4a`,
        keyBinding: "q",
      },
      {
        id: 3,
        title: "Pagina 3",
        duration: "0:10",
        disabled: false,
        icon: iconOven,
        color: "#e07b8e",
        activeBg: "#be5a6e",
        activeShadow: "#9d3a4e",
        progressColor: "from-rose-400 to-pink-300",
        audioSrc: `${base}audio/vosje-bakt-brood/vosje-bakt-brood-pagina3.m4a`,
        keyBinding: "s",
      },
      {
        id: 4,
        title: "Pagina 4",
        duration: "0:15",
        disabled: false,
        icon: iconKnife,
        color: "#d97706",
        activeBg: "#b45309",
        activeShadow: "#92400e",
        progressColor: "from-amber-500 to-orange-400",
        audioSrc: `${base}audio/vosje-bakt-brood/vosje-bakt-brood-pagina4.m4a`,
        keyBinding: "d",
      },
    ],
  },
  {
    id: "pingu-op-het-strand",
    title: "Pingu op het Strand",
    titleSecondary: "Plajda Pingu",
    subtitle: "Een zonnig strandavontuur!",
    description:
      "Lees het verhaal over Pingu die een mooie stranddag beleeft!",
    language: "Turks → Nederlands",
    image: coverPingu,
    emoji: "🐧",
    tracks: [
      {
        id: 1,
        title: "Pagina 1",
        duration: "0:21",
        disabled: false,
        icon: iconUmbrella,
        color: "#f59e0b",
        activeBg: "#d97706",
        activeShadow: "#92400e",
        progressColor: "from-yellow-400 to-amber-300",
        audioSrc: `${base}audio/pingu-op-het-strand/pingu-op-het-strand-pagina1.m4a`,
        keyBinding: "z",
      },
      {
        id: 2,
        title: "Pagina 2",
        duration: "0:25",
        disabled: false,
        icon: iconSunglasses,
        color: "#1d4ed8",
        activeBg: "#1e40af",
        activeShadow: "#1e3a8a",
        progressColor: "from-blue-400 to-sky-300",
        audioSrc: `${base}audio/pingu-op-het-strand/pingu-op-het-strand-pagina2.m4a`,
        keyBinding: "q",
      },
      {
        id: 3,
        title: "Pagina 3",
        duration: "0:25",
        disabled: false,
        icon: iconCrab,
        color: "#ef4444",
        activeBg: "#dc2626",
        activeShadow: "#991b1b",
        progressColor: "from-red-400 to-orange-400",
        audioSrc: `${base}audio/pingu-op-het-strand/pingu-op-het-strand-pagina3.m4a`,
        keyBinding: "s",
      },
      {
        id: 4,
        title: "Pagina 4",
        duration: "0:22",
        disabled: false,
        icon: iconTowel,
        color: "#e8dcc8",
        activeBg: "#d4c4a8",
        activeShadow: "#b5a48a",
        progressColor: "from-yellow-200 to-amber-100",
        audioSrc: `${base}audio/pingu-op-het-strand/pingu-op-het-strand-pagina4.m4a`,
        keyBinding: "d",
      },
    ],
  },
];