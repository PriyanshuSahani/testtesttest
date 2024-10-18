import React, { useContext, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import * as firebaseService from '../../services/firebase';
import * as uiService from '../../services/ui';

import Context from '../../context';
import './request-ride.css';

const RequestRide = ({ toggleModal }) => {
    const {
        user,
        selectedFrom,
        selectedTo,
        distance,
        setRideRequest,
        setCurrentRide,
        setPrice,
        setRideStatus,
    } = useContext(Context); // Get distance from context
    const [id, setID] = useState();
    const [rideDetail, setRideDetail] = useState({ name: '', price: 0 });
    const [loading, setLoading] = useState(false);
    const [showcards, setShowCards] = useState(true);
    const requestRide = async () => {
        if (user && selectedFrom && selectedTo) {
            // toggleModal(false);
            // uiService.showLoading();
            // setLoading(true);
            const rideUuid = uuidv4();
            setID(rideUuid);
            const ride = {
                rideUuid: rideUuid,
                requestor: user,
                pickup: selectedFrom,
                destination: selectedTo,
                status: 'waiting',
                rideName: rideDetail.name,
                price: rideDetail.price, // Calculate price based on distance
            };
            setPrice(rideDetail.price);
            setRideStatus('waiting');
            try {
                await firebaseService.insert({
                    key: 'rides',
                    id: rideUuid,
                    payload: ride,
                });
                setRideRequest(ride);
                // uiService.hideLoading();
                // setLoading(false);
            } catch (error) {
                // setLoading(false);
            }
        }
    };
    const data = [
        {
            id: 1,
            name: 'Car',
            imageURL:
                'https://mobile-content.uber.com/launch-experience/ride.png',
            price: distance * 1.1,
        },
        {
            id: 2,
            name: 'Mini Truck',
            imageURL:
                'https://www.mahindrasupromaxitruck.com/images/new-profittruck/gallery/photos/mini/supro-mini-truck-side-view.png',
            price: distance * 1.3,
        },
        {
            id: 3,
            name: 'Truck',
            imageURL:
                'https://www.shutterstock.com/image-vector/white-box-truck-cargo-delivery-260nw-2176174231.jpg',
            price: distance * 1.5,
        },
    ];

    const [selectedRide, setSelectedRide] = useState(1);
    const handleRideSelect = (id, name, price) => {
        setSelectedRide(id);
        setRideDetail({ name, price });
    };
    const cancel = async () => {
        uiService.showLoading();
        try {
            await firebaseService.update({
                key: 'rides',
                id,
                payload: { status: 'canceled' },
            });
        } catch (error) {
            uiService.hideLoading();
        }
        uiService.hideLoading();
        removeRide();
    };
    const removeRide = () => {
        localStorage.removeItem('currentRide');
        setCurrentRide(null);
        window.location.reload();
    };
    const handleCancel = () => {
        const isCancel = window.confirm('Do you want to cancel this ride?');
        if (isCancel) {
            cancel();
        }
    };

    return (
        <div className="request-ride">
            <div className="request-ride__content">
                <div className="request-ride__container">
                    <div className="request-ride__title">Requesting a Ride</div>
                    <div className="request-ride__close">
                        <img
                            alt="close"
                            onClick={() => toggleModal(false)}
                            src="https://static.xx.fbcdn.net/rsrc.php/v3/y2/r/__geKiQnSG-.png"
                        />
                    </div>
                </div>
                <div className="request-ride__details">
                    <p>Pickup: {selectedFrom?.label}</p>
                    <p>Destination: {selectedTo?.label}</p>
                    <p>Distance: {distance} km</p> {/* Display distance */}
                </div>
                {showcards ? (
                    <div className="ride-options-container">
                        {data.map((card) => (
                            <div
                                className="ride-card"
                                key={card.id}
                                onClick={() =>
                                    handleRideSelect(
                                        card.id,
                                        card.name,
                                        card.price
                                    )
                                }
                                style={
                                    selectedRide === card.id
                                        ? { backgroundColor: 'grey' }
                                        : {}
                                }
                            >
                                <div className="left-continer">
                                    <div className="image-container">
                                        <img src={card.imageURL} alt="" />
                                    </div>
                                    <div>
                                        <div className="ride-name">
                                            {card.name}
                                        </div>
                                        <div className="eta">12:45</div>
                                    </div>
                                </div>
                                <div className="price-card">{card.price}</div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div>
                        <div>Price : {rideDetail.price}</div>
                        <div>Type : {rideDetail.name}</div>
                    </div>
                )}
                {loading ? (
                    <>
                        <div>Searching for a Driver...</div>
                        <button onClick={handleCancel}>Cancel</button>
                    </>
                ) : (
                    <div className="request-ride__button">
                        <button
                            onClick={() => {
                                uiService.hideLoading();
                                setShowCards(false);
                                setLoading(true);
                                requestRide();
                            }}
                        >
                            Confirm Request
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RequestRide;
