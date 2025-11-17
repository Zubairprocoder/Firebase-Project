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
    <div className="min-h-screen p-8 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white rounded-xl">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Frontend Developer Roadmap
      </h1>
      <div className="space-y-6">
        {roadmap.map((item) => (
          <div
            key={item.skill}
            className="bg-white/10 p-4 rounded-xl shadow-lg"
          >
            <h2 className="text-2xl font-bold mb-2">{item.skill}</h2>
            <p className="font-semibold mb-1">Projects:</p>
            <ul className="list-disc list-inside">
              {item.projects.map((proj) => (
                <li key={proj}>{proj}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
