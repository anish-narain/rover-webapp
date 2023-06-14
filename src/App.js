import React, { useState, useEffect } from "react";
import "./App.css";
import Plot from 'react-plotly.js';

function App() {
  const [coordinates, setCoordinates] = useState([]);
  const [manualMode, setManualMode] = useState(false); // New state variable for manual mode
  const [mode, setMode] = useState('manual');
  //const [new_recalibrate, setRecalibrate] = useState("false"); // Initialize as boolean

  useEffect(() => {
    let interval;

    const fetchCoordinates = async () => {
      try {
        const response = await fetch("http://18.134.98.192:3001/numericalInput");
        const data = await response.json();
        console.log("coordinates: ", data.coordinates);
        setCoordinates(data.coordinates);
      } catch (error) {
        console.log("Error fetching coordinates:", error);
      }
    };

    const fetchData = () => {
      fetchCoordinates();
    };

    const startInterval = () => {
      interval = setInterval(fetchData, 1000); // Fetch coordinates every second
    };

    const stopInterval = () => {
      clearInterval(interval);
    };

    fetchData();

    fetch('http://18.134.98.192:3001/setManualMode', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ mode }),
    })
      .then((response) => {
        // Handle the response from the server if needed
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    startInterval();

    return () => {
      stopInterval();
    };
  }, [mode]);

  const handleMvmtClick = async (direction) => {
    await fetch('http://18.134.98.192:3001/mvmtClickPost', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ direction }),
    });
    // Handle the response from the server if needed

    // Auto-refresh the page after the movement click
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };
  
  const sendRecalibrateStatus = (status) => {
    fetch('http://18.134.98.192:3001/recalibratePost', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ new_recalibrate: status }),
    })
      .then((response) => {
        // Handle the response from the server if needed
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };
  
  const handleRecalibrateClick = () => {
    sendRecalibrateStatus('true');
  };
  
  // Call sendRecalibrateStatus with 'true' initially
  sendRecalibrateStatus('true');
  
  // Call sendRecalibrateStatus with 'false' every 1 second to reset the recalibrate status
  setInterval(() => {
    sendRecalibrateStatus('false');
  }, 1000);
  
  
  const handleModeChange = () => {
    setMode(manualMode ? 'automatic' : 'manual');
    setManualMode(!manualMode);
  };

  const combinedCoordinates = coordinates.map((coordinate) => ({
    x: coordinate.x,
    y: coordinate.y,
  }));

  return (
    <div className="App">
      <h1 className="title">EE Maze Mapper!</h1>
      <div className="coordinate-container">
        {/* Origin */}
        <div className="origin"></div>
        {/* Coordinates */}
        {coordinates.map((coordinate, index) => (
          <div
            key={index}
            className="coordinate-dot"
            style={{ left: coordinate.x, top: coordinate.y }}
          ></div>
        ))}
      </div>
      <div className="button-container">
        <div className="button-row" style={{ marginTop: "10px" }} >
          <button onClick={() => handleMvmtClick("Up")} className="button">
            Up
          </button>
        </div>
        <div className="button-row" style={{ marginLeft: "10px"  }}>
          <button onClick={() => handleMvmtClick("Left")} className="button">
            Left
          </button>
          <button onClick={() => handleMvmtClick("Stop")} className="button"  >
            Stop
          </button>
          <button onClick={() => handleMvmtClick("Right")} className="button" style={{ marginTop: "10px" }}>
            Right
          </button>
        </div>
        <div className="button-row">
          <button onClick={() => handleMvmtClick("Down")} className="button" style={{ marginTop: "10px" }}>
            Down
          </button>
        </div>
      </div>
      <div className="mode-container"> 
        <button onClick={handleModeChange} style={{ marginTop: "20px" }}>
          {manualMode ? "Switch to Automatic Mode" : "Switch to Manual Mode"}
        </button>
      </div>
      <div className="button-row">
        <button onClick={handleRecalibrateClick} style={{ marginTop: "20px" }}>
          Recalibrate
        </button>
      </div>
      <div>
        <Plot
          data={[
            {
              x: combinedCoordinates.map((coordinate) => coordinate.x),
              y: combinedCoordinates.map((coordinate) => coordinate.y),
              type: "scatter",
              mode: "markers",
              marker: { color: "blue" },
              name: "Coordinate System 2",
            },
          ]}
          layout={{
            width: 800,
            height: 400,
            title: "Combined Coordinate System",
            xaxis: {
              scaleanchor: "y",
              scaleratio: 1,
            },
            yaxis: {
              scaleanchor: "x",
              scaleratio: 1,
            },
          }}
        />
      </div>
    </div>
  );
}

export default App;
