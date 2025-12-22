const WelcomeSection = ({ userName }) => {
  return (
    <div className="welcome-section bg-gradient-to-r from-primary to-secondary text-white rounded-xl p-6 shadow-lg">
      <h1 className="text-3xl md:text-4xl font-bold mb-2">
        Welcome back, {userName}!
      </h1>
      <p className="text-lg opacity-90">
        Thank you for being a lifesaver through our platform.
      </p>
      <div className="mt-4 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        <span>Your generosity saves lives every day</span>
      </div>
    </div>
  );
};

export default WelcomeSection;