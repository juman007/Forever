import React from "react";
import Hero from "../components/Hero";
import LatestCollection from "../components/LatestCollection";
import BestSaller from "../components/BestSaller";
import OurPolicy from "../components/OurPolicy";
import NewsLatterBox from "../components/NewsLatterBox";

const Home = () => {
   return (
      <div>
         <Hero />
         <LatestCollection />
         <BestSaller />
         <OurPolicy />
         <NewsLatterBox />
      </div>
   );
};

export default Home;
