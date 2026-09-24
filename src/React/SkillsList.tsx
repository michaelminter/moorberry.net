import { useState } from "react";

const skills = {
  "Applied AI": [
    "Retrieval-augmented generation (RAG)",
    "Conversational AI and dialogue systems",
    "Decision modeling and support systems",
  ],
  "Application development": [
    "Web applications with Ruby and JavaScript",
    "Mobile applications with Swift and Kotlin",
    "APIs and backend services",
  ],
  "Data and integrations": [
    "SQL and ETL pipelines",
    "FHIR and JSON APIs",
    "Data migration",
  ],
  "Infrastructure and teams": [
    "AWS and application performance",
    "Technical planning",
    "Mentorship",
  ],
};

export default function SkillsList() {
  const [openItem, setOpenItem] = useState(Object.keys(skills)[0]);

  return (
    <div className="text-left pt-3 md:pt-9 w-full lg:w-auto">
      <h3 className="text-[var(--white)] text-3xl md:text-4xl font-semibold md:mb-6">What I work on</h3>
      <div className="space-y-3 mt-4">
        {Object.entries(skills).map(([category, items]) => (
          <div key={category} className="md:w-[400px] w-full bg-[#1414149c] rounded-2xl border border-[var(--white-icon-tr)] overflow-hidden">
            <button
              type="button"
              aria-expanded={openItem === category}
              onClick={() => setOpenItem(category)}
              className="w-full flex items-center justify-between gap-3 p-4 text-left text-[var(--white)] hover:bg-[#ffffff0d]"
            >
              <span>{category}</span>
              <span aria-hidden="true" className="text-[var(--sec)]">{openItem === category ? "−" : "+"}</span>
            </button>
            {openItem === category && (
              <ul className="px-4 pb-4 text-sm text-[var(--white-icon)] leading-7">
                {items.map((item) => <li key={item}>· {item}</li>)}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
