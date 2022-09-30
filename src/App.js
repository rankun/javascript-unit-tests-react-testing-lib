import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Letter} />
        <Route path="/users" exact component={Letter} />
      </Switch>
    </Router>
  );
};

export default App;
