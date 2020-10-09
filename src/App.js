import React from "react";
import "./App.less";

import HorizontalImg from "./horizontal.jpeg";

function App() {
  return (
    <div className="app">
      <section className={"horizontal-scroll"}>
        <h2 className={"section-title"}>水平滚动</h2>
        <div>
          <img src={HorizontalImg} alt={"水平滚动示例图"}></img>
        </div>
      </section>
      <section className={"vertical-scroll"}>
        <h2 className={"section-title"}>垂直滚动</h2>
      </section>
    </div>
  );
}

export default App;
