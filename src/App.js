import React, { useState, useEffect } from "react";
import "./App.css";
import Plot from 'react-plotly.js';

import mazerunnerImage from './mazerunner.png'; // Import the image

function App() {
  const [coordinates, setCoordinates] = useState([]);
  const [recalibrate_output, setrecalibrateOutput] = useState([]);
  const [manualMode, setManualMode] = useState(false); // New state variable for manual mode
  const [mode, setMode] = useState('manual');
  const [new_recalibrate, setNewRecalibrate] = useState(''); // Declare new_recalibrate state variable
  
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
    

    const fetchrecalibrateOutput = async () => {
      try {
        const response = await fetch("http://18.134.98.192:3001/recalibrateOutput");
        const data = await response.json();
        console.log("recalibrateOutput: ", data.recalibrate_output);
        setrecalibrateOutput(data.recalibrate_output);
      } catch (error) {
        console.log("Error fetching recalibrateOutput:", error);
      }
    };

    const fetchData = () => {
      fetchCoordinates();
      fetchrecalibrateOutput();
    };

    const startInterval = () => {
      interval = setInterval(fetchData, 1000); // Fetch coordinates and recalibrate output every second
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
 

  const sendRecalibrateStatus = async (new_recalibrate) => {
    await fetch('http://18.134.98.192:3001/recalibratePost', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ new_recalibrate }),
    });
    setNewRecalibrate(new_recalibrate); // Update new_recalibrate state
  };

  const sendBeaconStatus = async (new_beacon) => {
    await fetch('http://18.134.98.192:3001/beaconPost', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ new_beacon }),
    });
    setNewRecalibrate(new_beacon); // Update new_recalibrate state
  };

  const sendCompleteStatus = async (new_complete) => {
    await fetch('http://18.134.98.192:3001/completePost', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ new_complete }),
    });
    setNewRecalibrate(new_complete); // Update new_recalibrate state
  };

  const sendStopLeftStatus = async(new_stopleft) => {
    fetch('http://18.134.98.192:3001/stopleftPost', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ new_stopleft}),
    })
  };
  

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
      <div className="title">
        <img className="logo shifted" src={mazerunnerImage} alt="Maze Runner" />
      </div>
      <div className="container">
        <div className="left-column">
          <div style={{ marginTop: "20px" }}>
          <Plot
            data={[
              {
                x: combinedCoordinates.map((coordinate) => coordinate.x),
                y: combinedCoordinates.map((coordinate) => coordinate.y),
                type: "scatter",
                mode: "markers",
                marker: { color: "blue" }, // Set dot color to white
                name: "Coordinate System 2",
              },
            ]}
            layout={{
              width: "100%",
              height: "100%",
              title: "Combined Coordinate System",
              plot_bgcolor: "black", // Set black background color
              paper_bgcolor: "black", // Set black background color for the entire plot area
              font: {  family: 'Andale Mono, monospace', // Add the desired font family
                color: "white" }, // Set white text color
              xaxis: {
                scaleanchor: "y",
                scaleratio: 1,
                color: "white", // Set white color for x-axis line
                gridcolor: "white", // Set white color for x-axis grid lines
                title: {
                  text: "X Axis",
                  font: { color: "white" }, // Set white color for x-axis title text
                },
              },
              yaxis: {
                scaleanchor: "x",
                scaleratio: 1,
                color: "white", // Set white color for y-axis line
                gridcolor: "white", // Set white color for y-axis grid lines
                title: {
                  text: "Y Axis",
                  font: { color: "white" }, // Set white color for y-axis title text
                },
              },
            }}
          />

          </div>
        </div>
        <div className="right-column">
        <div className="box">
        <div className="button-container">
          <div className="button-row">
            <button onClick={() => sendRecalibrateStatus("true")}>
              Recalibrate
            </button>
          </div>
          <div className="button-row">
            <button onClick={() => sendStopLeftStatus("true")}>
              StopLeft
            </button>
          </div>
          <div className="button-row">
            <button onClick={() => sendBeaconStatus("true")}>
              Beacon
            </button>
            </div>
            <div className="button-row">
            <button onClick={() => sendCompleteStatus("true")}>
              Complete
            </button>
            </div>
        </div>
      </div>
      <div className="box">
        <div className="text-container">
          <div className="text-line">
            Recalibrate Output: {recalibrate_output}
          </div>
          <div className="text-line">
            New Recalibrate: {new_recalibrate}
          </div>
        </div>
      </div>
      <div className="box">
        <div className="button-container">
          <div className="button-row">
            <button onClick={() => handleMvmtClick("Up")} className="button">
              Up
            </button>
          </div>
          <div className="button-row">
            <button onClick={() => handleMvmtClick("Left")} className="button">
              Left
            </button>
            <button onClick={() => handleMvmtClick("Stop")} className="button">
              Stop
            </button>
            <button onClick={() => handleMvmtClick("Right")} className="button">
              Right
            </button>
          </div>
          <div className="button-row">
            <button onClick={() => handleMvmtClick("Down")} className="button">
              Down
            </button>
          </div>
          <div className="mode-container">
            <button onClick={handleModeChange}>
              {manualMode ? "Switch to Automatic Mode" : "Switch to Manual Mode"}
            </button>
          </div>
        </div>
      </div>
      
    </div>
  </div>
</div>
  );
  
  }
    
  
  
export default App;
