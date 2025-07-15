import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Box, Button } from '@mui/material'; // Assuming you're using Material-UI
import PropertiesDialog from './PropertiesDialog'; // Adjust the import based on your file structure
import { styled } from '@mui/system';

const StyledButton = styled(Button)(({ theme }) => ({
    marginTop: theme.spacing(4),
    backgroundColor: '#1976d2',
    color: 'white',
    '&:hover': {
        backgroundColor: '#1565c0',
    },
}));

const MyMapComponent = ({ handleOpenPopup, handleClosePopup, openPopup }) => {
    const mapRef = useRef(null);
    const [properties, setProperties] = useState([]);

    // Memoize the properties array to prevent unnecessary re-renders
    const memoizedProperties = useMemo(() => {
        return properties.map((point) => ({
            ...point,
            position: [point.location.coordinates[1], point.location.coordinates[0]],
        }));
    }, [properties]); // Only recompute if `properties` changes

    const handleMapCreated = () => {
        console.log('Map has been created');
    };

    const MapLayer = ({ setProperties }) => {
        const map = useMap();

        useEffect(() => {
            const drawnItems = new L.FeatureGroup();
            map.addLayer(drawnItems);

            const drawControl = new L.Control.Draw({
                draw: {
                    polygon: true,
                    rectangle: true,
                    circle: false,
                    polyline: false,
                },
                edit: {
                    featureGroup: drawnItems,
                    remove: true,
                },
                maxFeatures: 1,
            });

            map.addControl(drawControl);

            map.on("draw:created", (e) => {
                if (e.layerType == 'polygon') {
                    performAPICallForPolygonSearch(e);
                } else {
                    performAPICallSearch(e);
                }
            });

            map.on("draw:edited", function (e) {
                if (e.layerType == 'polygon') {
                    performAPICallForPolygonSearch(e);
                } else {
                    performAPICallSearch(e);
                }
            });


            function performAPICallForPolygonSearch(e) {

                const backendCoordinates = e.layer.editing.latlngs[0][0].map(latLng => [latLng.lng, latLng.lat]);

                fetch('http://localhost:8080/ukie/getPropertiesByPolygonSearch', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        polygon: backendCoordinates.map(coords => ({ // Format as GeoJSON
                            type: "Point",
                            coordinates: coords
                        }))
                    }),
                })
                    .then((response) => response.json())
                    .then((data) => {
                        setProperties(data);
                    })
                    .catch((error) => console.error("Error calling API:", error));
            }

            function performAPICallSearch(e) {
                const layer = e.layer;
                drawnItems.addLayer(layer);
                let northEast, southWest;

                if (typeof layer.getBounds() === "object") {
                    northEast = layer.getBounds().getNorthEast();
                    southWest = layer.getBounds().getSouthWest();
                } else {
                    northEast = { lat: layer._latlng.lat, lng: layer._latlng.lng };
                    southWest = { lat: layer._latlng.lat, lng: layer._latlng.lng };
                }

                // Example API call using bounding box coordinates
                fetch("http://localhost:8080/ukie/getPropertiesByLatLong", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        northEastLat: northEast.lat,
                        northEastLng: northEast.lng,
                        southWestLat: southWest.lat,
                        southWestLng: southWest.lng,
                    }),
                })
                    .then((response) => response.json())
                    .then((data) => {
                        setProperties(data); // Only update when necessary
                    })
                    .catch((error) => console.error("Error calling API:", error));
            }

            map.on("draw:deleted", function () {
                setProperties([]); // Reset properties when layers are deleted
            });

            // Cleanup Leaflet Draw resources when the component unmounts
            return () => {
                map.removeControl(drawControl);
                map.removeLayer(drawnItems);
            };
        }, [map, setProperties]);

        return null;
    };

    return (
        <>
            <MapContainer
                center={[53.3810, -6.5900]}
                zoom={13}
                style={{ height: "450px", width: "100%", borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }} // Add borderRadius and shadow
                whenReady={handleMapCreated}
                ref={mapRef}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {memoizedProperties.map((point, index) => (
                    <Marker key={index} position={point.position}>
                        <Popup>
                            Address - {point.address}
                            <br />
                            Price - {point.price}
                            <br />
                            URL - <a href={point.seoUrl} target="_blank" rel="noopener noreferrer">{point.seoUrl}</a>
                        </Popup>
                    </Marker>
                ))}
                <MapLayer setProperties={setProperties} />
            </MapContainer>
            {properties.length > 0 && (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%',
                    }}
                >
                    <StyledButton variant="contained" onClick={handleOpenPopup}>
                        List Results
                    </StyledButton>
                </Box>
            )}
            <PropertiesDialog properties={properties} handleClosePopup={handleClosePopup} openPopup={openPopup} />
        </>
    );
};

export default React.memo(MyMapComponent); // Memoize the entire component