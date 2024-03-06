// PlayerFeatures.tsx
import React from 'react';

const PaidFeatures: React.FC = () => {
  return (
    <div className="container px-4 py-5" id="featured-3">
      <h2 className="pb-2 border-bottom">Recess Playpass</h2>
      <div className="row g-4 py-5 row-cols-1 row-cols-lg-3">
        <div className="feature col">
          <h3 className="fs-2 text-body-emphasis">Create Unique Leagues</h3>
          <p>Have a group you like to play with? Or want to start your won league? We provide tools that organizers can use to create communities that align with their mission and experience.</p>
        </div>
        <div className="feature col">
          <h3 className="fs-2 text-body-emphasis">Join Tournaments</h3>
          <p>We want to provide players with an incentive to paly hard and fair. If you're feeling ready, participate in "flexible" tournaments and you could win prizes!</p>
        </div>
        <div className="feature col">
          <h3 className="fs-2 text-body-emphasis">Premium Locations</h3>
          <p>Have your own court or field that you'd like to rent out or provide to the community? Reach out to us and you can become an official location host and even earn income.</p>
        </div>
      </div>
    </div>
  );
};

export default PaidFeatures;
