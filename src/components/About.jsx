import React from "react";

export default function About() {
  const roadmap = [
    { skill: "HTML", projects: ["Landing Page", "Portfolio", "Blog Page"] },
    {
      skill: "CSS",
      projects: ["Responsive Page", "Grid Layout", "Flexbox Cards"],
    },
    {
      skill: "JavaScript",
      projects: ["ToDo App", "Calculator", "Weather App"],
    },
    {
      skill: "Bootstrap 5",
      projects: ["Landing Page", "Admin Dashboard", "Portfolio"],
    },
    {
      skill: "Git & GitHub",
      projects: ["Version Control", "Open Source Contribution"],
    },
    {
      skill: "React JS",
      projects: ["Todo App", "Movie Search App", "E-commerce Store"],
    },
    {
      skill: "TailwindCSS",
      projects: ["Portfolio", "Admin Dashboard", "Landing Page"],
    },
    {
      skill: "Next JS",
      projects: ["Blog Platform", "E-commerce App", "Portfolio"],
    },
    {
      skill: "Firebase",
      projects: ["Authentication", "Realtime Database", "CRUD App"],
    },
  ];

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8 bg-gray-100 text-gray-900 rounded-xl">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center">
        Frontend Developer Roadmap
      </h1>

      <div className="space-y-6">
        {roadmap.map((item) => (
          <div
            key={item.skill}
            className="bg-white p-4 sm:p-6 md:p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">
              {item.skill}
            </h2>
            <p className="font-semibold mb-1">Projects:</p>
            <ul className="list-disc list-inside space-y-1">
              {item.projects.map((proj) => (
                <li key={proj} className="text-sm sm:text-base md:text-lg">
                  {proj}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
