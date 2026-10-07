// HISTORICAL / NO LONGER USED BY THE LIVE SITE.
//
// Notes now live in Supabase and are managed from /admin — see README.md
// ("Notes CMS"). This file was migrated into the database by
// scripts/migrate-notes.ts and is kept only as a readable backup of the
// original content. Editing it has no effect on the published site.

export type Note = {
  slug: string;
  title: string;
  date: string; // ISO format, e.g. "2026-03-14"
  excerpt: string;
  body: string[];
  tags: string[]; // also used as the filter pills on /notes — keep this to "tech", "sport", "my thoughts" (mix and match per post)
};

export const notes: Note[] = [
  {
    slug: "getting-into-arsenal-women-wsl",
    title: "Getting into Arsenal Women / the WSL",
    date: "2026-09-15",
    excerpt:
      "I already love football, I already love Arsenal. I just haven't properly followed the women's team before, beyond the odd major tournament.",
    body: [
      "I've always loved football and I've always followed Arsenal, but if I'm honest, the women's team has mostly been something I noticed during major tournaments rather than something I actually followed week to week. I want to properly change that this season.",
      "The 2026/27 WSL season has just started. Arsenal opened with a 1-0 win away at Brighton, then drew 0-0 with Crystal Palace at the Emirates. Manchester United at the Emirates is next, followed by Chelsea away. I'm writing that down mostly so I can look back later and see how wrong my early impressions were.",
      "Part of what I like about this is having another Arsenal team to actually get invested in, rather than treating the women's game as something that only exists during a World Cup or an Olympics every few years.",
      "I'm not pretending to have years of WSL knowledge I don't have. I'm just starting properly now, and I'd rather write that down honestly than pretend I've been across it all along.",
      "I think this ends up being a recurring one, alongside the Arsenal men's posts. We'll see how the Man United game goes.",
    ],
    tags: ["sport"],
  },
  {
    slug: "a-year-in-industry",
    title: "A year in industry",
    date: "2026-09-08",
    excerpt:
      "University teaches you how systems work. Placement has been my first proper look at what happens when those systems absolutely cannot stop working.",
    body: [
      "I started my placement at CME Group in July 2026 as a Systems Resilience Intern, working within Operational Resilience and IT Disaster Recovery.",
      "University teaches you how systems work, mostly in theory, mostly in isolation. Placement has been my first proper look at what happens when those systems absolutely cannot be allowed to stop working, and what 'resilience' actually means once real consequences are attached to it.",
      "I've been working on automation for resilience processes and taking part in disaster recovery exercises, including live failover testing that moves critical systems from on-prem infrastructure over to Google Cloud.",
      "The interesting part to me isn't the cloud technology itself, it's the thinking underneath it. What happens if this goes down. How fast can it actually recover, not how fast the documentation says it should. What else depends on it that nobody's mapped out properly. Has anyone actually tested the recovery plan, or has everyone just assumed it works because it's written down somewhere.",
      "I don't have some big reflective lesson to wrap this up with. Mostly I've just started looking at every system I build, including my own, and asking what happens the day it breaks.",
    ],
    tags: ["my thoughts", "tech"],
  },
  {
    slug: "arsenal-right-now",
    title: "Arsenal right now",
    date: "2026-08-20",
    excerpt:
      "The start of a new season always does something to you as a supporter, whether or not the football actually justifies it yet.",
    body: [
      "I follow Arsenal, so this is probably going to become one of those recurring sections where I write down whatever I'm feeling about the club at a given point in the season, for better or worse.",
      "The start of a new season always does something to you as a supporter. Everything feels possible again for about three weeks, regardless of whether the actual football justifies it yet.",
      "I'm trying not to write this as a news recap, mostly because anything I say about form or fixtures will be out of date within a fortnight anyway. This is closer to: what am I actually watching for this year, what's making me hopeful, what's making me nervous.",
      "I'll probably come back and add more of these through the season rather than trying to say everything in one post. Football's better followed in instalments anyway.",
    ],
    tags: ["sport"],
  },
  {
    slug: "your-camera-roll-has-been-training-for-this",
    title: "Your camera roll has been training for this",
    date: "2026-08-05",
    excerpt:
      "Cupd started from something ridiculously normal: people already take photos of their coffees constantly. I just gave that a place to live.",
    body: [
      "Cupd started from something ridiculously ordinary: people already take photos of their coffee constantly. My camera roll was full of them. My friends' camera rolls were full of them. It's one of those things we photograph without really deciding to.",
      "Cafés get photographed more than almost anything else in daily life, and none of those photos go anywhere. They sit in a camera roll until your phone runs out of storage, then get deleted without ever being looked at again.",
      "So instead of trying to invent a new behaviour, Cupd is built around one people already have. Take a photo. Add the café. Rate the coffee. Share it. That's the whole loop.",
      "The product lesson I keep coming back to is that the best ideas don't always need you to teach people something new. Sometimes you just have to give an existing habit somewhere to live.",
      "Cupd became my first proper iOS app. It's built with React Native and Expo, TypeScript, Supabase on the backend, and Google Places for finding cafés. None of that matters to the person using it, obviously, they just want to remember what the flat white at that place round the corner was actually called.",
    ],
    tags: ["tech"],
  },
  {
    slug: "could-studyni-become-an-app",
    title: "Could StudyNI become an app?",
    date: "2026-07-10",
    excerpt:
      "Past papers contain loads of information about what gets examined and how often. Students normally have to piece that together themselves. I didn't think they should have to.",
    body: [
      "StudyNI started as a way of making CCEA revision less of a guessing game. Past papers contain a huge amount of information about what actually gets examined, how often certain topics come up, and what hasn't appeared in a while. Students are usually left to piece all of that together themselves, subject by subject, year by year.",
      "I started structuring historical CCEA exam data properly, so a student could actually see which topics were highly likely to come up, which were common, and which were occasional, and use that to make better decisions about what to revise next.",
      "Originally that was mostly a website. Then I had the fairly obvious thought: why isn't this something a student just has on their phone?",
      "That's the part I'm building now. Moving from 'useful revision website' towards something a student would actually open every day: topic tracking, confidence ratings, revision streaks, a plan that adjusts based on how you're actually doing, and eventually some AI-assisted revision features on top.",
      "This is still very much in progress, not a finished product I'm describing after the fact. I'll probably write about this again once more of it actually exists.",
    ],
    tags: ["tech"],
  },
  {
    slug: "ai-mind-flayer",
    title: "AI is starting to feel a bit like the Mind Flayer",
    date: "2026-06-18",
    excerpt:
      "Not because AI is evil. Because the visible products are only tiny endpoints of something enormous underneath.",
    body: [
      "I keep thinking about AI infrastructure like the Mind Flayer in Stranger Things. Not because I think AI is some kind of evil hive mind, calm down, but because of the shape of the thing.",
      "You see ChatGPT, Claude, Gemini, some image generator, a chatbot bolted onto an app you already use. That's the visible tendril. Small, contained, sitting right in front of you.",
      "Behind that tendril is something enormous: data centres, racks of GPUs, energy contracts, cooling systems, networking, training runs that take weeks, supply chains for chips that stretch across multiple countries. The product you actually touch is a tiny fraction of what has to exist to make it work.",
      "Every new AI feature feels like another little tendril connecting back into the same underlying system, and the system keeps getting bigger to support more of them.",
      "The question I find more interesting than 'what can AI do' is 'what do we have to build, power, and maintain to make this available everywhere, all the time, to everyone.' That's a much less flashy question and I think it matters more.",
      "Anyway. Tiny visible endpoint, enormous invisible mass underneath. Somewhere, Will Byers is trying to explain this to his mum.",
    ],
    tags: ["tech", "my thoughts"],
  },
  {
    slug: "apple-folding-iphone",
    title: "Apple finally made the folding iPhone",
    date: "2026-05-22",
    excerpt:
      "I've had iPhones since the 6. A genuinely different form factor is far more interesting to me than another normal yearly upgrade.",
    body: [
      "I've always been an Apple person. iPhones from the 6 right through to whatever I'm currently on, which means most of my phone-buying life has been 'same shape, slightly better camera, more expensive.'",
      "So the iPhone Duo actually got my attention. Closed, it's a normal-looking 5.4-inch phone. Opened, it's a 7.6-inch inner display, basically a phone that becomes a small tablet.",
      "The interesting part isn't 'Apple made a foldable.' Samsung and others have been doing that for years, with mixed results and a lot of visible creases. What's interesting is what it means when Apple decides a category is finally ready for them.",
      "Apple has this habit that's somewhere between annoying and genuinely impressive: let everyone else prove the concept, wait until the hinge technology and the software are actually good, then arrive and make it look obvious. They did it with wireless earbuds. They did it with the smartwatch, kind of.",
      "What I actually want to know is whether this is the thing that makes folding phones normal, or whether it stays an expensive toy for people like me who read spec sheets for fun. There's a difference between 'Apple entered the category' and 'the category becomes mainstream,' and I don't think we know which one this is yet.",
      "(Separately: I know there are also rumours about a smaller flip-style iPhone. Different device, different rumour, please don't conflate the two in my replies.)",
    ],
    tags: ["tech"],
  },
  {
    slug: "cloud-has-a-body",
    title: "Cloud has a body",
    date: "2026-04-14",
    excerpt:
      "The cloud sounds abstract and weightless. It isn't. It's data centres, cables, cooling systems, electricity, water, land, and an enormous amount of physical infrastructure.",
    body: [
      "'The cloud' is one of the best pieces of branding the tech industry has ever produced, and also one of the most misleading.",
      "It sounds weightless. Soft, even. You upload a photo and it goes 'to the cloud,' like it's drifting off somewhere harmless above your head.",
      "What it actually means is that your photo is sitting on a physical disk, in a physical building, cooled by physical air conditioning, powered by an actual electricity grid, on actual land that someone had to build on.",
      "Every request you make online has to happen somewhere. Every model that gets trained, every video that gets streamed, every message that gets sent, it all resolves down to hardware sitting in a warehouse, using real water for cooling and real electricity to run.",
      "We never see any of it, which is sort of the point of the abstraction, and also exactly what makes it easy to forget. 'Cloud' is a genuinely useful concept for a user. It's arguably too useful, because it hides the physical system underneath it almost completely.",
      "I don't think this is a warning or a takedown of cloud computing, I use it constantly, I'm literally building products on top of it. I just think it's worth occasionally remembering that 'the cloud' has a body, and that body is somewhere real, plugged into a wall.",
    ],
    tags: ["tech"],
  },
  {
    slug: "eire-og",
    title: "Éire Óg",
    date: "2026-09-05",
    excerpt:
      "Being part of Éire Óg isn't just about playing. It's fixtures and training, yes, but also everything that happens behind the scenes to keep a club standing.",
    body: [
      "I play for Éire Óg, and I'm also on the committee, so I see the club from both sides: the pitch, and everything that has to happen so there's a pitch to play on in the first place.",
      "Training and fixtures are the visible part. What's less visible is the fundraising, the organising, the getting-people-involved, and the amount of unpaid work that goes into keeping a local club running at all.",
      "Earlier this year the club ran a 24 Hour Challenge, 1km every hour for 24 hours, on top of everything else people were already doing, to raise money for the club. It's a small enough idea on paper and a genuinely brutal one to actually do.",
      "What I like about it isn't the challenge itself, it's what it represents. Nobody involved was doing it for a following. They were doing it because the club matters to them and it needed the money.",
      "That's most of what club sport is, honestly. Not the scoreline. The people who turn up to paint the dressing rooms, or run the line, or organise the fundraiser, mostly with no credit at all.",
    ],
    tags: ["sport", "my thoughts"],
  },
  {
    slug: "being-21-and-building-too-many-things",
    title: "Being 21 and building too many things",
    date: "2026-02-11",
    excerpt:
      "I don't really have a five-year founder plan. Most things I've built have started with 'surely this could be better' and then somehow turned into me opening VS Code.",
    body: [
      "I'm 21, doing a Computer Science degree, currently on placement, building Cupd, working on StudyNI, and I can already feel a fourth idea forming somewhere in the back of my head that I haven't told anyone about yet.",
      "I don't really have a grand five-year founder plan. Most things I've built have started with 'surely this could be better' and somehow turned into me opening VS Code before I've properly thought it through.",
      "Cupd started with coffee photos. StudyNI started with trying to make CCEA revision less of a guessing game. Cyclical Apparel started because I wanted to build a brand and see if I could actually run one.",
      "None of these started as a business plan. They started as a mild annoyance, then a prototype, then a decision to keep going a bit longer than was strictly sensible.",
      "I like the stage where something goes from being a note in my phone to something another person can actually open and use. That's the part I chase.",
      "I also apparently have absolutely no ability to leave an idea alone. Ask my group chats.",
    ],
    tags: ["my thoughts"],
  },
  {
    slug: "things-i-want-this-site-to-be",
    title: "Things I want this site to be",
    date: "2026-01-20",
    excerpt:
      "This isn't supposed to be an online CV. It's supposed to be the part of the internet that's actually mine.",
    body: [
      "This website isn't supposed to be an online CV. My projects and work are here because they matter to me, but I wanted somewhere that's actually mine, not just a portfolio with a slightly nicer font.",
      "Social media makes everything feel disposable. You post something, a few people see it for a day, and then it's gone, swallowed by whatever the algorithm decides to show next.",
      "I want Notes to be somewhere I can write about an app I'm building one week, Arsenal the next, some strange thought about cloud infrastructure after that, and something completely unrelated the week after that.",
      "No content strategy. No niche. No 'personal brand.' Just things I thought were worth writing down.",
      "If that means this section sometimes has three posts about football in a row and nothing about code for a month, that's fine. That's kind of the point.",
    ],
    tags: ["my thoughts"],
  },
  {
    slug: "starting-from-a-problem-i-had",
    title: "Starting from a problem I actually had",
    date: "2026-01-12",
    excerpt:
      "Most of what I build starts the same way: I get annoyed at something small, and building a fix is more interesting than living with it.",
    body: [
      "Most of what I build starts the same way: I get annoyed at something small, and building a fix is more interesting than living with it.",
      "Cupd started because I kept forgetting the name of a coffee I liked. StudyNI started because revision advice for CCEA students has always felt like it was written for someone else's exam board.",
      "Neither of those started as 'a startup idea.' They started as a problem, then a rough prototype, then a decision to keep going. I think that order matters more than people give it credit for.",
    ],
    tags: ["tech"],
  },
];
