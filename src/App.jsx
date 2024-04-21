import React from "react";
import { DatePicker, Button } from "antd";

const App = () => {
  return (
    <div>
      <div>
        <h2 className="text-blue-500 text-xl font-bold text-center">
          Hello, React
        </h2>
        <p className="text-lg font-medium">Hello, Typescript!</p>
      </div>
      <DatePicker />
      <Button type="primary">Primary Button</Button>
    </div>
  );
};

export default App;
