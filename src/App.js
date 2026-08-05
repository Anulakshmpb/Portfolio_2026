import React, { useState } from 'react';
import Navbar from './Modules/Navbar';
import Heropage from './Modules/Heropage';
import Aboutpage from './Modules/Aboutpage';
import Experiencepage from './Modules/Experiencepage';
import SkillsGalaxy from './Modules/SkillsGalaxy';
import Projectspage from './Modules/Projectspage';
import Contactpage from './Modules/Contactpage';
import Footer from './Modules/Footer';
import CaseStudyPage from './Modules/CaseStudyPage';
import './App.css';

function App() {
  const [activeCaseStudy, setActiveCaseStudy] = useState(null);

  if (activeCaseStudy) {
    return (
      <div className="App">
        <CaseStudyPage project={activeCaseStudy} onClose={() => setActiveCaseStudy(null)} />
      </div>
    );
  }

  return (
    <div className="App">
      {/* <Navbar /> */}
      <Heropage />
      <Aboutpage />
      <Experiencepage />
      <SkillsGalaxy />
      <Projectspage onOpenCaseStudy={(proj) => setActiveCaseStudy(proj)} />
      <Contactpage />
      <Footer />
    </div>
  );
}

export default App;
