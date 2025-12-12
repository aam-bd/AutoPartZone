import React from 'react';
import Navbar from '../Components/Navbar';
import Carousel from '../Components/Carousel';
import carousel1 from '../assets/carousel1.jpeg';
import carousel2 from '../assets/carousel1.jpeg';
import carousel3 from '../assets/carousel3.png';
import carousel4 from '../assets/carousel3.png'

const Home = () => {
    return (
        <div>
            <Navbar></Navbar>
            <Carousel
        images={[
          {
            src: carousel1,
            alt: "App showcase",
            caption: {
              title: "Discover Amazing Apps",
              description: "Find the perfect tools for your needs",
            },
          },
          {
            src: carousel2,
            alt: "Mobile devices",
            caption: {
              title: "Innovative Features",
              description: "Discover. Download. Do More...",
            },
          },
          {
            src: carousel3,
            alt: "App features",
            caption: {
              title: "Premium Features",
              description: "Unlock powerful capabilities",
            },
          },
          {
            src: carousel4,
            alt: "User experience",
            caption: {
              title: "User Experience",
              description: "Experience the best ever",
            },
          },
        ]}
      />

            
        </div>
    );
};

export default Home;