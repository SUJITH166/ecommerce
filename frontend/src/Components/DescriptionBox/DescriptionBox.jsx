import React from "react";
import './DescriptionBox.css'
const DescriptionBox = () => {
  return (
    <div className="descriptionbox">
      <div className="descriptionbox-navigator">
        <div className="description-nav-box">Description</div>
        <div className="description-nav-box fade">Reviews (122)</div>
      </div>
      <div className="descriptionbox-description">
        <p>Step into elegance with our Floral Summer Midi Dress, designed to keep
        you stylish and comfortable all day long. Crafted from lightweight,
        breathable fabric, this dress features a flattering A-line silhouette,
        short puff sleeves, and a flowy hemline that moves beautifully with
        every step.</p>
        <p> Perfect for casual outings, brunch dates, or summer parties,
        this dress combines comfort with chic style. Pair it with sandals for a
        relaxed daytime look or heels and accessories for an evening vibe.</p>
      </div>
    </div>
  );
};

export default DescriptionBox;
