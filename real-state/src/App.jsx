import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignOut from "./pages/SignOut";
import About from "./pages/About";
import Profile from "./pages/Profile";
import Header from "./components/Header";
import Signup from "./pages/Signup";
import ProtectUser from "./components/ProtectUser";
import CreateListing from "./pages/createListing";
import UpdateListing from "./pages/updateListing";
import Listings from "./pages/listings";
import Search from "./pages/search";
function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/sign-up' element={<Signup />} />
        <Route path='/sign-out' element={<SignOut />} />
        <Route path='/about' element={<About />} />
        <Route path='/listing/:listingID' element={<Listings />} />
        <Route path="/search" element={<Search />} />
        <Route element={<ProtectUser />}>
          <Route path='/profile' element={<Profile />} />
          <Route path='/create-Listing' element={<CreateListing />} />
          <Route
            path='/update-Listing/:listingID'
            element={<UpdateListing />}
          />
        </Route>
        <Route path='/sign-in' element={<SignIn />} />
      </Routes>
    </Router>
  );
}

export default App;
