export type FishInfo = {
  label: string;
  displayName: string;
  peakSeason: string;
  additionalFact: string;
};

export const FISH_DATA: Record<string, FishInfo> = {
  barongoy: {
    label: 'barongoy',
    displayName: 'Barongoy',
    peakSeason: 'June-\nAugust',
    additionalFact:
      'Barongoy with a long, pointed snout are locally known as "Swasid."',
  },
  barunday: {
    label: 'barunday',
    displayName: 'Barunday',
    peakSeason: 'May-\nJuly',
    additionalFact:
      'Young Barunday are locally known as "Mangsi".',
  },
  borot: {
    label: 'borot',
    displayName: 'Borot',
    peakSeason: 'August-\nOctober',
    additionalFact:
      'Borot with a slender silver body, large eye, and a pointed snout is actually called "Borot-tibol".',
  },
  buraw: {
    label: 'buraw',
    displayName: 'Buraw',
    peakSeason: 'June-\nSeptember',
    additionalFact:
      'Buraw is often observed in nearshore fishing communities.',
  },
  tamarong: {
    label: 'tamarong',
    displayName: 'Tamarong',
    peakSeason: 'July-\nSeptember',
    additionalFact:
      'Tamarong with a long and beautifully curved tail are typically gay.',
  },
  tikab: {
    label: 'tikab',
    displayName: 'Tikab',
    peakSeason: 'July-\nSeptember',
    additionalFact:
      'Young Tikab are locally known as “Sipi-sipi”.',
  },
};