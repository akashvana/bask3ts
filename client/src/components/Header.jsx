"use client";
import React from "react";
import Link from "next/link";
import {Mywallet} from '../pages/wallet'


// Import the Head component from next/head
import Head from 'next/head';

const Header = () => {
  return (
    <div>
      {/* Use the Head component to define the custom header */}
      <Head>
        {/* Set the title of the page */}
        <title>Prime</title>

        {/* Add meta tags for description, keywords, etc. */}
        <meta name="description" content="This is my page description" />
        <meta name="keywords" content="next.js, react, web development" />

        {/* Include external stylesheets or scripts */}
        <link rel="stylesheet" href="/styles.css" />
      </Head>

      {/* The rest of your page content goes here */}
      <div>
        <h3>Bask3ts</h3>
      </div>
    </div>

  );
};

export default Header;
