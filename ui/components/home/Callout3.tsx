import React, { useState, useEffect, useRef } from "react";
import IndexCard from '../layout/IndexCard';
import IndexCardGrid from "../layout/IndexCardGrid";
import cytoscape from 'cytoscape';

const indexCardData = [
  {
    icon: "/assets/icon-astronaut.svg",
    iconAlt: "Astronaut",
    header: "Sending Members To Space",
    link: "/sweepstakes",
    hovertext: "Meet Our Astronauts",
    paragraph: (
      <>
        Sent the first crowdraised astronaut to space, through a democratically governed onchain vote, and randomly chose a second member of the community via an on-chain sweepstakes.
      </>
    )
  },
  {
    icon: "/assets/icon-ethereum.svg",
    iconAlt: "Ethereum",
    header: "Funding Open Space R&D",
    link: "/propose",
    hovertext: "Submit Your Idea",
    paragraph: (
      <>
        Allocated $300,000+ to over 60 projects and space R&D through community governance, like open source time standards for PNT on the Moon (shortlisted by DARPA for a grant).
      </>
    )
  },
  {
    icon: "/assets/icon-plane.svg",
    iconAlt: "Plane",
    header: "Astronaut Training Program",
    link: "/zero-gravity",
    hovertext: "Train With Us",
    paragraph: (
      <>
        Training future space travelers with innovative programs, like chartering an entire zero gravity flight alongside three NASA astronauts, Charlie Duke, Nicole Stott, and Doug Hurley.
      </>
    )
  },
  {
    icon: "/assets/icon-dao.svg",
    iconAlt: "DAO",
    header: "Space Acceleration Network",
    link: "/join",
    hovertext: "Join the Network",
    paragraph: (
      <>
        The Space Acceleration Network is a startup society that connects space visionaries and organizations with the funding, tools, and support needed to turn bold ideas into reality. 
      </>
    )
  },
  {
    icon: "/assets/icon-lander.svg",
    iconAlt: "Lander",
    header: "First Moon Mission Planned",
    link: "https://docs.moondao.com/Governance/Constitution",
    hovertext: "Read the Constitution",
    paragraph: (
      <>
        Established a constitution for self-governance, which will be sent to the surface of the Moon in late-2024 as part of a LifeShip capsule alongside the DNA of MoonDAO members.
      </>
    )
  },
  {
    icon: "/assets/icon-governance.svg",
    iconAlt: "Governance",
    header: "Transparent Governance",
    link: "/analytics",
    hovertext: "See Our Analytics",
    paragraph: (
      <>
        We believe in being open, including open source, transparency, and decentralization. As a DAO, we utilize blockchain technologies offering full transparency and accountability.
      </>
    )
  }
];

export default function Callout3() {
    const [singleCol, setSingleCol] = useState(false);
    const cyRef = useRef(null);

    useEffect(() => {
        if (!cyRef.current) return;

        const elements = {
            nodes: [
                { data: { id: 'lisa', name: 'Lisa Patel', role: 'Team Lead', 
                    image: '/assets/team/leader.svg' }},
                { data: { id: 'sarah', name: 'Sarah Chen', role: 'Software Engineer', 
                    image: '/assets/team/engineer.svg' }},
                { data: { id: 'mike', name: 'Mike Rodriguez', role: 'Product Manager', 
                    image: '/assets/team/product.svg' }},
                { data: { id: 'emma', name: 'Emma Taylor', role: 'Data Scientist', 
                    image: '/assets/team/data.svg' }},
                { data: { id: 'james', name: 'James Kim', role: 'UX Designer', 
                    image: '/assets/team/designer.svg' }},
                { data: { id: 'alex', name: 'Alex Singh', role: 'Developer', 
                    image: '/assets/team/developer.svg' }},
                { data: { id: 'david', name: 'David Foster', role: 'DevOps', 
                    image: '/assets/team/devops.svg' }},
                { data: { id: 'maria', name: 'Maria Garcia', role: 'QA Engineer', 
                    image: '/assets/team/qa.svg' }},
                { data: { id: 'ryan', name: 'Ryan Cooper', role: 'Backend Dev', 
                    image: '/assets/team/backend.svg' }},
                { data: { id: 'julia', name: 'Julia Zhang', role: 'Frontend Dev', 
                    image: '/assets/team/frontend.svg' }}
            ],
            edges: [
                { data: { source: 'lisa', target: 'sarah', relationship: 'Manages' } },
                { data: { source: 'lisa', target: 'mike', relationship: 'Coordinates' } },
                { data: { source: 'lisa', target: 'emma', relationship: 'Oversees' } },
                { data: { source: 'lisa', target: 'james', relationship: 'Directs' } },
                { data: { source: 'lisa', target: 'alex', relationship: 'Manages' } },
                { data: { source: 'lisa', target: 'david', relationship: 'Supervises' } },
                { data: { source: 'lisa', target: 'maria', relationship: 'Manages' } },
                { data: { source: 'lisa', target: 'ryan', relationship: 'Oversees' } },
                { data: { source: 'lisa', target: 'julia', relationship: 'Directs' } }
            ]
        };

        const cy = cytoscape({
            container: cyRef.current,
            elements: elements,
            style: [
                {
                    selector: 'node',
                    style: {
                        'background-color': 'transparent',
                        'border-width': 3,
                        'border-color': '#00308F',
                        'label': 'data(name)',
                        'color': '#000000',
                        'text-valign': 'bottom',
                        'text-halign': 'center',
                        'text-margin-y': 5,
                        'width': 50,
                        'height': 50,
                        'font-size': '8px',
                        'background-image': 'data(image)',
                        'background-fit': 'cover',
                        'background-clip': 'none'
                    }
                },
                {
                    selector: '#lisa',
                    style: {
                        'border-color': '#B22222',
                        'border-width': 4,
                        'width': 60,
                        'height': 60
                    }
                },
                {
                    selector: 'edge',
                    style: {
                        'width': 2,
                        'line-color': '#666',
                        'curve-style': 'bezier',
                        'label': 'data(relationship)',
                        'font-size': '8px',
                        'text-rotation': 'autorotate',
                        'text-margin-y': -10,
                        'text-background-color': '#fff',
                        'text-background-opacity': 1,
                        'text-background-padding': '2px'
                    }
                },
                {
                    selector: 'edge[source = "lisa"]',
                    style: {
                        'line-color': '#B22222',
                        'width': 3
                    }
                }
            ],
            layout: {
                name: 'concentric',
                concentric: function(node) {
                    return node.id() === 'lisa' ? 2 : 1;
                },
                levelWidth: function() { return 1; },
                minNodeSpacing: 50,
                animate: false
            }
        });

        cy.nodes().ungrabify().grabify();
        cy.userZoomingEnabled(true);
        cy.userPanningEnabled(true);

        cy.on('mouseover', 'node', function(evt){
            const node = evt.target;
            node.style({
                'label': node.data('name') + '\n' + node.data('role')
            });
        });

        cy.on('mouseout', 'node', function(evt){
            const node = evt.target;
            node.style({
                'label': node.data('name')
            });
        });

        return () => {
            cy.destroy();
        };
    }, []);

    return ( 
        <section id="callout3-container" 
          className="relative items-start w-full justify-end md:items-start lg:items-start md:justify-end lg:justify-center mt-[5vmax]"
          >
          <div id="background-elements" 
            className="overflow-visible"
          ></div>
          <h2 className="header text-center font-GoodTimes pb-5">What MoonDAO Does</h2>  
          <div 
            ref={cyRef}
            className="w-full h-[80vh] mx-auto mb-10"
          />
          <div id="cards-container" 
            className="rounded-[5vmax] rounded-tr-[0px] p-5 md:p-10 overflow-hidden max-w-[1200px]"
            >
            <IndexCardGrid cards={indexCardData} />
          </div>

        </section>
    )
}
