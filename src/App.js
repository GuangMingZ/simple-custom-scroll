import React from "react";
import "./App.less";
import useHorizontalScroll from "./hooks/useHorizontalScroll";
import useVerticalScroll from "./hooks/useVerticalScroll";
import HorizontalImg from "./imgs/horizontal.jpg";
import VerticalImg from "./imgs/vertical.jpg";

function App() {
  useHorizontalScroll("horizontal-container", ["horizontal-img"]);
  useVerticalScroll("vertical-container", ["vertical-img"]);

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
        <div
          id="vertical-container"
          style={{ height: "300px", overflowY: "hidden" }}
        >
          <img
            src={VerticalImg}
            alt={"垂直滚动示例图"}
            id={"vertical-img"}
          ></img>
        </div>
      </section>
    </div>
  );
}

export default App;
