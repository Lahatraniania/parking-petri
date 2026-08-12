export const STATUS = {
    LIBRE: 'libre',
    OCCUPE: 'occupe',
    RESERVE: 'reserve'
};

export const COLORS = {
    [STATUS.LIBRE]: 'bg-white border-2 border-gray-300 text-black',
    [STATUS.OCCUPE]: 'bg-black text-white',
    [STATUS.RESERVE]: 'bg-gray-400 text-white'
};

export const LABELS = {
    [STATUS.LIBRE]: 'Libre',
    [STATUS.OCCUPE]: 'Occupé',
    [STATUS.RESERVE]: 'Réservé'
};

export const DUREE_MAX = {
    civil: 8,
    vip: 10
};