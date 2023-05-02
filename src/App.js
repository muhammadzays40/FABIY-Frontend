import "./App.css";
import React, { useRef, useEffect, useState } from "react";

function App() {
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const startDrawing = (event) => {
    if (event.button !== 0) {
      return; // Only draw on left mouse button
    }
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.beginPath();
    context.moveTo(event.nativeEvent.offsetX, event.nativeEvent.offsetY);
    isDrawing.current = true;
  };

  const draw = (event) => {
    if (!isDrawing.current) {
      return;
    }
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.strokeStyle = "black";
    context.lineWidth = 1;
    context.lineTo(event.nativeEvent.offsetX, event.nativeEvent.offsetY);
    context.stroke();
  };

  const stopDrawing = () => {
    isDrawing.current = false;
  };

  const resetCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);
  };

  function handleSubmit(event) {
    event.preventDefault();

    const canvas = document.getElementById("myCanvas");
    canvas.toBlob((blob) => {
      const formData = new FormData();
      formData.append("image", blob, "image.png");

      fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.blob())
        .then((blob) => {
          const url = URL.createObjectURL(blob);
          setImageUrl(url);
          console.log(imageUrl)
        })
        .catch((error) => console.error(error));
    });
  }

  return (
    <div>
      <header>
        <div className="headingg">
          <h1 className="mHeading">FABIY</h1>
        </div>
      </header>
      <div className="App">
        <div className="formInputImage">
          <form onSubmit={handleSubmit}>
            <canvas
              id="myCanvas"
              ref={canvasRef}
              width={256}
              height={256}
              style={{
                backgroundColor: "white",
                border: "1px solid black",
              }}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
            />
            <div className="submit-btn">
              <button className="btn-grad" type="submit">Generate Fabric</button>
            </div>
            <div className="submit-btn">
              <button className="btn-grad" type="submit" onClick={resetCanvas}>Reset</button>
            </div>
          </form>
        </div>

        <div className="outputImage">
          <img src={imageUrl} />
        </div>
      </div>
    </div>
  );
}

export default App;
