// PlayerFeatures.tsx
import React from 'react';

const FreeFeatures: React.FC = () => {
  return (
    <div className="container px-4 py-5" id="featured-3">
      <h2 className="pb-2 border-bottom">Sports for Everyone</h2>
      <div className="row g-4 py-5 row-cols-1 row-cols-lg-3">
        <div className="feature col">
          <h3 className="fs-2 text-body-emphasis">Meet new people</h3>
          <p>Sports are only as fun as the people you play with. Recess was built to not only make finding sports easy, but to make finding great people to play with easy too.</p>
        </div>
        <div className="feature col">
          <h3 className="fs-2 text-body-emphasis">Discover new locations</h3>
          <p>Recess has hundreds of locations that players can discover with in depth descriptions. Use filters to find exactly what you're looking for.</p>
        </div>
        <div className="feature col">
          <h3 className="fs-2 text-body-emphasis">Create and Join Games</h3>
          <p>Let people in your neighborhood know when and where you plan to play. You can also search games already set up by players near you, or check out the Recess hosted game of the day</p>
        </div>
      </div>
    </div>
  );
};

export default FreeFeatures;
