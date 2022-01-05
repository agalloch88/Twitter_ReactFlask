import React from 'react';
import './App.css';
import { Route, BrowserRouter, Switch } from 'react-router-dom';
import NavigationBar from './components/NavigationBar';
import Home from "./pages/Home";
import Search from "./pages/Search";

function App() {
  return (
    <BrowserRouter>
      <NavigationBar />
        <Switch>
          <Route path="/" component={Home} exact />
          <Route path="/search" render={() => <Search />} />
        </Switch>
    </BrowserRouter>
  );
}

export default App;
