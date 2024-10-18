import { useContext, useState, useEffect, useRef, useCallback } from 'react';
import { OpenStreetMapProvider } from 'leaflet-geosearch';

import withModal from '../common/Modal';
import RequestRide from '../request-ride/RequestRide';

import Context from '../../context';

const AddressPicker = ({ toggleModal }) => {
    const [isFrom, setIsFrom] = useState(true);
    const [searchResults, setSearchResults] = useState([]);

    const {
        selectedFrom,
        setSelectedFrom,
        selectedTo,
        setSelectedTo,
        distance,
        setDistance,
    } = useContext(Context);

    const provider = useRef();
    const searchRef = useRef();

    useEffect(() => {
        initProvider();
    }, []);

    const shouldRequestDriver = useCallback(() => {
        if (selectedFrom && selectedTo) {
            calculateDistance(); // Calculate distance
            toggleModal(true);
        }
    }, [selectedFrom, selectedTo, toggleModal]);

    useEffect(() => {
        if (selectedFrom && selectedTo) {
            shouldRequestDriver();
        }
    }, [selectedFrom, selectedTo, shouldRequestDriver]);

    const onInputChanged = (e) => {
        const input = e.target.value;
        provider.current.search({ query: input }).then((results) => {
            setSearchResults(() => results);
        });
    };

    const initProvider = () => {
        provider.current = new OpenStreetMapProvider({
            params: {
                'accept-language': 'en',
                countrycodes: 'us',
            },
        });
    };

    const onLocationSelected = (selectedLocation) => {
        if (
            selectedLocation?.label &&
            selectedLocation?.x &&
            selectedLocation?.y
        ) {
            if (isFrom) {
                setSelectedFrom(() => selectedLocation);
                setIsFrom(() => false);
            } else {
                setSelectedTo(() => selectedLocation);
                setIsFrom(() => true);
            }
            setSearchResults(() => []);
            searchRef.current.value = '';
        }
    };

    // Haversine formula to calculate distance
    const calculateDistance = () => {
        const toRad = (value) => (value * Math.PI) / 180;

        const { y: lat1, x: lon1 } = selectedFrom;
        const { y: lat2, x: lon2 } = selectedTo;

        const R = 6371; // Radius of the Earth in kilometers
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) *
                Math.cos(toRad(lat2)) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c; // Distance in kilometers

        setDistance(() => distance.toFixed(2)); // Set the distance with 2 decimal places
    };

    return (
        <div className="address">
            <div className="address__title">
                <div className="address__title-container">
                    <p
                        className="address__title-from"
                        onClick={() => setIsFrom(true)}
                    >
                        {selectedFrom && selectedFrom.label
                            ? selectedFrom.label
                            : 'Pickup location ?'}
                    </p>
                    <p
                        className="address__title-to"
                        onClick={() => setIsFrom(false)}
                    >
                        {selectedTo && selectedTo.label
                            ? selectedTo.label
                            : 'Destination ?'}
                    </p>
                </div>
            </div>
            <div className="search">
                <input
                    className="search__input"
                    type="text"
                    placeholder={
                        isFrom
                            ? 'Add a pickup location'
                            : 'Enter your destination'
                    }
                    onChange={onInputChanged}
                    ref={searchRef}
                />
                <div className="search__result">
                    {searchResults &&
                        searchResults.length !== 0 &&
                        searchResults.map((result, index) => (
                            <div
                                className="search__result-item"
                                key={index}
                                onClick={() => onLocationSelected(result)}
                            >
                                <div className="search__result-icon">
                                    <svg
                                        title="LocationMarkerFilled"
                                        viewBox="0 0 24 24"
                                        className="g2 ec db"
                                    >
                                        <g transform="matrix( 1 0 0 1 2.524993896484375 1.0250244140625 )">
                                            <path
                                                fillRule="nonzero"
                                                clipRule="nonzero"
                                                d="M16.175 2.775C12.475 -0.925 6.475 -0.925 2.775 2.775C-0.925 6.475 -0.925 12.575 2.775 16.275L9.475 22.975L16.175 16.175C19.875 12.575 19.875 6.475 16.175 2.775ZM9.475 11.475C8.375 11.475 7.475 10.575 7.475 9.475C7.475 8.375 8.375 7.475 9.475 7.475C10.575 7.475 11.475 8.375 11.475 9.475C11.475 10.575 10.575 11.475 9.475 11.475Z"
                                                opacity="1"
                                            ></path>
                                        </g>
                                    </svg>
                                </div>
                                <p className="search__result-label">
                                    {result.label}
                                </p>
                            </div>
                        ))}
                </div>
            </div>
            {/* {distance && (
                <div className="distance">
                    <p>Distance: {distance} km</p>
                </div>
            )} */}
        </div>
    );
};

export default withModal(RequestRide)(AddressPicker);
