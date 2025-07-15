"use client";
import { useEffect, useState, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-draw";
import MyMapComponent from "./MyMapComponent";

const initializeDefaultIcon = () => {
    const defaultIcon = new L.Icon({
        iconUrl: require('leaflet/dist/images/marker-icon.png'),
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
        shadowSize: [41, 41],
    });

    L.Marker.prototype.options.icon = defaultIcon;
};

const Map = () => {
    const [openPopup, setOpenPopup] = useState(false);

    const handleOpenPopup = () => {
        setOpenPopup(true);
    };
    const handleClosePopup = () => {
        setOpenPopup(false);
    };

    useEffect(() => {
        initializeDefaultIcon();
    }, []);

    return (
        <>
            <MyMapComponent handleOpenPopup={handleOpenPopup} handleClosePopup={handleClosePopup} openPopup={openPopup} />
        </>
    );
};

export default Map;
