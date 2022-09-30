import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={<p>hello</p>} />
        <Route path="/users" exact component={<p>hello</p>} />
      </Switch>
    </Router>
  );
};

export default App;
