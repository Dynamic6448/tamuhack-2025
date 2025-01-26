import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home';
import MenuPage from './pages/Menu';
import PSAPage from './pages/PSA';

export const App: React.FC = () => {
    const [isOn, setIsOn] = useState<boolean>(false);
    const eventSourceRef = useRef<EventSource | null>(null);

    // Initialize SSE connection
    useEffect(() => {
        // Create an EventSource that connects to your SSE endpoint
        const es = new EventSource('http://192.168.253.26:5000/events');

        // Listen for switch changes
        es.addEventListener('switch', (evt) => {
            console.log('Switch SSE:', evt.data);
            // The Flask code sends True/False (as a string)
            setIsOn(evt.data === 'True');
        });

        // Handle errors
        es.onerror = (err) => {
            console.error('SSE error:', err);
            // Optionally handle reconnection or close
        };

        // Store the instance in a ref so we can close later
        eventSourceRef.current = es;

        // Cleanup on unmount
        return () => {
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
            }
        };
    }, []);

    useEffect(() => {
        console.log(isOn);
    }, [isOn]);

    return (
        <Router>
            {isOn && <PSAPage />}
            <Routes>
                {/* Default route for HomePage */}
                <Route path="/" element={<HomePage />} />

                {/* Route for the Menu page */}
                <Route path="/menu" element={<MenuPage />} />
            </Routes>
        </Router>
    );
};

export default App;
