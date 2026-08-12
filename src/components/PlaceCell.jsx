function PlaceCell({ id, type, status, vehicule = null, onSortie }) {
    const isOccupied = status === 'occupe';
    const tempsRestant = vehicule?.tempsRestant || 0;
    const depasse = vehicule?.depasse || false;

    const getStatusClasses = () => {
        if (isOccupied) {
            return 'border-2 border-gray-300 relative';
        }
        return 'bg-white border-2 border-gray-300 hover:border-gray-500';
    };

    // Style pour l'image de fond de la voiture
    const getBackgroundStyle = () => {
        if (isOccupied) {
            const isCivil = type === 'civil';
            // Civil: Noir (#1a1a1a) | VIP: Or (#D4AF37)
            const carIcon = isCivil
                ? "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%231a1a1a'%3E%3Cpath d='M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z'/%3E%3C/svg%3E"
                : "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23D4AF37'%3E%3Cpath d='M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z'/%3E%3C/svg%3E";

            return {
                backgroundImage: `url("${carIcon}")`,
                backgroundSize: '55%',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundColor: 'transparent',
            };
        }
        return {
            backgroundColor: 'white',
        };
    };

    // Couleur du texte : Noir tirant sur le gris
    const getTextColor = () => {
        return 'text-gray-700'; // Noir tirant sur le gris
    };

    const getStatusText = () => {
        if (isOccupied) return 'Occupée';
        return 'Libre';
    };

    // Point
    const getStatusIcon = () => {
        if (isOccupied) {
            return <span className="text-red-500 text-2xl font-bold">●</span>;
        }
        return <span className="text-green-500 text-2xl font-bold">●</span>;
    };

    const placeName = type === 'civil' ? `C${id + 1}` : `V${id + 1}`;

    return (
        <div
            className={`
        ${getStatusClasses()}
        rounded-lg p-3 text-center transition-all duration-300 shadow-sm hover:shadow-md
        relative min-h-[120px] flex flex-col items-center
      `}
            style={getBackgroundStyle()}
        >
            {/* Contenu */}
            <div className="relative z-10 w-full h-full flex flex-col items-center justify-between">
                {/* Nom de la place - EN HAUT, petit et gras */}
                <div className={`text-sm font-extrabold ${getTextColor()} self-start`}>
                    {placeName}
                </div>

                {/* Espace pour la voiture (image de fond) */}
                <div className="flex-1"></div>

                {/* Détails - EN BAS */}
                <div className="flex flex-col items-center">
                    {/* Point + Statut */}
                    <div className={`text-sm mt-1 flex items-center gap-2 font-bold ${getTextColor()}`}>
                        {getStatusIcon()}
                        <span className="text-sm font-bold">{getStatusText()}</span>
                    </div>

                    {/* Temps */}
                    {isOccupied && vehicule && (
                        <div className={`text-xs mt-1 space-y-0.5 font-bold ${getTextColor()}`}>
                            <div className="font-bold">
                                {vehicule.tempsEcoule}h
                            </div>
                            {!depasse ? (
                                <div className={`font-bold ${getTextColor()}`}>
                                    {vehicule.tempsRestant}h restant
                                </div>
                            ) : (
                                <div className="text-red-500 font-bold animate-pulse">
                                    ⚠️ DÉPASSÉ
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {isOccupied && (
                <button
                    onClick={() => onSortie(type, id)}
                    className="absolute -top-2 -right-2 bg-gray-200 text-black rounded-full w-7 h-7 flex items-center justify-center hover:bg-gray-300 transition-colors shadow-sm text-sm font-bold z-20"
                    title="Sortir ce véhicule"
                >
                    ✕
                </button>
            )}
        </div>
    );
}

export default PlaceCell;