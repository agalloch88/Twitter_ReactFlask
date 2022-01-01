import React from 'react';
import './App.css';
import { Route, BrowserRouter, Switch } from 'react-router-dom';
import NavigationBar from './components/NavigationBar';
import Home from "./pages/Home";
import Random from "./pages/Random";
import Search from "./pages/Search";

function App() {
  return (
    <BrowserRouter>
      <NavigationBar />
        <Switch>
          <Route path="/" component={Home} exact />
          <Route path="/random" render={() => <Random />} />
          <Route path="/search" render={() => <Search />} />
        </Switch>
    </BrowserRouter>
  );
}

export default App;
