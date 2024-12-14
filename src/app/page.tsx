import { ExperienceCard } from "@/components/ExperienceCard";
import { SectionTitle } from "@/components/SectionTitle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  return (
    <div className="container mx-auto max-w-screen-lg items-center lg:pt-16 xl:pt-40">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center h-full">
        <div className="order-2 lg:order-1 flex justify-center">
          <div className="w-200 h-337 overflow-hidden rounded-full">
            <Image
              src="/avatar.png"
              alt="Avatar"
              width="260"
              height="337"
              objectFit="cover"
            />
          </div>
        </div>

        <div className="order-1 lg:order-2 text-center lg:text-left lg:col-span-2">
          <div>
            <span className="text-3xl lg:text-6xl">Hello! I&apos;m </span>
            <span className="text-3xl lg:text-6xl font-bold text-slate-500">
              Andrew
            </span>
            <p className="text-lg lg:text-2xl pt-3 lg:pt-4">
              I&apos;m a software developer with a passion for frontend
              development.
            </p>

            <div className="flex justify-center lg:justify-start mt-4 lg:mt-2">
              <Button
                className="bg-slate-500 text-white px-6 py-3 rounded-lg text-lg flex items-center uppercase"
                asChild
              >
                <Link
                  href="https://www.linkedin.com/in/devajlai/"
                  target="_blank"
                >
                  Say hello!
                  <Icons.linkedin />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden lg:block relative pt-8">
        <span className="absolute left-1/2 transform -translate-x-1/2">
          <span className="relative flex items-center justify-center">
            <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-[0.75rem] inline-block border border-slate-500 border-t-0 border-r-[3px] border-b-[3px] border-l-0 p-[3px] rotate-45"></div>
            <span className="vertical-line uppercase text-[10px] tracking-[0.7em] translate-x-[3px]">
              Scroll
            </span>
          </span>
        </span>
      </div>

      <section className="px-4 grid grid-cols-1 lg:grid-cols-2 grid-rows-[auto,auto] gap-y-16 lg:gap-x-16 pt-12 lg:pt-24">
        <div>
          <SectionTitle>
            <span>What&apos;s&nbsp;</span>
            <span className="text-slate-500 font-bold">nehno</span>
            <span>?</span>
          </SectionTitle>
          <div className="container flex pt-5 max-w-lg leading-[1.75rem]">
            My first son used to always yell &quot;nehno!&quot; at us while
            giggling and to this day we still don&apos;t know what he meant.
            It&apos;s easy enough for a toddler to say so here we are 😛
          </div>
        </div>

        <div className="lg:col-start-2 lg:row-start-2">
          <SectionTitle position="right">
            <span>About me</span>
          </SectionTitle>

          <div className="container pt-5 max-w-lg leading-[1.75rem]">
            <p>
              II&apos;m a full-stack developer based in the San Francisco Bay
              Area, California, where I live with my wife and two sons. While I
              have experience across the full stack, my true passion lies in
              frontend development. I find it incredibly rewarding to work with
              visuals and see the immediate impact of my creations in real-time.
            </p>
            <div className="flex justify-center pt-6 pb-3">
              <Avatar className="w-36 h-36">
                <AvatarImage
                  className="object-cover"
                  src="/kumo.jpg"
                  alt="Kumo"
                />
                <AvatarFallback>Kumo</AvatarFallback>
              </Avatar>
            </div>
            <p>
              We had a beloved Japanese Spitz named Kumo, with soft white fur
              that made him look like a cloud. Sadly, he passed away at the
              start of 2024, and we miss him deeply every day.
            </p>
          </div>
        </div>
      </section>

      <section className="pt-16 lg:pt-32">
        <h3 className="flex text-2xl lg:text-3xl px-4">Experience</h3>
        <div className="mt-8">
          <ExperienceCard
            dateRange="Sep 2022 – Present"
            title="Founding Engineer · Matchday, Inc."
            body="One of the first two founding engineers in establishing and building the core product and technical infrastructure of the company. My primary focus was developing the company's flagship website, which featured a mini-game and a marketplace that supported both fiat currency and USDC transactions on the Solana blockchain. Over time, my responsibilities expanded to encompass the entire tech stack, including the platform backend, AI integrations, and the game backend, which was built using Rust."
            badges={[
              "React",
              "Typescript",
              "Next.js",
              "GraphQL",
              "PostgreSQL",
              "Rust",
              "Web3",
              "OpenAI",
              "Groq",
              "Langchain",
              "Vue.js",
              "gRPC",
              "Python",
            ]}
            url="https://www.matchday.com"
          />
          <ExperienceCard
            dateRange="Nov 2020 – Sep 2022"
            title="Principal Software Engineer · Duetto"
            body="Architected and developed a fully independent application from scratch using React, Webpack, Express, TypeScript, and GraphQL, ensuring a seamless user experience between the existing monolithic app and the newly built solution."
            badges={[
              "React",
              "Typescript",
              "Webpack",
              "GraphQL",
              "Express",
              "Java",
              "MongoDB",
            ]}
            url="https://www.duettocloud.com/"
          />
          <ExperienceCard
            dateRange="Mar 2018 – Nov 2020"
            title="Lead Member of Technical Staff · Duetto"
            body="Built many new features in React, made improvements to legacy code, and fixed legacy bugs in backbone and jquery"
            badges={["React", "Java", "Backbone", "jQuery"]}
            url="https://www.duettocloud.com/"
          />
          <ExperienceCard
            dateRange="Aug 2015 – Mar 2018"
            title="Front End Engineer · Stride Health"
            body="Enhanced the Angular app by revamping the UI for recommended health insurance plans, plan details, and family member management. Developed new, mobile-first pages and flows in React, including the first-time user funnel, vision insurance flow, and Stride Tax integration."
            badges={["React", "Angular", "Node.js", "PostgreSQL"]}
            url="https://www.stridehealth.com/"
          />
          <ExperienceCard
            dateRange="Jun 2012 – Aug 2015"
            title="Senior Member of Technical Staff · Salesforce"
            body="Implemented, tested, and integrated Salesforce Analytics Reports and Dashboards for both the desktop web app and the mobile app (Salesforce1), utilizing Salesforce Aura and Java."
            badges={["Java", "Salesforce Aura", "Selenium"]}
            url="https://www.salesforce.com/"
          />
          <ExperienceCard
            dateRange="Aug 2010 – Jun 2012"
            title="Member of Technical Staff · Salesforce"
            body="I contributed to the development of the mobile version of Salesforce (formerly touch.salesforce.com) using Java and Salesforce's newly developed, in-progress internal UI library, Salesforce Aura."
            badges={["Java", "Salesforce Aura", "Selenium"]}
            url="https://www.salesforce.com/"
          />
          <ExperienceCard
            dateRange="Jul 2008 – Aug 2010"
            title="Associate Member of Technical Staff · Salesforce"
            body="As a member of the Salesforce Analytics team, I contributed to the development of a drag-and-drop interactive report builder and the integration of a new charting engine."
            badges={["Java", "Selenium"]}
            url="https://www.salesforce.com/"
          />
        </div>
      </section>
    </div>
  );
}
