// PlayerFeatures.tsx
import React from 'react';

const PaidFeatures: React.FC = () => {
  return (
    <div className="container px-4 py-5" id="featured-3">
      <h2 className="pb-2 border-bottom">Recess Playpass</h2>
      <div className="row g-4 py-5 row-cols-1 row-cols-lg-3">
        <div className="feature col">
          <h3 className="fs-2 text-body-emphasis">Create Unique Leagues</h3>
          <p>Coaches are filled with knowledge and experience that anyone can benefit from. We provide tools that coaches can use to create communities that align with their missions and experience.</p>
        </div>
        <div className="feature col">
          <h3 className="fs-2 text-body-emphasis">Join Tournaments</h3>
          <p>We believe that the role coaches play are so important that deserve to be paid for their hard work. Recess gives coaches the ability to host paid commmunities and events so that they can create the best possible experience.</p>
        </div>
        <div className="feature col">
          <h3 className="fs-2 text-body-emphasis">Premium Locations</h3>
          <p>Recess is built to make finding and playing sports easy and intuitive. Hosting your community here opens you up to an audience looking purely to play sport</p>
        </div>
      </div>
    </div>
  );
};

export default PaidFeatures;
