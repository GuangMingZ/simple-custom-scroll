import React from "react";
import "./App.less";
import useCustomScroll from "./hooks/useCustomScroll";
import HorizontalImg from "./horizontal.jpeg";

function App() {
  useCustomScroll("horizontal-container", ["horizontal-img"]);

  return (
    <div className="app">
      <section className={"horizontal-scroll"}>
        <h2 className={"section-title"}>水平滚动</h2>
        <div id="horizontal-container">
          <img
            src={HorizontalImg}
            alt={"水平滚动示例图"}
            id={"horizontal-img"}
          ></img>
        </div>
      </section>
      <section className={"vertical-scroll"}>
        <h2 className={"section-title"}>垂直滚动</h2>
      </section>
    </div>
  );
}

export default App;
