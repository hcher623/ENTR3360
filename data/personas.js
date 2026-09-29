/**
 * Myrimaven Demo Personas
 * Realistic student/graduate personas showcasing differentiated recommendations.
 */

export const PERSONAS = [
  {
    "id": "priya",
    "name": "Priya",
    "role": "Pre-med student reconsidering her path",
    "description": "Strong clinical foundation, deeply empathetic, but questioning the 10-year residency route. Wants to help people with research-backed impact without hospital burnout.",
    "avatar": "👩‍⚕️",
    "badge": "Health & Human Focus",
    "profile": {
      "name": "Priya",
      "personality": {
        "introvert": 30,
        "analytical": 25,
        "structured": 45,
        "collaborative": 65
      },
      "interests": [
        "Health & Medicine",
        "Psychology & Behavior",
        "People & Society",
        "Science & Research"
      ],
      "skills": [
        "Empathy & Active Listening",
        "Research & Investigation",
        "Critical Thinking",
        "Communication",
        "Scientific Method"
      ],
      "values": [
        "Helping Others",
        "Intellectual Challenge",
        "Making a Real Impact"
      ],
      "environment": "Hybrid"
    }
  },
  {
    "id": "marcus",
    "name": "Marcus",
    "role": "CS graduate unsure whether to stay in tech",
    "description": "Technically gifted programmer who feels disconnected from purely commercial software. Looking for roles at the intersection of AI, policy, ethics, and tangible systems.",
    "avatar": "👨‍💻",
    "badge": "Tech & Systems",
    "profile": {
      "name": "Marcus",
      "personality": {
        "introvert": 25,
        "analytical": 15,
        "structured": 40,
        "collaborative": 45
      },
      "interests": [
        "Technology",
        "Data & Analytics",
        "Business & Finance",
        "Social Justice"
      ],
      "skills": [
        "Programming",
        "Data Analysis",
        "Critical Thinking",
        "Problem-Solving",
        "Statistics"
      ],
      "values": [
        "Intellectual Challenge",
        "Innovation & Cutting-Edge Work",
        "High Income",
        "Making a Real Impact"
      ],
      "environment": "Remote"
    }
  },
  {
    "id": "leah",
    "name": "Leah",
    "role": "Art school grad looking for meaningful work",
    "description": "Creative storyteller seeking a stable, high-impact career that bridges visual design, human understanding, and social education without corporate emptiness.",
    "avatar": "🎨",
    "badge": "Creative & Design",
    "profile": {
      "name": "Leah",
      "personality": {
        "introvert": 55,
        "analytical": 80,
        "structured": 70,
        "collaborative": 60
      },
      "interests": [
        "Arts & Design",
        "People & Society",
        "Writing & Media",
        "Education & Teaching",
        "Social Justice"
      ],
      "skills": [
        "Creativity",
        "Communication",
        "Design Thinking",
        "Writing & Storytelling",
        "Empathy & Active Listening"
      ],
      "values": [
        "Creative Expression",
        "Making a Real Impact",
        "Community",
        "Helping Others"
      ],
      "environment": "Hybrid"
    }
  }
];

export function getPersonaById(id) {
  return PERSONAS.find(p => p.id === id) || null;
}
