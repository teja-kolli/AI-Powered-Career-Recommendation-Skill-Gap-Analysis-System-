import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./pages/Profile";
import Skills from "./pages/Skills";
import Interests from "./pages/Interests";
import CareerGoal from "./pages/CareerGoal";
import Fingerprint from "./pages/Fingerprint";
import Courses from "./pages/Courses";
import Projects from "./pages/Projects";
import Certifications from "./pages/Certifications";
import Learning from "./pages/Learning";
import Recommendations from "./pages/Recommendations";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import PlacementCoach from "./pages/PlacementCoach";
import Roadmap from "./pages/Roadmap";
import SkillGap from "./pages/SkillGap";

function App() {

    return (

        <BrowserRouter>

            <Routes>

                <Route
                    path="/"
                    element={
                        <Navigate
                            to="/login"
                        />
                    }
                />
                <Route
        path="/skills"
        element={
        <ProtectedRoute>
            <Skills />
        </ProtectedRoute>
    } />
                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

               <Route
          path="/profile"
           element={
        <ProtectedRoute>
            <Profile />
        </ProtectedRoute>
    }
/>
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                  <Route
             path="/interests"
             element={
        <ProtectedRoute>
            <Interests />
        </ProtectedRoute>
    }
       />
     <Route
    path="/skill-gap"
    element={<SkillGap />}
/>      
    <Route
    path="/career"
    element={
        <ProtectedRoute>
            <CareerGoal />
        </ProtectedRoute>
    }
/>

<Route
    path="/fingerprint"
    element={
        <ProtectedRoute>
            <Fingerprint />
        </ProtectedRoute>
    }
/>
  <Route path="/placement" element={<PlacementCoach />} />
<Route
    path="/courses"
    element={
        <ProtectedRoute>
            <Courses />
        </ProtectedRoute>
    }
/>

<Route
    path="/projects"
    element={
        <ProtectedRoute>
            <Projects />
        </ProtectedRoute>
    }
/>

<Route
    path="/certifications"
    element={
        <ProtectedRoute>
            <Certifications />
        </ProtectedRoute>
    }
/>

<Route
    path="/learning"
    element={
        <ProtectedRoute>
            <Learning />
        </ProtectedRoute>
    }
/>

<Route
    path="/recommendations"
    element={
        <ProtectedRoute>
            <Recommendations />
        </ProtectedRoute>
    }
/>
<Route path="/resume-analyzer" element={<ResumeAnalyzer />} />

<Route path="/placement-coach" element={<PlacementCoach />} />
<Route path="/roadmap" element={<Roadmap />} />
    
            </Routes>

          

        </BrowserRouter>

    );
}


export default App;