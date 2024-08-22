import { useState } from "react";

const App = () => {
  const [image, setImage] = useState(null);
  const [value, setValue] = useState("");
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");

  const surpriseOptions = [
    "Does the image have a person ? ",
    "Is the image blue",
    "What is happening in the image",
    "What do you think of this? ",
    "Can you tell me more about this photo ?",
  ];
  const surprise = () => {
    const randomValue =
      surpriseOptions[Math.floor(Math.random() * surpriseOptions.length)];
    setValue(randomValue);
  };

  const upload = async (e) => {
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    setImage(e.target.files[0]);
    try {
      const options = {
        method: "POST",
        body: formData,
      };
      const response = await fetch("http://localhost:8000/upload", options);
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error);
      setError("something did not work");
    }
  };

  console.log(value);

  const analyzeImage = async () => {
    setResponse("");
    if (!image) {
      setError("Error! Must have image ");
      return;
    }
    try {
      const options = {
        method: "POST",
        body: JSON.stringify({ message: value }),
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await fetch("http://localhost:8000/gemini", options);
      const data = await response.text();
      setResponse(data);
    } catch (error) {
      console.log(error);
      setError("");
    }
  };

  const clear = () => {
    setImage(null);
    setValue("");
    setResponse("");
    setError("");
  };
  return (
    <div className="app">
      <section className="search-section">
        <div className="image-container">
          {image && <img className="image" src={URL.createObjectURL(image)} />}
        </div>
        {!response && (
          <p className="extra-info">
            <span>
              {" "}
              <label htmlFor="files">
                <span className="up">upload</span> an image{" "}
              </label>
              <input
                onChange={upload}
                id="files"
                type="file"
                accept="image/*"
                hidden
              />
            </span>
            to ask questions about it
          </p>
        )}
        <p>
          What do you want to know about the image ?
          <button className="surprise" onClick={surprise} disabled={response}>
            Surprise me
          </button>
        </p>
        <div className="input-container">
          <input
            type="text"
            name=""
            id=""
            value={value}
            placeholder="What is in the image?"
            onChange={(e) => setValue(e.target.value)}
          />
          {!response && !error && (
            <button onClick={analyzeImage}>Ask me</button>
          )}
          {(response || error) && <button onClick={clear}>Clear</button>}
        </div>
        {error && <p>{error}</p>}
        {response && <p className="answer">{response}</p>}
      </section>
    </div>
  );
};

export default App;
