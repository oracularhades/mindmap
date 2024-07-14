import Home1 from "@/components/home/home";
import Waterfall from "@/components/internal_components/mindmap/waterfall/waterfall";

export default function Page_frame_mindmap() {
    const dataArray = [
        [
            {
                content: 'Why is :~water~: important?',
                into: [
                    {
                        content: 'Almost all water (96.5%) is in the oceans. Fresh water is rare and precious.',
                        into: []
                    },
                    {
                        content: 'Water fills our cells. Up to 60% of an adult human is water.',
                        into: []
                    },
                    {
                        content: 'All other animals rely on water too, both as part of their bodies and as a place to live.',
                        into: []
                    },
                    {
                    content: ':~Plants~: also depend on water. They need water to transport food and minerals around their bodies, to make food in photosynthesis and for support.',
                        into: []
                    }
                ]
            }
        ],
        [
            {
                content: 'The properties of water ',
                into: [
                    {
                        content: "It is the special properties of water that make it important to life. "
                    },
                    {
                        content: "Three important properties of water:",
                        into: [
                            {
                                content: "Water is a very good solvent.",
                                into: [
                                    { content: "Many substances dissolve in it." },
                                    { content: "All the chemical reactions of life take place in solution in water." },
                                    { content: "Sea water contains 3.5% dissolved sodium chloride (salt) an many other minerals." },
                                    { content: "Your blood is water containing many dissolved food molecules, mineral salts and chemical messengers, as well as your blood cells." }
                                ]
                            }
                        ]
                    },
                    {
                        content: "Water is also in our organs (insert table 1, p 79)"
                    },
                    {
                        content: "All other animals rely on water too, both as part of their bodies and as a place to live."
                    },
                    {
                        content: "Plants also depend on water. They need water to transport food and minerals around their bodies, to make food in photosynthesis and for support."
                    }
                ]
            }
        ],
        [
            {
                content: 'Item 3',
                into: []
            }
        ]
    ];

    return (
        <div className="frame_div">
            <Home1>
                <Waterfall data={dataArray}/>
            </Home1>
        </div>
    )
}