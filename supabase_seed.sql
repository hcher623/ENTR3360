-- ==============================================================
-- CareerCompass: Supabase Database Schema & Seed Data
-- Compatible with Supabase PostgreSQL (Standard or Extension-ready)
-- ==============================================================

-- 1. TAXONOMY TABLES
CREATE TABLE IF NOT EXISTS public.interests (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    category TEXT DEFAULT 'General'
);

CREATE TABLE IF NOT EXISTS public.skills (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    type TEXT DEFAULT 'Core'
);

CREATE TABLE IF NOT EXISTS public.values (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS public.environments (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
);

-- 2. CAREERS TABLE (15 Complete Careers)
CREATE TABLE IF NOT EXISTS public.careers (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    field TEXT NOT NULL,
    field_color TEXT,
    tagline TEXT,
    description TEXT,
    salary_low INTEGER,
    salary_median INTEGER,
    salary_high INTEGER,
    growth TEXT,
    growth_pct INTEGER,
    environments TEXT[],
    education TEXT,
    personality_fit JSONB,
    related_interests TEXT[],
    required_skills TEXT[],
    aligned_values TEXT[],
    day_in_life TEXT,
    pros TEXT[],
    cons TEXT[],
    trajectory JSONB,
    qualification_tier TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PERSONAS TABLE (7 Complete Personas)
CREATE TABLE IF NOT EXISTS public.personas (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    description TEXT,
    avatar TEXT,
    badge TEXT,
    profile JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. USER PROFILES TABLE (Sample User Profiles)
CREATE TABLE IF NOT EXISTS public.profiles (
    id TEXT PRIMARY KEY,
    user_email TEXT,
    name TEXT NOT NULL,
    archetype_name TEXT,
    personality JSONB,
    interests TEXT[],
    skills TEXT[],
    values TEXT[],
    environment_preference TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. BOOKMARKS / SAVED CAREERS TABLE
CREATE TABLE IF NOT EXISTS public.bookmarks (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    career_id TEXT NOT NULL REFERENCES public.careers(id) ON DELETE CASCADE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================
-- SEED DATA: TAXONOMIES
-- ==============================================================

INSERT INTO public.environments (name) VALUES
('Office'), ('Remote'), ('Hybrid'), ('On-site / Lab')
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.interests (name) VALUES
('Technology'),
('Science & Research'),
('Arts & Design'),
('Health & Medicine'),
('People & Society'),
('Nature & Environment'),
('Business & Finance'),
('Law & Policy'),
('Education & Teaching'),
('Writing & Media'),
('Psychology & Behavior'),
('Data & Analytics'),
('Engineering'),
('Social Justice'),
('Environmental Issues'),
('Music & Performance')
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.skills (name) VALUES
('Critical Thinking'),
('Data Analysis'),
('Writing & Storytelling'),
('Public Speaking'),
('Programming'),
('Research & Investigation'),
('Leadership'),
('Creativity'),
('Empathy & Active Listening'),
('Problem-Solving'),
('Data Visualization'),
('Scientific Method'),
('Negotiation'),
('Teaching & Mentoring'),
('Design Thinking'),
('Statistics'),
('Teamwork & Collaboration'),
('Organization & Planning'),
('Communication'),
('Project Management')
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.values (name) VALUES
('Making a Real Impact'),
('Autonomy & Independence'),
('Work-Life Balance'),
('High Income'),
('Career Growth'),
('Job Stability'),
('Creative Expression'),
('Collaboration & Teamwork'),
('Recognition & Status'),
('Helping Others'),
('Intellectual Challenge'),
('Flexibility'),
('Social Justice'),
('Innovation & Cutting-Edge Work'),
('Community')
ON CONFLICT (name) DO NOTHING;

-- ==============================================================
-- SEED DATA: CAREERS (All 15 In-Depth Careers)
-- ==============================================================

INSERT INTO public.careers (
    id, title, field, field_color, tagline, description,
    salary_low, salary_median, salary_high, growth, growth_pct,
    environments, education, personality_fit, related_interests,
    required_skills, aligned_values, day_in_life, pros, cons,
    trajectory, qualification_tier
) VALUES
(
    'ux-researcher',
    'UX Researcher',
    'Design & Technology',
    '#4F6EB0',
    'Translate human behavior into better products.',
    'UX Researchers study how people interact with products and services, uncovering insights that guide design decisions. You sit at the intersection of psychology, design, and business — running studies, conducting interviews, and turning observations into actionable intelligence.',
    75000,
    105000,
    155000,
    'high',
    19,
    '"Office","Remote","Hybrid"'::text[],
    'Bachelor''s in Psychology, HCI, Design, or related. Many roles accept portfolios over degrees.',
    '{"introvert":[15,65],"analytical":[10,60],"structured":[30,75],"collaborative":[40,85]}'::jsonb,
    '"Psychology & Behavior","Technology","Arts & Design","People & Society","Data & Analytics"'::text[],
    '"Research & Investigation","Empathy & Active Listening","Critical Thinking","Communication","Data Analysis","Writing & Storytelling"'::text[],
    '"Intellectual Challenge","Making a Real Impact","Collaboration & Teamwork","Career Growth"'::text[],
    'Your morning starts with reviewing recordings from yesterday''s user interviews. By 10am you''re in a synthesis session, clustering findings on a virtual whiteboard with two designers. After lunch, you run a moderated usability test with a participant over video call, watching closely as they navigate a new checkout flow — you notice a hesitation at the shipping step no one had flagged. You spend the afternoon writing your weekly insight report, distilling 12 hours of interviews into six clear findings with supporting quotes. You leave knowing the design team will ship something better because of your work.',
    '"High demand across industries","Bridge between human insight and product","Flexible working arrangements common","Collaborative without being sales-driven"'::text[],
    '"Stakeholders don't always act on research","Can feel removed from final design decisions","Research cycles can be slow in fast-moving teams"'::text[],
    NULL,
    'Bachelor''s + Portfolio'
),
(
    'environmental-policy-analyst',
    'Environmental Policy Analyst',
    'Policy & Government',
    '#3A7D5A',
    'Turn scientific evidence into climate action.',
    'Environmental Policy Analysts research, draft, and evaluate policies that govern natural resources, pollution, climate change, and conservation. You translate complex science into language that lawmakers, businesses, and communities can act on — sitting at the intersection of ecology, economics, and governance.',
    58000,
    82000,
    125000,
    'high',
    22,
    '"Office","Field Work","Hybrid"'::text[],
    'Bachelor''s in Environmental Science, Political Science, or Economics. Master''s strongly preferred for senior roles.',
    '{"introvert":[20,70],"analytical":[10,55],"structured":[25,70],"collaborative":[35,80]}'::jsonb,
    '"Environmental Issues","Nature & Environment","Law & Policy","Science & Research","People & Society","Data & Analytics"'::text[],
    '"Research & Investigation","Writing & Storytelling","Critical Thinking","Data Analysis","Communication","Organization & Planning"'::text[],
    '"Making a Real Impact","Social Justice","Intellectual Challenge","Community","Environmental Issues"'::text[],
    'You start the day reviewing a 200-page environmental impact assessment for a proposed solar farm. By 9:30am you''re on a call with a state agency, explaining why their proposed wastewater rule has a significant loophole. After lunch you draft testimony for an upcoming legislative hearing — you have 5 minutes to make a complex aquifer recharge issue crystal clear to people who aren''t scientists. Late afternoon you review comments on a federal rulemaking, categorizing and summarizing 3,000 public submissions. You work because you believe evidence should drive decisions, and sometimes it does.',
    '"Direct connection to environmental outcomes","Intellectually demanding and varied work","Cross-sector — government, NGO, consulting, private","Growing field as climate urgency increases"'::text[],
    '"Policy change is frustratingly slow","Political swings can reverse years of work","Often lower pay in public sector roles"'::text[],
    NULL,
    'Bachelor''s + Portfolio'
),
(
    'data-journalist',
    'Data Journalist',
    'Media & Technology',
    '#8B4A8B',
    'Find the story hiding in the spreadsheet.',
    'Data Journalists use data analysis, statistics, and visualization to uncover and tell compelling news stories. You''re part reporter, part analyst, part designer — equally comfortable running SQL queries and writing long-form narrative. Your stories often expose patterns invisible to traditional reporting.',
    52000,
    78000,
    128000,
    'moderate',
    12,
    '"Office","Remote","Hybrid"'::text[],
    'Journalism, statistics, computer science, or any combination. Portfolio of published work matters far more than specific degree.',
    '{"introvert":[20,75],"analytical":[20,65],"structured":[20,65],"collaborative":[25,70]}'::jsonb,
    '"Writing & Media","Data & Analytics","People & Society","Technology","Social Justice","Law & Policy"'::text[],
    '"Data Analysis","Writing & Storytelling","Research & Investigation","Critical Thinking","Data Visualization","Statistics"'::text[],
    '"Making a Real Impact","Intellectual Challenge","Creative Expression","Social Justice","Autonomy & Independence"'::text[],
    'You wake up with a FOIA request result in your inbox — a city''s traffic stop database from the last four years. You spend the morning cleaning 1.2 million rows in Python, looking for anomalies. By noon you''ve found it: one precinct stops Black drivers at 3.4x the rate of adjacent precincts with similar demographics. You call the police department for comment, then spend the afternoon building the visual story — a map with the disparity overlaid on neighborhood demographics. You file at 7pm. By morning, it''s the most read article on your publication''s site.',
    '"Significant public impact through accountability journalism","Highly varied — every story is a new dataset and domain","Combination of technical and creative skills is rare and valued","Remote-friendly at most publications"'::text[],
    '"Job market is contracting at many legacy outlets","Data scoops can be slow — months per story","Technical work often undervalued by traditional newsroom culture"'::text[],
    NULL,
    'Bachelor''s + Portfolio'
),
(
    'clinical-psychologist',
    'Clinical Psychologist',
    'Healthcare & Mental Health',
    '#C17F3A',
    'Help people understand and change their minds.',
    'Clinical Psychologists assess, diagnose, and treat mental health conditions using evidence-based therapies. You develop deep one-on-one relationships with clients over time, guiding them through everything from anxiety and depression to trauma and personality disorders. The work is intellectually demanding and emotionally rewarding.',
    72000,
    98000,
    152000,
    'high',
    14,
    '"Private Practice","Hospital","Community Clinic"'::text[],
    'Doctoral degree (PhD or PsyD) required for licensure. 5–7 years post-bachelor''s training typical.',
    '{"introvert":[20,70],"analytical":[25,75],"structured":[30,75],"collaborative":[50,95]}'::jsonb,
    '"Psychology & Behavior","Health & Medicine","People & Society","Science & Research","Education & Teaching"'::text[],
    '"Empathy & Active Listening","Critical Thinking","Research & Investigation","Communication","Organization & Planning","Writing & Storytelling"'::text[],
    '"Helping Others","Intellectual Challenge","Making a Real Impact","Autonomy & Independence","Work-Life Balance"'::text[],
    'Your first client arrives at 8am — a college sophomore you''ve been seeing for three months for panic disorder. After 50 minutes, you take detailed notes, update your treatment plan, and review your case formulation. Four more clients fill your morning and early afternoon, each with completely different presentations. At 4pm you attend a case consultation with three colleagues, presenting a complex personality disorder case for peer input. You end the day reviewing research on a new trauma protocol. Private practice means you set your own schedule — but it also means you carry the weight of your clients'' progress with you.',
    '"Profound impact on individual lives","High degree of professional autonomy","Intellectually rich — every client is different","Strong and growing demand"'::text[],
    '"Extremely long training pathway (doctoral + internship)","Emotional labor is real and accumulates","High student debt for many routes","Managed care can constrain treatment approaches"'::text[],
    NULL,
    'Bachelor''s + Portfolio'
),
(
    'urban-planner',
    'Urban & Regional Planner',
    'Government & Design',
    '#4A6B8B',
    'Shape the cities people actually want to live in.',
    'Urban Planners design and regulate land use, transportation, housing, and public spaces to create sustainable, livable communities. You work at the intersection of policy, community engagement, design, and data — translating competing interests into workable plans with real consequences for millions of people.',
    58000,
    80000,
    120000,
    'moderate',
    11,
    '"Government Office","Consulting Firm","Field Visits","Community Meetings"'::text[],
    'Master''s in Urban Planning (MUP) strongly preferred. Bachelor''s entry possible in smaller jurisdictions.',
    '{"introvert":[20,75],"analytical":[30,75],"structured":[25,70],"collaborative":[45,90]}'::jsonb,
    '"People & Society","Nature & Environment","Law & Policy","Arts & Design","Environmental Issues","Data & Analytics"'::text[],
    '"Research & Investigation","Data Analysis","Communication","Organization & Planning","Writing & Storytelling","Problem-Solving","Teamwork & Collaboration"'::text[],
    '"Making a Real Impact","Community","Social Justice","Intellectual Challenge","Work-Life Balance"'::text[],
    'Morning: reviewing traffic impact data for a proposed mixed-use development on a sensitive transit corridor. You flag three issues the applicant''s consultant glossed over. At 10am you lead a community workshop in a neighborhood slated for rezoning — you''re there to listen, not to convince. Residents are skeptical. You take detailed notes and commit to returning with responses. Afternoon: presenting revised transit-oriented development guidelines to the planning commission, defending density recommendations against opposition from existing homeowners. The work is slow, political, sometimes maddening — and occasionally you see a park open, a bus line extend, a neighborhood genuinely improve.',
    '"Tangible, visible impact in the built environment","High variety — transportation, housing, environment, design","Government roles have strong stability and benefits","Growing focus on climate resilience creates new opportunities"'::text[],
    '"Progress is slow — projects span years or decades","Subject to political pressure and community opposition","Public sector salaries lag private consulting"'::text[],
    NULL,
    'Bachelor''s + Portfolio'
),
(
    'product-manager',
    'Technical Product Manager',
    'Technology',
    '#2D6B9B',
    'Own the intersection of technology, users, and business.',
    'Technical Product Managers define what gets built and why, bridging engineering teams and business stakeholders. You prioritize, negotiate, and navigate ambiguity constantly — setting direction for products used by thousands or millions. This role rewards people who are equally comfortable in a technical specification and a strategy meeting.',
    105000,
    148000,
    220000,
    'high',
    21,
    '"Office","Remote","Hybrid"'::text[],
    'No single required path. CS or engineering background common. MBA helpful for senior roles. Many enter from other disciplines.',
    '{"introvert":[25,75],"analytical":[25,75],"structured":[25,70],"collaborative":[55,95]}'::jsonb,
    '"Technology","Business & Finance","Psychology & Behavior","Data & Analytics","People & Society"'::text[],
    '"Communication","Critical Thinking","Problem-Solving","Leadership","Data Analysis","Project Management","Teamwork & Collaboration"'::text[],
    '"Career Growth","High Income","Innovation & Cutting-Edge Work","Making a Real Impact","Intellectual Challenge"'::text[],
    '8am: reviewing analytics dashboards for your product''s key flows, noting a spike in drop-off at onboarding step 3. 9am: sprint planning with your engineering team — you defend the prioritization of a security fix over a new feature request from sales. 11am: customer call with a frustrated enterprise client, listening and translating their pain into a structured product request. Afternoon: writing a product requirements document for next quarter''s major initiative, drawing on user research, competitive analysis, and business metrics. 5pm: you join a design review, giving feedback on four different solutions to the same onboarding problem. You close your laptop knowing ten people made decisions today based partly on your judgment.',
    '"High compensation and career trajectory","Enormous variety — strategy, data, design, engineering","High degree of ownership and influence","Skills transfer across industries"'::text[],
    '"High ambiguity and accountability without direct authority","Can feel like everyone's problems are your problems","Requires extensive context-switching","Difficult to break into without adjacent experience"'::text[],
    NULL,
    'Bachelor''s + Portfolio'
),
(
    'biomedical-engineer',
    'Biomedical Engineer',
    'Science & Engineering',
    '#6B3A9B',
    'Build the tools that heal people.',
    'Biomedical Engineers apply engineering principles to medicine and biology — designing and developing devices, diagnostics, software, and materials that improve patient outcomes. Your work might span prosthetics, imaging systems, wearable sensors, drug delivery, or surgical robotics.',
    72000,
    100000,
    158000,
    'high',
    17,
    '"Laboratory","Manufacturing","Hospital","Office"'::text[],
    'Bachelor''s in Biomedical Engineering or related engineering field. Graduate degree for research roles.',
    '{"introvert":[15,70],"analytical":[5,50],"structured":[20,65],"collaborative":[30,75]}'::jsonb,
    '"Science & Research","Engineering","Health & Medicine","Technology","Data & Analytics"'::text[],
    '"Scientific Method","Problem-Solving","Critical Thinking","Research & Investigation","Statistics","Data Analysis","Organization & Planning"'::text[],
    '"Helping Others","Innovation & Cutting-Edge Work","Intellectual Challenge","Making a Real Impact","Career Growth"'::text[],
    'Morning lab work: validating a new biosensor calibration protocol, running three replicate tests and logging results meticulously. After lunch, you''re in a cross-functional meeting with clinical staff reviewing failure modes for a new patient monitoring device — clinical context changes your design priorities immediately. Mid-afternoon: reviewing FDA regulatory submission documents to ensure your company''s new cardiac lead meets the correct testing standards. You spend the last hour of the day reading a paper on flexible electronics that''s directly relevant to your current project. Progress feels slow, but the stakes are clear.',
    '"Tangible contribution to human health","Strong job growth and demand","Diverse work environments — lab, hospital, corporate","Interdisciplinary — never stops being interesting"'::text[],
    '"Regulatory environment is slow and constraining","Long product development cycles","Lab work can be repetitive at junior levels","Many roles require graduate degree for advancement"'::text[],
    NULL,
    'Bachelor''s + Portfolio'
),
(
    'creative-director',
    'Creative Director',
    'Design & Media',
    '#B04A3A',
    'Lead the vision that makes ideas unforgettable.',
    'Creative Directors set the visual, tonal, and conceptual direction for brands, campaigns, products, or publications. You lead teams of designers, copywriters, and art directors — shaping culture through creative strategy. This role requires both exceptional taste and the ability to sell ideas to people who didn''t conceive them.',
    95000,
    145000,
    235000,
    'moderate',
    8,
    '"Agency","In-house Brand","Remote","Studio"'::text[],
    'Portfolio-driven. Design, fine arts, advertising, or film backgrounds common. No single degree required.',
    '{"introvert":[15,80],"analytical":[50,100],"structured":[15,65],"collaborative":[40,85]}'::jsonb,
    '"Arts & Design","Writing & Media","Music & Performance","Technology","Psychology & Behavior","People & Society"'::text[],
    '"Creativity","Communication","Leadership","Design Thinking","Writing & Storytelling","Teamwork & Collaboration","Critical Thinking"'::text[],
    '"Creative Expression","Recognition & Status","Autonomy & Independence","Innovation & Cutting-Edge Work","Career Growth","Making a Real Impact"'::text[],
    '9am: reviewing three concept directions your team developed overnight for a major automotive rebrand. You see it immediately — direction B has the insight, but direction A has the execution. You articulate why in five minutes, redirect the team, and leave them energized rather than deflated. 11am: presenting campaign work to a skeptical CMO, using the story of the creative process to earn the leap of faith. Lunch: browsing a museum exhibit that gives you an idea for next month''s pitch. Afternoon: reviewing type treatments for a packaging system, giving precise feedback on why the tracking on the secondary headline feels aggressive. You care about the smallest details because you know they add up.',
    '"Direct creative ownership at the highest level","High compensation in agency and tech","Broad cultural influence — your work reaches millions","Extremely varied — every project is different"'::text[],
    '"High pressure, fast deadlines, demanding clients","Requires years of experience to reach senior roles","Taste is subjective — you'll lose pitches","Leading creative people requires distinct management skill"'::text[],
    NULL,
    'Bachelor''s + Portfolio'
),
(
    'nonprofit-program-manager',
    'Nonprofit Program Manager',
    'Social Impact',
    '#5A8B3A',
    'Build programs that change real lives.',
    'Nonprofit Program Managers design, implement, and evaluate programs that serve communities. You work across fundraising, community outreach, evaluation, and operations — keeping programs running, demonstrating impact, and advocating internally for the people you serve. The work is often demanding but rarely meaningless.',
    42000,
    62000,
    95000,
    'moderate',
    9,
    '"Office","Community","Hybrid"'::text[],
    'Bachelor''s in social work, public administration, education, or related field. Master''s (MSW, MPH, MPA) helpful for senior roles.',
    '{"introvert":[20,75],"analytical":[30,80],"structured":[25,70],"collaborative":[55,95]}'::jsonb,
    '"People & Society","Social Justice","Education & Teaching","Health & Medicine","Environmental Issues","Law & Policy"'::text[],
    '"Communication","Leadership","Project Management","Empathy & Active Listening","Organization & Planning","Teamwork & Collaboration","Writing & Storytelling"'::text[],
    '"Helping Others","Making a Real Impact","Social Justice","Community","Work-Life Balance","Collaboration & Teamwork"'::text[],
    'Morning: reviewing participation data from last month''s after-school program — attendance is up 22% since you changed the snack policy. Small win, real impact. 10am: grant writing session, articulating outcomes for a $75,000 renewal request in language the funder actually uses. Lunch with a community partner, troubleshooting a referral pipeline that''s been losing people. Afternoon: leading a team debrief on a program that didn''t land as hoped, facilitating honest reflection without blame. 4pm: meeting a participant who completed the program and landed a job — this is the moment that makes everything else worth it. You''re underpaid and often stretched thin, but the work is real.',
    '"High day-to-day meaning and mission alignment","Varied work spanning programs, people, and strategy","Strong culture of collaboration and mutual support","Pathway to executive leadership in sector"'::text[],
    '"Compensation lags for-profit sector significantly","Chronic resource constraints create stress","Grant funding creates precarious program cycles","Burnout risk is real without strong boundaries"'::text[],
    NULL,
    'Bachelor''s + Portfolio'
),
(
    'investment-analyst',
    'Investment Analyst',
    'Finance',
    '#1A3A6B',
    'Find signal in markets where others see noise.',
    'Investment Analysts research companies, industries, and economic trends to inform buy/sell/hold decisions. You build financial models, write investment memos, and present recommendations under pressure. The role rewards analytical precision, intellectual curiosity, and the willingness to defend a thesis when you''re right and admit it when you''re wrong.',
    80000,
    115000,
    200000,
    'moderate',
    8,
    '"Office","Hybrid"'::text[],
    'Finance, economics, accounting, or business degree. CFA designation valued. MBA common for advancement.',
    '{"introvert":[15,65],"analytical":[5,45],"structured":[20,65],"collaborative":[20,70]}'::jsonb,
    '"Business & Finance","Data & Analytics","Science & Research","Law & Policy","Technology"'::text[],
    '"Data Analysis","Critical Thinking","Research & Investigation","Writing & Storytelling","Statistics","Organization & Planning","Communication"'::text[],
    '"High Income","Intellectual Challenge","Career Growth","Recognition & Status","Innovation & Cutting-Edge Work"'::text[],
    '6:30am: scanning overnight market moves and reading the Wall Street Journal before markets open. 7am: updating your financial model after a company''s earnings call last night — the revenue beat looks impressive until you see the margin deterioration beneath it. 9am: presenting your thesis on a mid-cap retailer to the portfolio team. The senior PM pushes back on your comparable store analysis; you defend it, then acknowledge the fair critique. Afternoon: visiting a mall to count foot traffic for a consumer discretionary thesis — old-school channel checks still matter. 5pm: updating your coverage universe summary. The work is demanding, competitive, and genuinely intellectually engaging.',
    '"High compensation, especially with performance","Intellectually rigorous and varied","Deep expertise in industries and companies","Clear pathway and meritocratic advancement"'::text[],
    '"Demanding hours, especially in junior roles","High-pressure, competitive environment","Market volatility creates job precarity at smaller funds","Work can feel abstract — removed from tangible outcomes"'::text[],
    NULL,
    'Bachelor''s + Portfolio'
),
(
    'forensic-scientist',
    'Forensic Scientist',
    'Science & Law',
    '#5A3A1A',
    'Find answers in evidence that cannot lie.',
    'Forensic Scientists collect, analyze, and interpret physical evidence from crime scenes using chemistry, biology, physics, and other scientific disciplines. You work in laboratories and courts, your findings capable of determining guilt or innocence. Precision, objectivity, and integrity are non-negotiable.',
    45000,
    65000,
    102000,
    'moderate',
    11,
    '"Laboratory","Crime Scene","Courtroom"'::text[],
    'Bachelor''s in forensic science, chemistry, biology, or related field. Graduate degree for specialization.',
    '{"introvert":[10,60],"analytical":[5,40],"structured":[5,50],"collaborative":[15,65]}'::jsonb,
    '"Science & Research","Law & Policy","Data & Analytics","Engineering","Psychology & Behavior"'::text[],
    '"Scientific Method","Critical Thinking","Research & Investigation","Data Analysis","Organization & Planning","Communication","Writing & Storytelling"'::text[],
    '"Intellectual Challenge","Making a Real Impact","Job Stability","Social Justice"'::text[],
    'Morning: receiving and logging a new batch of evidence from a homicide investigation — chain of custody documentation is meticulous and mandatory. You spend three hours running DNA analysis, comparing a recovered sample against the CODIS database. After lunch, you''re called to testify in a trial as an expert witness, explaining your methodology to a jury with no science background, under cross-examination from a defense attorney trying to find a flaw in your process. Afternoon: reviewing a colleague''s toxicology report before it goes to the prosecutor. The stakes of being wrong are enormous, which means you''re never anything but thorough.',
    '"Work with direct justice implications","Intellectually rigorous and multidisciplinary","Relatively stable government employment","Each case is different — never repetitive"'::text[],
    '"Salary lower than other STEM fields","Exposure to disturbing material and crime scenes","Government bureaucracy can be slow and frustrating","Court testimony creates professional stress"'::text[],
    NULL,
    'Bachelor''s + Portfolio'
),
(
    'public-interest-lawyer',
    'Public Interest Lawyer',
    'Law & Advocacy',
    '#6B3A5A',
    'Use law as a tool for justice, not just clients.',
    'Public Interest Lawyers work at legal aid organizations, civil rights groups, public defenders'' offices, and nonprofits — using legal skills to advance justice for underserved populations. You take the cases that matter most but pay least, often carrying heavy caseloads in exchange for meaningful work.',
    48000,
    72000,
    118000,
    'stable',
    6,
    '"Law Office","Courtroom","Community","Hybrid"'::text[],
    'Juris Doctor (JD) required + bar admission. Highly competitive admissions. Public interest loan forgiveness programs available.',
    '{"introvert":[15,70],"analytical":[10,55],"structured":[30,70],"collaborative":[30,80]}'::jsonb,
    '"Law & Policy","Social Justice","People & Society","Writing & Media","Psychology & Behavior"'::text[],
    '"Critical Thinking","Writing & Storytelling","Research & Investigation","Communication","Negotiation","Public Speaking","Empathy & Active Listening"'::text[],
    '"Social Justice","Making a Real Impact","Helping Others","Community","Intellectual Challenge"'::text[],
    '8am: reviewing case files for two eviction hearings today — both clients face homelessness if you lose. You''re representing five clients simultaneously. At 10am you''re in housing court, arguing that your client''s landlord violated proper notice procedures. You win, barely, because you know the procedural rules cold. Afternoon: intake session with a new client referred by a domestic violence shelter — you start the process of securing a protective order. 4pm: you''re drafting appellate briefs for a civil rights case that''s been years in the making. Every day you face impossible demand against limited resources, and you do it because the alternative — no representation at all — is worse.',
    '"Work that directly serves the most vulnerable","Intellectually demanding legal work","Loan forgiveness programs reduce financial pressure","Strong community of mission-aligned peers"'::text[],
    '"Significant salary sacrifice compared to private practice","Caseloads that exceed what one person can reasonably carry","Secondary trauma from client circumstances","Long path through law school with significant debt"'::text[],
    NULL,
    'Bachelor''s + Portfolio'
),
(
    'marine-biologist',
    'Marine Conservation Biologist',
    'Science & Environment',
    '#1A6B7A',
    'Understand the ocean before we can protect it.',
    'Marine Conservation Biologists study marine ecosystems, species populations, and environmental threats to inform conservation strategy. You conduct field research, analyze data, publish findings, and collaborate with policymakers and advocacy groups. The work combines rigorous science with urgent environmental stakes.',
    42000,
    64000,
    102000,
    'moderate',
    10,
    '"Laboratory","Field Research","Ocean Vessels","Remote"'::text[],
    'Bachelor''s in marine biology, ecology, or zoology. Master''s or PhD typically required for research leadership.',
    '{"introvert":[10,65],"analytical":[15,60],"structured":[20,65],"collaborative":[25,75]}'::jsonb,
    '"Nature & Environment","Science & Research","Environmental Issues","Data & Analytics","Engineering"'::text[],
    '"Scientific Method","Research & Investigation","Data Analysis","Statistics","Writing & Storytelling","Critical Thinking","Organization & Planning"'::text[],
    '"Making a Real Impact","Intellectual Challenge","Environmental Issues","Autonomy & Independence","Work-Life Balance"'::text[],
    'You''re on a research vessel 40 miles offshore. 5am: water sampling before the sun rises, logging GPS coordinates and depth readings. Morning: running acoustic surveys to map fish biomass in a Marine Protected Area. Afternoon: back at the lab aboard the ship, processing samples and entering data, while the vessel moves to the next survey site. Evening: reviewing analysis from last week''s dive transects, writing up preliminary findings for your advisor. The work alternates between grueling fieldwork and careful, solitary analysis — and occasionally you surface a finding that will directly influence a fishing quota or a protected area boundary.',
    '"Direct environmental conservation mission","Unique fieldwork experiences inaccessible to other careers","Interdisciplinary — ecology, chemistry, policy, technology","Growing urgency means growing relevance"'::text[],
    '"Academic job market is extremely competitive","Salary in academia is often modest","Fieldwork can involve physical difficulty and remote isolation","Publication pressure and grant cycles create anxiety"'::text[],
    NULL,
    'Bachelor''s + Portfolio'
),
(
    'learning-experience-designer',
    'Learning Experience Designer',
    'Education & Technology',
    '#8B6B1A',
    'Design the conditions for people to genuinely learn.',
    'Learning Experience Designers create educational programs, courses, and training systems — applying cognitive science, instructional theory, and design thinking. You work in corporate L&D, edtech companies, universities, or nonprofits, building experiences that help people acquire skills and change behavior.',
    58000,
    82000,
    130000,
    'high',
    16,
    '"Remote","Office","Hybrid"'::text[],
    'Education, instructional design, psychology, or UX design background. Certificates in instructional design widely accepted.',
    '{"introvert":[15,70],"analytical":[30,80],"structured":[25,70],"collaborative":[35,80]}'::jsonb,
    '"Education & Teaching","Psychology & Behavior","Arts & Design","Technology","People & Society","Writing & Media"'::text[],
    '"Creativity","Design Thinking","Research & Investigation","Writing & Storytelling","Communication","Organization & Planning","Empathy & Active Listening","Teamwork & Collaboration"'::text[],
    '"Helping Others","Creative Expression","Making a Real Impact","Intellectual Challenge","Innovation & Cutting-Edge Work"'::text[],
    'Morning: reviewing learner assessment data from a new leadership module — completion is high but quiz scores reveal a gap in application. You redesign the reflection exercise. 10am: kick-off call with a client''s HR team to scope a manager training program — you ask about failure modes, not just desired outcomes. Afternoon: storyboarding a scenario-based e-learning module where learners navigate a difficult feedback conversation. You write dialogue that feels real, not scripted. 4pm: presenting two curriculum approaches to the director, advocating for the more challenging design because you have data supporting its effectiveness. You''re part educator, part designer, part researcher — and you care that learning actually happens.',
    '"Meaningful work in a growing, well-compensated field","Creative design work with intellectual rigor","Strong remote opportunities","Applies across virtually every industry"'::text[],
    '"Stakeholders often resist learner-centered design approaches","Hard to measure real learning impact vs. completion metrics","Corporate L&D can feel detached from genuine educational goals"'::text[],
    NULL,
    'Bachelor''s + Portfolio'
),
(
    'ml-engineer',
    'Machine Learning Engineer',
    'Technology & AI',
    '#1A4A6B',
    'Build the systems that learn from data.',
    'Machine Learning Engineers design, train, and deploy models that give computers the ability to learn from data. You sit between research and production — taking ideas from papers and turning them into systems that actually work at scale. The work is technically demanding and commercially significant.',
    115000,
    165000,
    280000,
    'high',
    35,
    '"Remote","Office","Hybrid"'::text[],
    'CS, mathematics, statistics, or engineering degree. Master''s or PhD common in research-focused roles. Strong portfolio can substitute in industry.',
    '{"introvert":[5,60],"analytical":[5,40],"structured":[15,65],"collaborative":[20,70]}'::jsonb,
    '"Technology","Science & Research","Data & Analytics","Engineering","Business & Finance"'::text[],
    '"Programming","Statistics","Data Analysis","Critical Thinking","Problem-Solving","Research & Investigation","Scientific Method"'::text[],
    '"Innovation & Cutting-Edge Work","Intellectual Challenge","High Income","Career Growth","Autonomy & Independence"'::text[],
    '9am: pulling the latest training metrics for a recommendation model — loss is decreasing but you notice a concerning distribution shift in the validation set. You spend 90 minutes diagnosing a data leakage bug introduced last week. After lunch: code review for a colleague''s feature extraction pipeline, catching a subtle off-by-one error in the time windowing logic. 3pm: reading a new paper on retrieval-augmented generation, taking notes on what''s applicable to your current project. 4pm: deployment meeting — your team is shipping a ranking model to production next week and you''re walking through rollback criteria if the online metrics drop. You work on problems that didn''t exist five years ago, using techniques invented in academia and deployed into products used by millions.',
    '"Highest compensation in software engineering","Intellectually frontier — you're building new things","Extremely high demand with career optionality","Remote-first culture at most companies"'::text[],
    '"Fast-moving field requires constant relearning","Research-to-production gap is frustrating and common","High competition for top roles","Impact of AI systems is ethically complex"'::text[],
    NULL,
    'Bachelor''s + Portfolio'
)
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    field = EXCLUDED.field,
    tagline = EXCLUDED.tagline,
    description = EXCLUDED.description,
    salary_median = EXCLUDED.salary_median,
    growth_pct = EXCLUDED.growth_pct;

-- ==============================================================
-- SEED DATA: PERSONAS (7 Personas)
-- ==============================================================

INSERT INTO public.personas (id, name, role, description, avatar, badge, profile) VALUES
(
    'priya',
    'Priya',
    'Pre-med student reconsidering her path',
    'Strong clinical foundation, deeply empathetic, but questioning the 10-year residency route. Wants to help people with research-backed impact without hospital burnout.',
    '👩‍⚕️',
    'Health & Human Focus',
    '{"name":"Priya","personality":{"introvert":30,"analytical":25,"structured":45,"collaborative":65},"interests":["Health & Medicine","Psychology & Behavior","People & Society","Science & Research"],"skills":["Empathy & Active Listening","Research & Investigation","Critical Thinking","Communication","Scientific Method"],"values":["Helping Others","Intellectual Challenge","Making a Real Impact"],"environment":"Hybrid"}'::jsonb
),
(
    'marcus',
    'Marcus',
    'CS graduate unsure whether to stay in tech',
    'Technically gifted programmer who feels disconnected from purely commercial software. Looking for roles at the intersection of AI, policy, ethics, and tangible systems.',
    '👨‍💻',
    'Tech & Systems',
    '{"name":"Marcus","personality":{"introvert":25,"analytical":15,"structured":40,"collaborative":45},"interests":["Technology","Data & Analytics","Business & Finance","Social Justice"],"skills":["Programming","Data Analysis","Critical Thinking","Problem-Solving","Statistics"],"values":["Intellectual Challenge","Innovation & Cutting-Edge Work","High Income","Making a Real Impact"],"environment":"Remote"}'::jsonb
),
(
    'leah',
    'Leah',
    'Art school grad looking for meaningful work',
    'Creative storyteller seeking a stable, high-impact career that bridges visual design, human understanding, and social education without corporate emptiness.',
    '🎨',
    'Creative & Design',
    '{"name":"Leah","personality":{"introvert":55,"analytical":80,"structured":70,"collaborative":60},"interests":["Arts & Design","People & Society","Writing & Media","Education & Teaching","Social Justice"],"skills":["Creativity","Communication","Design Thinking","Writing & Storytelling","Empathy & Active Listening"],"values":["Creative Expression","Making a Real Impact","Community","Helping Others"],"environment":"Hybrid"}'::jsonb
),
(
    'jordan',
    'Jordan',
    'Environmental studies senior torn between policy & field work',
    'Deeply committed to climate action, loves data models, but wants to see tangible community outcomes rather than bureaucratic paperwork.',
    '🌱',
    'Climate & Policy',
    '{"name":"Jordan","personality":{"introvert":45,"analytical":20,"structured":50,"collaborative":70},"interests":["Nature & Environment","Environmental Issues","Law & Policy","Data & Analytics"],"skills":["Research & Investigation","Data Analysis","Project Management","Communication"],"values":["Making a Real Impact","Autonomy & Independence","Community"],"environment":"Hybrid"}'::jsonb
),
(
    'elena',
    'Elena',
    'Graphic designer pivoting toward high-tech product design',
    'Experienced in branding and typography, now transitioning into UX and human-computer interaction for accessible software platforms.',
    '🎨',
    'UX & Product',
    '{"name":"Elena","personality":{"introvert":60,"analytical":40,"structured":65,"collaborative":75},"interests":["Arts & Design","Technology","Psychology & Behavior","Writing & Media"],"skills":["Design Thinking","Creativity","Empathy & Active Listening","Teamwork & Collaboration"],"values":["Creative Expression","Intellectual Challenge","Work-Life Balance"],"environment":"Remote"}'::jsonb
),
(
    'samir',
    'Samir',
    'Economics graduate evaluating social finance vs tech analytics',
    'Strong quantitative instincts, passionate about economic mobility and ethical algorithms. Wants high rigor with human impact.',
    '📊',
    'Analytics & Finance',
    '{"name":"Samir","personality":{"introvert":35,"analytical":15,"structured":30,"collaborative":50},"interests":["Business & Finance","Data & Analytics","Technology","Social Justice"],"skills":["Data Analysis","Statistics","Critical Thinking","Problem-Solving"],"values":["High Income","Intellectual Challenge","Making a Real Impact"],"environment":"Hybrid"}'::jsonb
),
(
    'maya',
    'Maya',
    'Education advocate building digital learning tools',
    'Former high school tutor passionate about scalable educational technology, curriculum redesign, and student motivation.',
    '📚',
    'EdTech & Learning',
    '{"name":"Maya","personality":{"introvert":40,"analytical":50,"structured":55,"collaborative":80},"interests":["Education & Teaching","People & Society","Writing & Media","Technology"],"skills":["Teaching & Mentoring","Communication","Writing & Storytelling","Project Management"],"values":["Helping Others","Making a Real Impact","Collaboration & Teamwork"],"environment":"Remote"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    description = EXCLUDED.description,
    profile = EXCLUDED.profile;

-- ==============================================================
-- SEED DATA: USER PROFILES (8 Sample Users)
-- ==============================================================

INSERT INTO public.profiles (
    id, user_email, name, archetype_name, personality,
    interests, skills, values, environment_preference, created_at
) VALUES
(
    'usr_001',
    'priya.patel@example.com',
    'Priya Patel',
    'Strategic Collaborator',
    '{"introvert":30,"analytical":25,"structured":45,"collaborative":65}'::jsonb,
    '"Health & Medicine","Psychology & Behavior","People & Society"'::text[],
    '"Empathy & Active Listening","Research & Investigation","Critical Thinking"'::text[],
    '"Helping Others","Intellectual Challenge","Making a Real Impact"'::text[],
    'Hybrid',
    '2026-10-01T10:00:00Z'
),
(
    'usr_002',
    'marcus.chen@example.com',
    'Marcus Chen',
    'Systematic Thinker',
    '{"introvert":25,"analytical":15,"structured":40,"collaborative":45}'::jsonb,
    '"Technology","Data & Analytics","Social Justice"'::text[],
    '"Programming","Data Analysis","Statistics","Problem-Solving"'::text[],
    '"Intellectual Challenge","High Income","Innovation & Cutting-Edge Work"'::text[],
    'Remote',
    '2026-10-02T11:30:00Z'
),
(
    'usr_003',
    'leah.ross@example.com',
    'Leah Ross',
    'Creative Connector',
    '{"introvert":55,"analytical":80,"structured":70,"collaborative":60}'::jsonb,
    '"Arts & Design","People & Society","Education & Teaching"'::text[],
    '"Creativity","Communication","Design Thinking","Writing & Storytelling"'::text[],
    '"Creative Expression","Community","Helping Others"'::text[],
    'Hybrid',
    '2026-10-03T09:15:00Z'
),
(
    'usr_004',
    'alex.morales@example.com',
    'Alex Morales',
    'Deep Specialist',
    '{"introvert":20,"analytical":15,"structured":30,"collaborative":35}'::jsonb,
    '"Science & Research","Environmental Issues","Data & Analytics"'::text[],
    '"Scientific Method","Data Analysis","Critical Thinking","Research & Investigation"'::text[],
    '"Intellectual Challenge","Autonomy & Independence","Job Stability"'::text[],
    'On-site',
    '2026-10-05T14:20:00Z'
),
(
    'usr_005',
    'chloe.dupont@example.com',
    'Chloe Dupont',
    'Structured Visionary',
    '{"introvert":45,"analytical":35,"structured":25,"collaborative":75}'::jsonb,
    '"Technology","Business & Finance","Arts & Design"'::text[],
    '"Project Management","Leadership","Communication","Problem-Solving"'::text[],
    '"Career Growth","Making a Real Impact","High Income"'::text[],
    'Hybrid',
    '2026-10-07T16:45:00Z'
),
(
    'usr_006',
    'devon.king@example.com',
    'Devon King',
    'Organized Catalyst',
    '{"introvert":40,"analytical":45,"structured":20,"collaborative":80}'::jsonb,
    '"Social Justice","Law & Policy","People & Society"'::text[],
    '"Public Speaking","Negotiation","Organization & Planning","Leadership"'::text[],
    '"Making a Real Impact","Helping Others","Recognition & Status"'::text[],
    'Office',
    '2026-10-10T12:00:00Z'
),
(
    'usr_007',
    'taylor.brooks@example.com',
    'Taylor Brooks',
    'Independent Creative',
    '{"introvert":65,"analytical":70,"structured":80,"collaborative":30}'::jsonb,
    '"Writing & Media","Arts & Design","Psychology & Behavior"'::text[],
    '"Writing & Storytelling","Creativity","Research & Investigation"'::text[],
    '"Autonomy & Independence","Work-Life Balance","Creative Expression"'::text[],
    'Remote',
    '2026-10-12T08:30:00Z'
),
(
    'usr_008',
    'hassan.student@example.com',
    'Hassan Student',
    'Versatile Explorer',
    '{"introvert":50,"analytical":50,"structured":50,"collaborative":50}'::jsonb,
    '"Technology","Business & Finance","Engineering","Data & Analytics"'::text[],
    '"Problem-Solving","Project Management","Critical Thinking","Programming"'::text[],
    '"Making a Real Impact","Career Growth","High Income"'::text[],
    'Hybrid',
    '2026-10-15T11:10:00Z'
)
ON CONFLICT (id) DO NOTHING;

-- ==============================================================
-- SEED DATA: BOOKMARKS (14 Sample Favorited Careers)
-- ==============================================================

INSERT INTO public.bookmarks (id, user_id, career_id, notes, created_at) VALUES
(
    1,
    'usr_001',
    'clinical-psychologist',
    'Top match from pre-med pivot.',
    '2026-10-01T10:15:00Z'
),
(
    2,
    'usr_001',
    'public-interest-lawyer',
    'High impact advocacy route.',
    '2026-10-01T10:20:00Z'
),
(
    3,
    'usr_001',
    'ux-researcher',
    'Psychology in tech application.',
    '2026-10-01T10:25:00Z'
),
(
    4,
    'usr_002',
    'machine-learning-engineer',
    'Core technical path.',
    '2026-10-02T11:40:00Z'
),
(
    5,
    'usr_002',
    'climate-data-scientist',
    'Intersection of data and physical science.',
    '2026-10-02T11:45:00Z'
),
(
    6,
    'usr_002',
    'technical-product-manager',
    'Cross-functional systems leadership.',
    '2026-10-02T11:50:00Z'
),
(
    7,
    'usr_003',
    'learning-experience-designer',
    'Design meets human pedagogy.',
    '2026-10-03T09:30:00Z'
),
(
    8,
    'usr_003',
    'creative-director',
    'Strategic creative leadership.',
    '2026-10-03T09:35:00Z'
),
(
    9,
    'usr_004',
    'clean-energy-engineer',
    'Renewable infrastructure focus.',
    '2026-10-05T14:30:00Z'
),
(
    10,
    'usr_004',
    'environmental-policy-analyst',
    'Regulatory impact.',
    '2026-10-05T14:35:00Z'
),
(
    11,
    'usr_005',
    'technical-product-manager',
    'Strategic execution.',
    '2026-10-07T17:00:00Z'
),
(
    12,
    'usr_006',
    'nonprofit-program-manager',
    'Community leadership role.',
    '2026-10-10T12:10:00Z'
),
(
    13,
    'usr_007',
    'data-journalist',
    'Investigative storytelling.',
    '2026-10-12T08:45:00Z'
),
(
    14,
    'usr_008',
    'quantitative-analyst',
    'Algorithmic decision-making.',
    '2026-10-15T11:20:00Z'
)
ON CONFLICT (id) DO NOTHING;
