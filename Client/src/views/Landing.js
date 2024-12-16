import React from 'react';
import NavigationBar from '../components/MyNavbar';
import Footer from '../components/Footer';
import backgroundImage from '../assets/home-background.png'; // Adjust the path and filename accordingly

function Landing() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavigationBar />
      <header
        className="bg-primary text-white text-center py-20"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          height: '80vh',
        }}
      >
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold">Welcome to Itqan</h1>
          <p className="text-lg mt-4">
            Enhance your learning through competition and community-driven contests.
          </p>
          <a href="/auth" className="mt-6 inline-block bg-white text-primary px-6 py-3 rounded">
            Get Started
          </a>
        </div>
      </header>

      <section className="py-20">
        <div className="container mx-auto">
          <div className="flex flex-wrap text-center">
            <div className="w-full md:w-1/3 px-4 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Create Contests</h2>
                <p>
                  Challenge your friends and peers by creating custom contests.
                </p>
              </div>
            </div>
            <div className="w-full md:w-1/3 px-4 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Join Communities</h2>
                <p>
                  Join communities to participate in group contests and discussions.
                </p>
              </div>
            </div>
            <div className="w-full md:w-1/3 px-4 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Track Progress</h2>
                <p>
                  Monitor your progress and see how you rank against others.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-100 py-20">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold">What Our Users Say</h2>
            <p className="text-lg mt-4">Hear from our satisfied learners</p>
          </div>
          <div className="flex flex-wrap text-center">
            <div className="w-full md:w-1/3 px-4 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <p>
                  "Itqan has transformed the way I learn. The competitive aspect keeps me motivated!"
                </p>
                <div className="text-gray-500 mt-4">- User A</div>
              </div>
            </div>
            <div className="w-full md:w-1/3 px-4 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <p>
                  "Joining communities and participating in contests has been a game-changer for me."
                </p>
                <div className="text-gray-500 mt-4">- User B</div>
              </div>
            </div>
            <div className="w-full md:w-1/3 px-4 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <p>
                  "I love tracking my progress and seeing how I rank against others."
                </p>
                <div className="text-gray-500 mt-4">- User C</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Landing;