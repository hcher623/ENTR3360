/**
 * Myrimaven Career Taxonomy & Taxonomy Data
 * Extracted from Figma prototype specification.
 */

export const INTERESTS = [
  "Technology",
  "Science & Research",
  "Arts & Design",
  "Health & Medicine",
  "People & Society",
  "Nature & Environment",
  "Business & Finance",
  "Law & Policy",
  "Education & Teaching",
  "Writing & Media",
  "Psychology & Behavior",
  "Data & Analytics",
  "Engineering",
  "Social Justice",
  "Environmental Issues",
  "Music & Performance"
];

export const SKILLS = [
  "Critical Thinking",
  "Data Analysis",
  "Writing & Storytelling",
  "Public Speaking",
  "Programming",
  "Research & Investigation",
  "Leadership",
  "Creativity",
  "Empathy & Active Listening",
  "Problem-Solving",
  "Data Visualization",
  "Scientific Method",
  "Negotiation",
  "Teaching & Mentoring",
  "Design Thinking",
  "Statistics",
  "Teamwork & Collaboration",
  "Organization & Planning",
  "Communication",
  "Project Management"
];

export const VALUES = [
  "Making a Real Impact",
  "Autonomy & Independence",
  "Work-Life Balance",
  "High Income",
  "Career Growth",
  "Job Stability",
  "Creative Expression",
  "Collaboration & Teamwork",
  "Recognition & Status",
  "Helping Others",
  "Intellectual Challenge",
  "Flexibility",
  "Social Justice",
  "Innovation & Cutting-Edge Work",
  "Community"
];

export const ENVIRONMENTS = [
  "Remote",
  "Hybrid",
  "In-person",
  "No preference"
];

export const SECTORS = [
  {
    "id": "design-technology",
    "name": "Design & Technology",
    "color": "#4F6EB0"
  },
  {
    "id": "policy-government",
    "name": "Policy & Government",
    "color": "#3A7D5A"
  },
  {
    "id": "media-technology",
    "name": "Media & Technology",
    "color": "#8B4A8B"
  },
  {
    "id": "healthcare-mental-health",
    "name": "Healthcare & Mental Health",
    "color": "#C17F3A"
  },
  {
    "id": "government-design",
    "name": "Government & Design",
    "color": "#4A6B8B"
  },
  {
    "id": "technology",
    "name": "Technology",
    "color": "#2D6B9B"
  },
  {
    "id": "science-engineering",
    "name": "Science & Engineering",
    "color": "#6B3A9B"
  },
  {
    "id": "design-media",
    "name": "Design & Media",
    "color": "#B04A3A"
  },
  {
    "id": "social-impact",
    "name": "Social Impact",
    "color": "#5A8B3A"
  },
  {
    "id": "finance",
    "name": "Finance",
    "color": "#1A3A6B"
  },
  {
    "id": "science-law",
    "name": "Science & Law",
    "color": "#5A3A1A"
  },
  {
    "id": "law-advocacy",
    "name": "Law & Advocacy",
    "color": "#6B3A5A"
  },
  {
    "id": "science-environment",
    "name": "Science & Environment",
    "color": "#1A6B7A"
  },
  {
    "id": "education-technology",
    "name": "Education & Technology",
    "color": "#8B6B1A"
  },
  {
    "id": "technology-ai",
    "name": "Technology & AI",
    "color": "#1A4A6B"
  }
];

export const CAREERS = [
  {
    "id": "ux-researcher",
    "title": "UX Researcher",
    "field": "Design & Technology",
    "fieldColor": "#4F6EB0",
    "tagline": "Translate human behavior into better products.",
    "description": "UX Researchers study how people interact with products and services, uncovering insights that guide design decisions. You sit at the intersection of psychology, design, and business — running studies, conducting interviews, and turning observations into actionable intelligence.",
    "salary": {
      "low": 75000,
      "median": 105000,
      "high": 155000
    },
    "growth": "high",
    "growthPct": 19,
    "environments": [
      "Office",
      "Remote",
      "Hybrid"
    ],
    "education": "Bachelor's in Psychology, HCI, Design, or related. Many roles accept portfolios over degrees.",
    "personalityFit": {
      "introvert": [
        15,
        65
      ],
      "analytical": [
        10,
        60
      ],
      "structured": [
        30,
        75
      ],
      "collaborative": [
        40,
        85
      ]
    },
    "relatedInterests": [
      "Psychology & Behavior",
      "Technology",
      "Arts & Design",
      "People & Society",
      "Data & Analytics"
    ],
    "requiredSkills": [
      "Research & Investigation",
      "Empathy & Active Listening",
      "Critical Thinking",
      "Communication",
      "Data Analysis",
      "Writing & Storytelling"
    ],
    "alignedValues": [
      "Intellectual Challenge",
      "Making a Real Impact",
      "Collaboration & Teamwork",
      "Career Growth"
    ],
    "dayInLife": "Your morning starts with reviewing recordings from yesterday's user interviews. By 10am you're in a synthesis session, clustering findings on a virtual whiteboard with two designers. After lunch, you run a moderated usability test with a participant over video call, watching closely as they navigate a new checkout flow — you notice a hesitation at the shipping step no one had flagged. You spend the afternoon writing your weekly insight report, distilling 12 hours of interviews into six clear findings with supporting quotes. You leave knowing the design team will ship something better because of your work.",
    "pros": [
      "High demand across industries",
      "Bridge between human insight and product",
      "Flexible working arrangements common",
      "Collaborative without being sales-driven"
    ],
    "cons": [
      "Stakeholders don't always act on research",
      "Can feel removed from final design decisions",
      "Research cycles can be slow in fast-moving teams"
    ],
    "pathways": [
      "Psychology or HCI degree → entry-level researcher role",
      "Bootcamp + portfolio → junior UX role",
      "Design background → specialise in research",
      "Anthropology or sociology background → enterprise UX research"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&h=500&fit=crop&auto=format"
  },
  {
    "id": "environmental-policy-analyst",
    "title": "Environmental Policy Analyst",
    "field": "Policy & Government",
    "fieldColor": "#3A7D5A",
    "tagline": "Turn scientific evidence into climate action.",
    "description": "Environmental Policy Analysts research, draft, and evaluate policies that govern natural resources, pollution, climate change, and conservation. You translate complex science into language that lawmakers, businesses, and communities can act on — sitting at the intersection of ecology, economics, and governance.",
    "salary": {
      "low": 58000,
      "median": 82000,
      "high": 125000
    },
    "growth": "high",
    "growthPct": 22,
    "environments": [
      "Office",
      "Field Work",
      "Hybrid"
    ],
    "education": "Bachelor's in Environmental Science, Political Science, or Economics. Master's strongly preferred for senior roles.",
    "personalityFit": {
      "introvert": [
        20,
        70
      ],
      "analytical": [
        10,
        55
      ],
      "structured": [
        25,
        70
      ],
      "collaborative": [
        35,
        80
      ]
    },
    "relatedInterests": [
      "Environmental Issues",
      "Nature & Environment",
      "Law & Policy",
      "Science & Research",
      "People & Society",
      "Data & Analytics"
    ],
    "requiredSkills": [
      "Research & Investigation",
      "Writing & Storytelling",
      "Critical Thinking",
      "Data Analysis",
      "Communication",
      "Organization & Planning"
    ],
    "alignedValues": [
      "Making a Real Impact",
      "Social Justice",
      "Intellectual Challenge",
      "Community",
      "Environmental Issues"
    ],
    "dayInLife": "You start the day reviewing a 200-page environmental impact assessment for a proposed solar farm. By 9:30am you're on a call with a state agency, explaining why their proposed wastewater rule has a significant loophole. After lunch you draft testimony for an upcoming legislative hearing — you have 5 minutes to make a complex aquifer recharge issue crystal clear to people who aren't scientists. Late afternoon you review comments on a federal rulemaking, categorizing and summarizing 3,000 public submissions. You work because you believe evidence should drive decisions, and sometimes it does.",
    "pros": [
      "Direct connection to environmental outcomes",
      "Intellectually demanding and varied work",
      "Cross-sector — government, NGO, consulting, private",
      "Growing field as climate urgency increases"
    ],
    "cons": [
      "Policy change is frustratingly slow",
      "Political swings can reverse years of work",
      "Often lower pay in public sector roles"
    ],
    "pathways": [
      "Environmental science degree → entry-level analyst at agency or NGO",
      "Political science + internship → policy research role",
      "Law school → environmental attorney → policy",
      "Economics background → environmental economics consulting"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1569163139599-0f4517e36f51?w=800&h=500&fit=crop&auto=format"
  },
  {
    "id": "data-journalist",
    "title": "Data Journalist",
    "field": "Media & Technology",
    "fieldColor": "#8B4A8B",
    "tagline": "Find the story hiding in the spreadsheet.",
    "description": "Data Journalists use data analysis, statistics, and visualization to uncover and tell compelling news stories. You're part reporter, part analyst, part designer — equally comfortable running SQL queries and writing long-form narrative. Your stories often expose patterns invisible to traditional reporting.",
    "salary": {
      "low": 52000,
      "median": 78000,
      "high": 128000
    },
    "growth": "moderate",
    "growthPct": 12,
    "environments": [
      "Office",
      "Remote",
      "Hybrid"
    ],
    "education": "Journalism, statistics, computer science, or any combination. Portfolio of published work matters far more than specific degree.",
    "personalityFit": {
      "introvert": [
        20,
        75
      ],
      "analytical": [
        20,
        65
      ],
      "structured": [
        20,
        65
      ],
      "collaborative": [
        25,
        70
      ]
    },
    "relatedInterests": [
      "Writing & Media",
      "Data & Analytics",
      "People & Society",
      "Technology",
      "Social Justice",
      "Law & Policy"
    ],
    "requiredSkills": [
      "Data Analysis",
      "Writing & Storytelling",
      "Research & Investigation",
      "Critical Thinking",
      "Data Visualization",
      "Statistics"
    ],
    "alignedValues": [
      "Making a Real Impact",
      "Intellectual Challenge",
      "Creative Expression",
      "Social Justice",
      "Autonomy & Independence"
    ],
    "dayInLife": "You wake up with a FOIA request result in your inbox — a city's traffic stop database from the last four years. You spend the morning cleaning 1.2 million rows in Python, looking for anomalies. By noon you've found it: one precinct stops Black drivers at 3.4x the rate of adjacent precincts with similar demographics. You call the police department for comment, then spend the afternoon building the visual story — a map with the disparity overlaid on neighborhood demographics. You file at 7pm. By morning, it's the most read article on your publication's site.",
    "pros": [
      "Significant public impact through accountability journalism",
      "Highly varied — every story is a new dataset and domain",
      "Combination of technical and creative skills is rare and valued",
      "Remote-friendly at most publications"
    ],
    "cons": [
      "Job market is contracting at many legacy outlets",
      "Data scoops can be slow — months per story",
      "Technical work often undervalued by traditional newsroom culture"
    ],
    "pathways": [
      "Journalism degree + self-taught statistics → reporting role",
      "Statistics/CS degree → data journalism fellowship (ProPublica, NYT, etc.)",
      "Policy or advocacy background → investigative data reporting"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=500&fit=crop&auto=format"
  },
  {
    "id": "clinical-psychologist",
    "title": "Clinical Psychologist",
    "field": "Healthcare & Mental Health",
    "fieldColor": "#C17F3A",
    "tagline": "Help people understand and change their minds.",
    "description": "Clinical Psychologists assess, diagnose, and treat mental health conditions using evidence-based therapies. You develop deep one-on-one relationships with clients over time, guiding them through everything from anxiety and depression to trauma and personality disorders. The work is intellectually demanding and emotionally rewarding.",
    "salary": {
      "low": 72000,
      "median": 98000,
      "high": 152000
    },
    "growth": "high",
    "growthPct": 14,
    "environments": [
      "Private Practice",
      "Hospital",
      "Community Clinic"
    ],
    "education": "Doctoral degree (PhD or PsyD) required for licensure. 5–7 years post-bachelor's training typical.",
    "personalityFit": {
      "introvert": [
        20,
        70
      ],
      "analytical": [
        25,
        75
      ],
      "structured": [
        30,
        75
      ],
      "collaborative": [
        50,
        95
      ]
    },
    "relatedInterests": [
      "Psychology & Behavior",
      "Health & Medicine",
      "People & Society",
      "Science & Research",
      "Education & Teaching"
    ],
    "requiredSkills": [
      "Empathy & Active Listening",
      "Critical Thinking",
      "Research & Investigation",
      "Communication",
      "Organization & Planning",
      "Writing & Storytelling"
    ],
    "alignedValues": [
      "Helping Others",
      "Intellectual Challenge",
      "Making a Real Impact",
      "Autonomy & Independence",
      "Work-Life Balance"
    ],
    "dayInLife": "Your first client arrives at 8am — a college sophomore you've been seeing for three months for panic disorder. After 50 minutes, you take detailed notes, update your treatment plan, and review your case formulation. Four more clients fill your morning and early afternoon, each with completely different presentations. At 4pm you attend a case consultation with three colleagues, presenting a complex personality disorder case for peer input. You end the day reviewing research on a new trauma protocol. Private practice means you set your own schedule — but it also means you carry the weight of your clients' progress with you.",
    "pros": [
      "Profound impact on individual lives",
      "High degree of professional autonomy",
      "Intellectually rich — every client is different",
      "Strong and growing demand"
    ],
    "cons": [
      "Extremely long training pathway (doctoral + internship)",
      "Emotional labor is real and accumulates",
      "High student debt for many routes",
      "Managed care can constrain treatment approaches"
    ],
    "pathways": [
      "Psychology undergraduate → PhD or PsyD program → supervised internship → licensure",
      "Different undergraduate major → post-bac psych coursework → doctoral program"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1527689368864-3a821dbccc34?w=800&h=500&fit=crop&auto=format"
  },
  {
    "id": "urban-planner",
    "title": "Urban & Regional Planner",
    "field": "Government & Design",
    "fieldColor": "#4A6B8B",
    "tagline": "Shape the cities people actually want to live in.",
    "description": "Urban Planners design and regulate land use, transportation, housing, and public spaces to create sustainable, livable communities. You work at the intersection of policy, community engagement, design, and data — translating competing interests into workable plans with real consequences for millions of people.",
    "salary": {
      "low": 58000,
      "median": 80000,
      "high": 120000
    },
    "growth": "moderate",
    "growthPct": 11,
    "environments": [
      "Government Office",
      "Consulting Firm",
      "Field Visits",
      "Community Meetings"
    ],
    "education": "Master's in Urban Planning (MUP) strongly preferred. Bachelor's entry possible in smaller jurisdictions.",
    "personalityFit": {
      "introvert": [
        20,
        75
      ],
      "analytical": [
        30,
        75
      ],
      "structured": [
        25,
        70
      ],
      "collaborative": [
        45,
        90
      ]
    },
    "relatedInterests": [
      "People & Society",
      "Nature & Environment",
      "Law & Policy",
      "Arts & Design",
      "Environmental Issues",
      "Data & Analytics"
    ],
    "requiredSkills": [
      "Research & Investigation",
      "Data Analysis",
      "Communication",
      "Organization & Planning",
      "Writing & Storytelling",
      "Problem-Solving",
      "Teamwork & Collaboration"
    ],
    "alignedValues": [
      "Making a Real Impact",
      "Community",
      "Social Justice",
      "Intellectual Challenge",
      "Work-Life Balance"
    ],
    "dayInLife": "Morning: reviewing traffic impact data for a proposed mixed-use development on a sensitive transit corridor. You flag three issues the applicant's consultant glossed over. At 10am you lead a community workshop in a neighborhood slated for rezoning — you're there to listen, not to convince. Residents are skeptical. You take detailed notes and commit to returning with responses. Afternoon: presenting revised transit-oriented development guidelines to the planning commission, defending density recommendations against opposition from existing homeowners. The work is slow, political, sometimes maddening — and occasionally you see a park open, a bus line extend, a neighborhood genuinely improve.",
    "pros": [
      "Tangible, visible impact in the built environment",
      "High variety — transportation, housing, environment, design",
      "Government roles have strong stability and benefits",
      "Growing focus on climate resilience creates new opportunities"
    ],
    "cons": [
      "Progress is slow — projects span years or decades",
      "Subject to political pressure and community opposition",
      "Public sector salaries lag private consulting"
    ],
    "pathways": [
      "Geography or urban studies undergraduate → MUP program",
      "Architecture background → urban design focus",
      "Environmental science → sustainability planning",
      "Political science → policy-focused planning role"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&h=500&fit=crop&auto=format"
  },
  {
    "id": "product-manager",
    "title": "Technical Product Manager",
    "field": "Technology",
    "fieldColor": "#2D6B9B",
    "tagline": "Own the intersection of technology, users, and business.",
    "description": "Technical Product Managers define what gets built and why, bridging engineering teams and business stakeholders. You prioritize, negotiate, and navigate ambiguity constantly — setting direction for products used by thousands or millions. This role rewards people who are equally comfortable in a technical specification and a strategy meeting.",
    "salary": {
      "low": 105000,
      "median": 148000,
      "high": 220000
    },
    "growth": "high",
    "growthPct": 21,
    "environments": [
      "Office",
      "Remote",
      "Hybrid"
    ],
    "education": "No single required path. CS or engineering background common. MBA helpful for senior roles. Many enter from other disciplines.",
    "personalityFit": {
      "introvert": [
        25,
        75
      ],
      "analytical": [
        25,
        75
      ],
      "structured": [
        25,
        70
      ],
      "collaborative": [
        55,
        95
      ]
    },
    "relatedInterests": [
      "Technology",
      "Business & Finance",
      "Psychology & Behavior",
      "Data & Analytics",
      "People & Society"
    ],
    "requiredSkills": [
      "Communication",
      "Critical Thinking",
      "Problem-Solving",
      "Leadership",
      "Data Analysis",
      "Project Management",
      "Teamwork & Collaboration"
    ],
    "alignedValues": [
      "Career Growth",
      "High Income",
      "Innovation & Cutting-Edge Work",
      "Making a Real Impact",
      "Intellectual Challenge"
    ],
    "dayInLife": "8am: reviewing analytics dashboards for your product's key flows, noting a spike in drop-off at onboarding step 3. 9am: sprint planning with your engineering team — you defend the prioritization of a security fix over a new feature request from sales. 11am: customer call with a frustrated enterprise client, listening and translating their pain into a structured product request. Afternoon: writing a product requirements document for next quarter's major initiative, drawing on user research, competitive analysis, and business metrics. 5pm: you join a design review, giving feedback on four different solutions to the same onboarding problem. You close your laptop knowing ten people made decisions today based partly on your judgment.",
    "pros": [
      "High compensation and career trajectory",
      "Enormous variety — strategy, data, design, engineering",
      "High degree of ownership and influence",
      "Skills transfer across industries"
    ],
    "cons": [
      "High ambiguity and accountability without direct authority",
      "Can feel like everyone's problems are your problems",
      "Requires extensive context-switching",
      "Difficult to break into without adjacent experience"
    ],
    "pathways": [
      "Software engineering → internal PM transition",
      "Business or consulting → associate PM program at tech company",
      "Domain expert (healthcare, finance) → product in that vertical",
      "CS degree → PM bootcamp → APM role"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=500&fit=crop&auto=format"
  },
  {
    "id": "biomedical-engineer",
    "title": "Biomedical Engineer",
    "field": "Science & Engineering",
    "fieldColor": "#6B3A9B",
    "tagline": "Build the tools that heal people.",
    "description": "Biomedical Engineers apply engineering principles to medicine and biology — designing and developing devices, diagnostics, software, and materials that improve patient outcomes. Your work might span prosthetics, imaging systems, wearable sensors, drug delivery, or surgical robotics.",
    "salary": {
      "low": 72000,
      "median": 100000,
      "high": 158000
    },
    "growth": "high",
    "growthPct": 17,
    "environments": [
      "Laboratory",
      "Manufacturing",
      "Hospital",
      "Office"
    ],
    "education": "Bachelor's in Biomedical Engineering or related engineering field. Graduate degree for research roles.",
    "personalityFit": {
      "introvert": [
        15,
        70
      ],
      "analytical": [
        5,
        50
      ],
      "structured": [
        20,
        65
      ],
      "collaborative": [
        30,
        75
      ]
    },
    "relatedInterests": [
      "Science & Research",
      "Engineering",
      "Health & Medicine",
      "Technology",
      "Data & Analytics"
    ],
    "requiredSkills": [
      "Scientific Method",
      "Problem-Solving",
      "Critical Thinking",
      "Research & Investigation",
      "Statistics",
      "Data Analysis",
      "Organization & Planning"
    ],
    "alignedValues": [
      "Helping Others",
      "Innovation & Cutting-Edge Work",
      "Intellectual Challenge",
      "Making a Real Impact",
      "Career Growth"
    ],
    "dayInLife": "Morning lab work: validating a new biosensor calibration protocol, running three replicate tests and logging results meticulously. After lunch, you're in a cross-functional meeting with clinical staff reviewing failure modes for a new patient monitoring device — clinical context changes your design priorities immediately. Mid-afternoon: reviewing FDA regulatory submission documents to ensure your company's new cardiac lead meets the correct testing standards. You spend the last hour of the day reading a paper on flexible electronics that's directly relevant to your current project. Progress feels slow, but the stakes are clear.",
    "pros": [
      "Tangible contribution to human health",
      "Strong job growth and demand",
      "Diverse work environments — lab, hospital, corporate",
      "Interdisciplinary — never stops being interesting"
    ],
    "cons": [
      "Regulatory environment is slow and constraining",
      "Long product development cycles",
      "Lab work can be repetitive at junior levels",
      "Many roles require graduate degree for advancement"
    ],
    "pathways": [
      "Biomedical engineering degree → industry R&D or manufacturing",
      "Mechanical or electrical engineering → specialize in medical devices",
      "Biology + engineering coursework → biotech industry",
      "MD/engineering dual degree → medical device innovation"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&h=500&fit=crop&auto=format"
  },
  {
    "id": "creative-director",
    "title": "Creative Director",
    "field": "Design & Media",
    "fieldColor": "#B04A3A",
    "tagline": "Lead the vision that makes ideas unforgettable.",
    "description": "Creative Directors set the visual, tonal, and conceptual direction for brands, campaigns, products, or publications. You lead teams of designers, copywriters, and art directors — shaping culture through creative strategy. This role requires both exceptional taste and the ability to sell ideas to people who didn't conceive them.",
    "salary": {
      "low": 95000,
      "median": 145000,
      "high": 235000
    },
    "growth": "moderate",
    "growthPct": 8,
    "environments": [
      "Agency",
      "In-house Brand",
      "Remote",
      "Studio"
    ],
    "education": "Portfolio-driven. Design, fine arts, advertising, or film backgrounds common. No single degree required.",
    "personalityFit": {
      "introvert": [
        15,
        80
      ],
      "analytical": [
        50,
        100
      ],
      "structured": [
        15,
        65
      ],
      "collaborative": [
        40,
        85
      ]
    },
    "relatedInterests": [
      "Arts & Design",
      "Writing & Media",
      "Music & Performance",
      "Technology",
      "Psychology & Behavior",
      "People & Society"
    ],
    "requiredSkills": [
      "Creativity",
      "Communication",
      "Leadership",
      "Design Thinking",
      "Writing & Storytelling",
      "Teamwork & Collaboration",
      "Critical Thinking"
    ],
    "alignedValues": [
      "Creative Expression",
      "Recognition & Status",
      "Autonomy & Independence",
      "Innovation & Cutting-Edge Work",
      "Career Growth",
      "Making a Real Impact"
    ],
    "dayInLife": "9am: reviewing three concept directions your team developed overnight for a major automotive rebrand. You see it immediately — direction B has the insight, but direction A has the execution. You articulate why in five minutes, redirect the team, and leave them energized rather than deflated. 11am: presenting campaign work to a skeptical CMO, using the story of the creative process to earn the leap of faith. Lunch: browsing a museum exhibit that gives you an idea for next month's pitch. Afternoon: reviewing type treatments for a packaging system, giving precise feedback on why the tracking on the secondary headline feels aggressive. You care about the smallest details because you know they add up.",
    "pros": [
      "Direct creative ownership at the highest level",
      "High compensation in agency and tech",
      "Broad cultural influence — your work reaches millions",
      "Extremely varied — every project is different"
    ],
    "cons": [
      "High pressure, fast deadlines, demanding clients",
      "Requires years of experience to reach senior roles",
      "Taste is subjective — you'll lose pitches",
      "Leading creative people requires distinct management skill"
    ],
    "pathways": [
      "Design or art school → junior designer → senior designer → art director → CD",
      "Copywriting → creative team → ECD track",
      "Film or photography → campaign/content creative direction",
      "Brand in-house team → creative leadership"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=500&fit=crop&auto=format"
  },
  {
    "id": "nonprofit-program-manager",
    "title": "Nonprofit Program Manager",
    "field": "Social Impact",
    "fieldColor": "#5A8B3A",
    "tagline": "Build programs that change real lives.",
    "description": "Nonprofit Program Managers design, implement, and evaluate programs that serve communities. You work across fundraising, community outreach, evaluation, and operations — keeping programs running, demonstrating impact, and advocating internally for the people you serve. The work is often demanding but rarely meaningless.",
    "salary": {
      "low": 42000,
      "median": 62000,
      "high": 95000
    },
    "growth": "moderate",
    "growthPct": 9,
    "environments": [
      "Office",
      "Community",
      "Hybrid"
    ],
    "education": "Bachelor's in social work, public administration, education, or related field. Master's (MSW, MPH, MPA) helpful for senior roles.",
    "personalityFit": {
      "introvert": [
        20,
        75
      ],
      "analytical": [
        30,
        80
      ],
      "structured": [
        25,
        70
      ],
      "collaborative": [
        55,
        95
      ]
    },
    "relatedInterests": [
      "People & Society",
      "Social Justice",
      "Education & Teaching",
      "Health & Medicine",
      "Environmental Issues",
      "Law & Policy"
    ],
    "requiredSkills": [
      "Communication",
      "Leadership",
      "Project Management",
      "Empathy & Active Listening",
      "Organization & Planning",
      "Teamwork & Collaboration",
      "Writing & Storytelling"
    ],
    "alignedValues": [
      "Helping Others",
      "Making a Real Impact",
      "Social Justice",
      "Community",
      "Work-Life Balance",
      "Collaboration & Teamwork"
    ],
    "dayInLife": "Morning: reviewing participation data from last month's after-school program — attendance is up 22% since you changed the snack policy. Small win, real impact. 10am: grant writing session, articulating outcomes for a $75,000 renewal request in language the funder actually uses. Lunch with a community partner, troubleshooting a referral pipeline that's been losing people. Afternoon: leading a team debrief on a program that didn't land as hoped, facilitating honest reflection without blame. 4pm: meeting a participant who completed the program and landed a job — this is the moment that makes everything else worth it. You're underpaid and often stretched thin, but the work is real.",
    "pros": [
      "High day-to-day meaning and mission alignment",
      "Varied work spanning programs, people, and strategy",
      "Strong culture of collaboration and mutual support",
      "Pathway to executive leadership in sector"
    ],
    "cons": [
      "Compensation lags for-profit sector significantly",
      "Chronic resource constraints create stress",
      "Grant funding creates precarious program cycles",
      "Burnout risk is real without strong boundaries"
    ],
    "pathways": [
      "Social work or public administration degree → program coordinator → manager",
      "Teaching or community organizing → program leadership",
      "Healthcare background → public health program management",
      "Volunteer coordinator → program staff → program manager"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&h=500&fit=crop&auto=format"
  },
  {
    "id": "investment-analyst",
    "title": "Investment Analyst",
    "field": "Finance",
    "fieldColor": "#1A3A6B",
    "tagline": "Find signal in markets where others see noise.",
    "description": "Investment Analysts research companies, industries, and economic trends to inform buy/sell/hold decisions. You build financial models, write investment memos, and present recommendations under pressure. The role rewards analytical precision, intellectual curiosity, and the willingness to defend a thesis when you're right and admit it when you're wrong.",
    "salary": {
      "low": 80000,
      "median": 115000,
      "high": 200000
    },
    "growth": "moderate",
    "growthPct": 8,
    "environments": [
      "Office",
      "Hybrid"
    ],
    "education": "Finance, economics, accounting, or business degree. CFA designation valued. MBA common for advancement.",
    "personalityFit": {
      "introvert": [
        15,
        65
      ],
      "analytical": [
        5,
        45
      ],
      "structured": [
        20,
        65
      ],
      "collaborative": [
        20,
        70
      ]
    },
    "relatedInterests": [
      "Business & Finance",
      "Data & Analytics",
      "Science & Research",
      "Law & Policy",
      "Technology"
    ],
    "requiredSkills": [
      "Data Analysis",
      "Critical Thinking",
      "Research & Investigation",
      "Writing & Storytelling",
      "Statistics",
      "Organization & Planning",
      "Communication"
    ],
    "alignedValues": [
      "High Income",
      "Intellectual Challenge",
      "Career Growth",
      "Recognition & Status",
      "Innovation & Cutting-Edge Work"
    ],
    "dayInLife": "6:30am: scanning overnight market moves and reading the Wall Street Journal before markets open. 7am: updating your financial model after a company's earnings call last night — the revenue beat looks impressive until you see the margin deterioration beneath it. 9am: presenting your thesis on a mid-cap retailer to the portfolio team. The senior PM pushes back on your comparable store analysis; you defend it, then acknowledge the fair critique. Afternoon: visiting a mall to count foot traffic for a consumer discretionary thesis — old-school channel checks still matter. 5pm: updating your coverage universe summary. The work is demanding, competitive, and genuinely intellectually engaging.",
    "pros": [
      "High compensation, especially with performance",
      "Intellectually rigorous and varied",
      "Deep expertise in industries and companies",
      "Clear pathway and meritocratic advancement"
    ],
    "cons": [
      "Demanding hours, especially in junior roles",
      "High-pressure, competitive environment",
      "Market volatility creates job precarity at smaller funds",
      "Work can feel abstract — removed from tangible outcomes"
    ],
    "pathways": [
      "Finance or economics degree → investment banking analyst → buy-side transition",
      "Accounting → Big 4 → corporate finance → buy-side",
      "Any quantitative degree → CFA program → analyst role",
      "Engineering/science → equity research in technical sectors"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=500&fit=crop&auto=format"
  },
  {
    "id": "forensic-scientist",
    "title": "Forensic Scientist",
    "field": "Science & Law",
    "fieldColor": "#5A3A1A",
    "tagline": "Find answers in evidence that cannot lie.",
    "description": "Forensic Scientists collect, analyze, and interpret physical evidence from crime scenes using chemistry, biology, physics, and other scientific disciplines. You work in laboratories and courts, your findings capable of determining guilt or innocence. Precision, objectivity, and integrity are non-negotiable.",
    "salary": {
      "low": 45000,
      "median": 65000,
      "high": 102000
    },
    "growth": "moderate",
    "growthPct": 11,
    "environments": [
      "Laboratory",
      "Crime Scene",
      "Courtroom"
    ],
    "education": "Bachelor's in forensic science, chemistry, biology, or related field. Graduate degree for specialization.",
    "personalityFit": {
      "introvert": [
        10,
        60
      ],
      "analytical": [
        5,
        40
      ],
      "structured": [
        5,
        50
      ],
      "collaborative": [
        15,
        65
      ]
    },
    "relatedInterests": [
      "Science & Research",
      "Law & Policy",
      "Data & Analytics",
      "Engineering",
      "Psychology & Behavior"
    ],
    "requiredSkills": [
      "Scientific Method",
      "Critical Thinking",
      "Research & Investigation",
      "Data Analysis",
      "Organization & Planning",
      "Communication",
      "Writing & Storytelling"
    ],
    "alignedValues": [
      "Intellectual Challenge",
      "Making a Real Impact",
      "Job Stability",
      "Social Justice"
    ],
    "dayInLife": "Morning: receiving and logging a new batch of evidence from a homicide investigation — chain of custody documentation is meticulous and mandatory. You spend three hours running DNA analysis, comparing a recovered sample against the CODIS database. After lunch, you're called to testify in a trial as an expert witness, explaining your methodology to a jury with no science background, under cross-examination from a defense attorney trying to find a flaw in your process. Afternoon: reviewing a colleague's toxicology report before it goes to the prosecutor. The stakes of being wrong are enormous, which means you're never anything but thorough.",
    "pros": [
      "Work with direct justice implications",
      "Intellectually rigorous and multidisciplinary",
      "Relatively stable government employment",
      "Each case is different — never repetitive"
    ],
    "cons": [
      "Salary lower than other STEM fields",
      "Exposure to disturbing material and crime scenes",
      "Government bureaucracy can be slow and frustrating",
      "Court testimony creates professional stress"
    ],
    "pathways": [
      "Forensic science degree → crime laboratory position",
      "Chemistry or biology degree → specialized forensic training",
      "Law enforcement background → forensic specialization",
      "Graduate degree → DNA analysis, toxicology, digital forensics"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1562408590-e32931084e23?w=800&h=500&fit=crop&auto=format"
  },
  {
    "id": "public-interest-lawyer",
    "title": "Public Interest Lawyer",
    "field": "Law & Advocacy",
    "fieldColor": "#6B3A5A",
    "tagline": "Use law as a tool for justice, not just clients.",
    "description": "Public Interest Lawyers work at legal aid organizations, civil rights groups, public defenders' offices, and nonprofits — using legal skills to advance justice for underserved populations. You take the cases that matter most but pay least, often carrying heavy caseloads in exchange for meaningful work.",
    "salary": {
      "low": 48000,
      "median": 72000,
      "high": 118000
    },
    "growth": "stable",
    "growthPct": 6,
    "environments": [
      "Law Office",
      "Courtroom",
      "Community",
      "Hybrid"
    ],
    "education": "Juris Doctor (JD) required + bar admission. Highly competitive admissions. Public interest loan forgiveness programs available.",
    "personalityFit": {
      "introvert": [
        15,
        70
      ],
      "analytical": [
        10,
        55
      ],
      "structured": [
        30,
        70
      ],
      "collaborative": [
        30,
        80
      ]
    },
    "relatedInterests": [
      "Law & Policy",
      "Social Justice",
      "People & Society",
      "Writing & Media",
      "Psychology & Behavior"
    ],
    "requiredSkills": [
      "Critical Thinking",
      "Writing & Storytelling",
      "Research & Investigation",
      "Communication",
      "Negotiation",
      "Public Speaking",
      "Empathy & Active Listening"
    ],
    "alignedValues": [
      "Social Justice",
      "Making a Real Impact",
      "Helping Others",
      "Community",
      "Intellectual Challenge"
    ],
    "dayInLife": "8am: reviewing case files for two eviction hearings today — both clients face homelessness if you lose. You're representing five clients simultaneously. At 10am you're in housing court, arguing that your client's landlord violated proper notice procedures. You win, barely, because you know the procedural rules cold. Afternoon: intake session with a new client referred by a domestic violence shelter — you start the process of securing a protective order. 4pm: you're drafting appellate briefs for a civil rights case that's been years in the making. Every day you face impossible demand against limited resources, and you do it because the alternative — no representation at all — is worse.",
    "pros": [
      "Work that directly serves the most vulnerable",
      "Intellectually demanding legal work",
      "Loan forgiveness programs reduce financial pressure",
      "Strong community of mission-aligned peers"
    ],
    "cons": [
      "Significant salary sacrifice compared to private practice",
      "Caseloads that exceed what one person can reasonably carry",
      "Secondary trauma from client circumstances",
      "Long path through law school with significant debt"
    ],
    "pathways": [
      "Pre-law undergraduate → LSAT → JD → public interest fellowship",
      "Social work background → law school → legal services",
      "Political science or activism background → civil rights law",
      "Criminal justice studies → public defender's office"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&h=500&fit=crop&auto=format"
  },
  {
    "id": "marine-biologist",
    "title": "Marine Conservation Biologist",
    "field": "Science & Environment",
    "fieldColor": "#1A6B7A",
    "tagline": "Understand the ocean before we can protect it.",
    "description": "Marine Conservation Biologists study marine ecosystems, species populations, and environmental threats to inform conservation strategy. You conduct field research, analyze data, publish findings, and collaborate with policymakers and advocacy groups. The work combines rigorous science with urgent environmental stakes.",
    "salary": {
      "low": 42000,
      "median": 64000,
      "high": 102000
    },
    "growth": "moderate",
    "growthPct": 10,
    "environments": [
      "Laboratory",
      "Field Research",
      "Ocean Vessels",
      "Remote"
    ],
    "education": "Bachelor's in marine biology, ecology, or zoology. Master's or PhD typically required for research leadership.",
    "personalityFit": {
      "introvert": [
        10,
        65
      ],
      "analytical": [
        15,
        60
      ],
      "structured": [
        20,
        65
      ],
      "collaborative": [
        25,
        75
      ]
    },
    "relatedInterests": [
      "Nature & Environment",
      "Science & Research",
      "Environmental Issues",
      "Data & Analytics",
      "Engineering"
    ],
    "requiredSkills": [
      "Scientific Method",
      "Research & Investigation",
      "Data Analysis",
      "Statistics",
      "Writing & Storytelling",
      "Critical Thinking",
      "Organization & Planning"
    ],
    "alignedValues": [
      "Making a Real Impact",
      "Intellectual Challenge",
      "Environmental Issues",
      "Autonomy & Independence",
      "Work-Life Balance"
    ],
    "dayInLife": "You're on a research vessel 40 miles offshore. 5am: water sampling before the sun rises, logging GPS coordinates and depth readings. Morning: running acoustic surveys to map fish biomass in a Marine Protected Area. Afternoon: back at the lab aboard the ship, processing samples and entering data, while the vessel moves to the next survey site. Evening: reviewing analysis from last week's dive transects, writing up preliminary findings for your advisor. The work alternates between grueling fieldwork and careful, solitary analysis — and occasionally you surface a finding that will directly influence a fishing quota or a protected area boundary.",
    "pros": [
      "Direct environmental conservation mission",
      "Unique fieldwork experiences inaccessible to other careers",
      "Interdisciplinary — ecology, chemistry, policy, technology",
      "Growing urgency means growing relevance"
    ],
    "cons": [
      "Academic job market is extremely competitive",
      "Salary in academia is often modest",
      "Fieldwork can involve physical difficulty and remote isolation",
      "Publication pressure and grant cycles create anxiety"
    ],
    "pathways": [
      "Marine biology or ecology degree → research assistant → graduate school",
      "Scuba certification + biology background → field research positions",
      "Environmental science → specialization in marine systems",
      "PhD → postdoc → academic or government research position"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=800&h=500&fit=crop&auto=format"
  },
  {
    "id": "learning-experience-designer",
    "title": "Learning Experience Designer",
    "field": "Education & Technology",
    "fieldColor": "#8B6B1A",
    "tagline": "Design the conditions for people to genuinely learn.",
    "description": "Learning Experience Designers create educational programs, courses, and training systems — applying cognitive science, instructional theory, and design thinking. You work in corporate L&D, edtech companies, universities, or nonprofits, building experiences that help people acquire skills and change behavior.",
    "salary": {
      "low": 58000,
      "median": 82000,
      "high": 130000
    },
    "growth": "high",
    "growthPct": 16,
    "environments": [
      "Remote",
      "Office",
      "Hybrid"
    ],
    "education": "Education, instructional design, psychology, or UX design background. Certificates in instructional design widely accepted.",
    "personalityFit": {
      "introvert": [
        15,
        70
      ],
      "analytical": [
        30,
        80
      ],
      "structured": [
        25,
        70
      ],
      "collaborative": [
        35,
        80
      ]
    },
    "relatedInterests": [
      "Education & Teaching",
      "Psychology & Behavior",
      "Arts & Design",
      "Technology",
      "People & Society",
      "Writing & Media"
    ],
    "requiredSkills": [
      "Creativity",
      "Design Thinking",
      "Research & Investigation",
      "Writing & Storytelling",
      "Communication",
      "Organization & Planning",
      "Empathy & Active Listening",
      "Teamwork & Collaboration"
    ],
    "alignedValues": [
      "Helping Others",
      "Creative Expression",
      "Making a Real Impact",
      "Intellectual Challenge",
      "Innovation & Cutting-Edge Work"
    ],
    "dayInLife": "Morning: reviewing learner assessment data from a new leadership module — completion is high but quiz scores reveal a gap in application. You redesign the reflection exercise. 10am: kick-off call with a client's HR team to scope a manager training program — you ask about failure modes, not just desired outcomes. Afternoon: storyboarding a scenario-based e-learning module where learners navigate a difficult feedback conversation. You write dialogue that feels real, not scripted. 4pm: presenting two curriculum approaches to the director, advocating for the more challenging design because you have data supporting its effectiveness. You're part educator, part designer, part researcher — and you care that learning actually happens.",
    "pros": [
      "Meaningful work in a growing, well-compensated field",
      "Creative design work with intellectual rigor",
      "Strong remote opportunities",
      "Applies across virtually every industry"
    ],
    "cons": [
      "Stakeholders often resist learner-centered design approaches",
      "Hard to measure real learning impact vs. completion metrics",
      "Corporate L&D can feel detached from genuine educational goals"
    ],
    "pathways": [
      "Education degree → corporate instructional design",
      "UX design background → learning experience focus",
      "Teacher → transition to digital instructional design",
      "Psychology or HCI → edtech or L&D role"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&h=500&fit=crop&auto=format"
  },
  {
    "id": "ml-engineer",
    "title": "Machine Learning Engineer",
    "field": "Technology & AI",
    "fieldColor": "#1A4A6B",
    "tagline": "Build the systems that learn from data.",
    "description": "Machine Learning Engineers design, train, and deploy models that give computers the ability to learn from data. You sit between research and production — taking ideas from papers and turning them into systems that actually work at scale. The work is technically demanding and commercially significant.",
    "salary": {
      "low": 115000,
      "median": 165000,
      "high": 280000
    },
    "growth": "high",
    "growthPct": 35,
    "environments": [
      "Remote",
      "Office",
      "Hybrid"
    ],
    "education": "CS, mathematics, statistics, or engineering degree. Master's or PhD common in research-focused roles. Strong portfolio can substitute in industry.",
    "personalityFit": {
      "introvert": [
        5,
        60
      ],
      "analytical": [
        5,
        40
      ],
      "structured": [
        15,
        65
      ],
      "collaborative": [
        20,
        70
      ]
    },
    "relatedInterests": [
      "Technology",
      "Science & Research",
      "Data & Analytics",
      "Engineering",
      "Business & Finance"
    ],
    "requiredSkills": [
      "Programming",
      "Statistics",
      "Data Analysis",
      "Critical Thinking",
      "Problem-Solving",
      "Research & Investigation",
      "Scientific Method"
    ],
    "alignedValues": [
      "Innovation & Cutting-Edge Work",
      "Intellectual Challenge",
      "High Income",
      "Career Growth",
      "Autonomy & Independence"
    ],
    "dayInLife": "9am: pulling the latest training metrics for a recommendation model — loss is decreasing but you notice a concerning distribution shift in the validation set. You spend 90 minutes diagnosing a data leakage bug introduced last week. After lunch: code review for a colleague's feature extraction pipeline, catching a subtle off-by-one error in the time windowing logic. 3pm: reading a new paper on retrieval-augmented generation, taking notes on what's applicable to your current project. 4pm: deployment meeting — your team is shipping a ranking model to production next week and you're walking through rollback criteria if the online metrics drop. You work on problems that didn't exist five years ago, using techniques invented in academia and deployed into products used by millions.",
    "pros": [
      "Highest compensation in software engineering",
      "Intellectually frontier — you're building new things",
      "Extremely high demand with career optionality",
      "Remote-first culture at most companies"
    ],
    "cons": [
      "Fast-moving field requires constant relearning",
      "Research-to-production gap is frustrating and common",
      "High competition for top roles",
      "Impact of AI systems is ethically complex"
    ],
    "pathways": [
      "CS or math degree → software engineering → ML specialization",
      "Statistics or physics PhD → industry ML scientist/engineer",
      "Self-taught + portfolio + bootcamp → junior ML role",
      "Domain expert + programming + online ML curriculum → ML engineer in domain"
    ],
    "imageUrl": "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&h=500&fit=crop&auto=format"
  }
];

export function getCareerById(id) {
  return CAREERS.find(c => c.id === id) || null;
}
