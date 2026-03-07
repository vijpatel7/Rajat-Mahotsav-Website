import { getCloudflareImage } from "@/lib/cdn-assets";

export interface EventPhoto {
  url: string
  caption?: string
}

export interface EventData {
  id: string
  date: string // ISO format: "2025-03-15"
  title: string
  description: string
  tags: string[] // e.g., ["community seva", "religious"]
  youtubeVideoId?: string // YouTube video ID (not full URL)
  instagramUrl?: string
  photos: EventPhoto[] // Array of photo objects
}

// Helper function for tag colors - using warm orange/red/amber palette
export const tagColors: Record<string, { bg: string; text: string; border: string }> = {
  "community seva": { bg: "bg-orange-100", text: "text-orange-700", border: "border-orange-300" },
  // "mandir event": { bg: "bg-amber-100", text: "text-amber-700", border: "border-amber-300" },
  "religious": { bg: "bg-red-100", text: "text-red-700", border: "border-red-300" },
  "cultural": { bg: "bg-orange-100", text: "text-orange-800", border: "border-orange-400" },
  "youth event": { bg: "bg-amber-100", text: "text-amber-800", border: "border-amber-400" },
}

export const eventsData: EventData[] = [
  {
    id: "13",
    date: "2026-02-01",
    title: "Secaucus Temple Prepares over 1,750 meals for school kids",
    description: "Volunteers at Shree Swaminarayan Temple Secaucus came together to prepare and package over 1,750 PB&J meals with an apple, granola bar, and water for each child. The temple then delivered these meals to school kids in the Bronx, NYC as part of its ongoing commitment to community service and youth support.",
    tags: ["community seva", "youth event"],
    youtubeVideoId: "4jqrxR1_v1I",
    photos: []
  },
  {
    id: "12",
    date: "2025-02-21",
    title: "Annual Holiday Food & Toy Drive",
    description: "Shree Swaminarayan Temple Secaucus collected food and toys for the annual toy and food drive. The food was donated to the Secaucus town food pantry and the toys were donated to kids spending their holiday season in the hospital. The family at the Secaucus Temple wanted to spread some joy this holiday season with gifts for kids!",
    tags: ["community seva", "youth event"],
    photos: [
      {
        url: getCloudflareImage("abff8be5-211e-4808-ec05-97a49e83ca00"),
      },
      {
        url: getCloudflareImage("b6a3e882-76e9-411a-958d-e30b06fa0900"),
      },
      {
        url: getCloudflareImage("dd163d10-08c1-4549-a7b9-a8aef5fc3a00"),
      }
    ]
  },
  {
    id: "1",
    date: "2025-09-27",
    title: "New Jersey Turnpike 5K",
    description: "Members of Shree Swaminarayan Temple Secaucus, NJ participated in the NJ Turnpike 5K as part of the upcoming Celebrations of Shree Swaminarayan Mandir Secaucus, New Jersey Rajat Mahotsav",
    tags: ["community seva"],
    youtubeVideoId: "_sRpl5rM-M8",
    photos: [
      {
        url: getCloudflareImage("944138d2-cc15-45f5-6eec-f4a6a3e30800"),
      },
      {
        url: getCloudflareImage("6716efee-9276-49d0-5567-939256091b00"),
      },
      {
        url: getCloudflareImage("d831cbaa-7951-4e7b-7508-bb4ef78acb00"),
      },
      {
        url: getCloudflareImage("4308a0c3-a63c-40a2-6633-1b2b7a8cfe00"),
      },
      {
        url: getCloudflareImage("39e70434-dba2-4e6f-e23b-6f0d2bdf3500"),
      }
    ]
  },
    {
    id: "2",
    date: "2025-10-18",
    title: "Secaucus Temple Open House & Diwali Celebrations",
    description: "Members of Shree Swaminarayan Temple Secaucus, NJ celebrate Diwali and hold an Open House for the local community. This year's celebrations held many events targetted to our upcoming Rajat Mahotsav including a blood drive to support the community, a Diwali Raffle with all funds going towards helping the community, and the start of new prayer and relgious vows for the new year to help devotees grow spiritually throughout the 25th year anniversary.",
    tags: ["religious", "cultural", "community seva"],
    youtubeVideoId: "EOn8vbNr8MA",
    photos: [
      {
        url: getCloudflareImage("b06f092a-3c85-49dc-0882-3bfd3fa7b300"),
      },
      {
        url: getCloudflareImage("a333cd78-13f4-4db7-63fc-13d627204e00"),
      },
      {
        url: getCloudflareImage("1faf5711-0bd2-4d22-e8be-025cde36bd00"),
      },
      {
        url: getCloudflareImage("dc21bd58-eb3f-4101-3e68-50b23d76d300"),
      },
      {
        url: getCloudflareImage("1ca747bc-1aac-4e47-1211-e3bfd4f03e00"),
      },
      {
        url: getCloudflareImage("0dc5bd0d-ce06-4ce6-ffd9-6ce827a28d00"),
      },
      {
        url: getCloudflareImage("e80793ff-08e1-4d66-1817-cbfad98cdf00"),
      }
    ]
  },
  {
    id: "5",
    date: "2025-10-25",
    title: "CPR Training With Beat to Breathe",
    description: "Every 90 seconds, someone in the United States has a cardiac arrest. Shree Swaminarayan Temple - Secaucus, New Jersey partnered with Beat to Breathe to host a CPR workshop. Fifty volunteers gathered in Shree Muktajeevan Swamibapa Community Hall to learn life saving medical skills. Secaucus Temple looks forward to continuing to host a year of community events, in celebration of our upcoming Rajat Mahotsav • 25th Anniversary!",
    tags: ["youth event", "community seva"],
    youtubeVideoId: "eJPBUDgnb2A",
    photos: [
    ]
  },
  {
    id: "6",
    date: "2025-10-26",
    title: "New York Giants 5K Run",
    description: "Shree Swaminarayan Temple - Secaucus, New Jersey participates in the New York Giants 5k Charitable Walk at Metlife Stadium.",
    tags: ["youth event", "community seva"],
    youtubeVideoId: "n6i-uv-alXk",
    photos: [
      {
        url: getCloudflareImage("a7f8e40b-8ba0-4722-68c2-54bd227ab500"),
        caption: "5k group"
      }
    ]
  },
  {
    id: "7",
    date: "2025-11-01",
    title: "Community Food Bank NJ Volunteering",
    description: "Shree Swaminarayan Temple - Secaucus, New Jersey partnered with the Community Food Bank of NJ to help prepare and package supplies and food for the those in need.",
    tags: ["youth event", "community seva"],
    // youtubeVideoId: "eJPBUDgnb2A",
    photos: [
      {
        url: getCloudflareImage("f15a59ae-28ce-4268-5fe0-67715b18d600"),
      },
      {
        url: getCloudflareImage("edf59daf-b998-43a2-211d-7a88c78e7400"),
      },
      {
        url: getCloudflareImage("9c39145a-bf9d-4e05-04b3-cd2b9d886b00"),
      },
      {
        url: getCloudflareImage("3c5ee780-591e-4f99-f34e-453b459e4900"),
      },
      {
        url: getCloudflareImage("c1749495-1673-491a-f0c7-ae6b1a321800"),
      }
    ]
  },
  {
    id: "11",
    date: "2025-11-21",
    title: "Shree Swaminarayan Temple Kids donate nearly 150 Pounds of Candy for the troops!",
    description: "During the halloween, the kids of Shree Swaminarayan Temple Secaucus decided to donate kids for the American Troops helping protect our country. We partnered with Soldiers’ Angels for their Treats to Troops initiative to encourage everyone to donate excess candy to our beloved troops. They collected and dontated 142 pound of candy!!",
    tags: ["community seva", "youth event"],
    instagramUrl: "https://www.instagram.com/reel/DRUlwtajqiP/",
    photos: [
      {
        url: getCloudflareImage("5dedc919-b469-4a61-7cac-99a59f74f600"),
      },
      {
        url: getCloudflareImage("325cc631-902b-4ea4-2beb-1d11f2543e00"),
      },
      {
        url: getCloudflareImage("4df0d86c-3410-45d1-6bfd-889f05481600"),
      }
    ]
  },
  {
    id: "8",
    date: "2026-02-23",
    title: "Rajat Pratishta Mahotsav Launch at Shikshapatri Dvishatabdi Mahotsav",
    description: "Disciples of North America excitingly welcomed all Swaminarayan Gadi Disciples from around the globe at the Shikshapatri Dvishatabdi Mahotsav in Maninanagardham. Disciples raised the excitement for upcoming Mahotsav and gave everyone a preview of the festivities to come!",
    tags: ["religious"],
    youtubeVideoId: "4w6Ga_CYvNM",
    photos: []
  },
  {
    id: "9",
    date: "2026-02-21",
    title: "750 PB&J Sandwiches freshly made and delivered to Hoboken Homeless Shelter!",
    description: "Disciples gathered together to make over 750 Peanut Butter & Jelly Sandwiches to donate to the Hoboken Homeless Shelter. This winter has been difficult for many and the disciples are doing all they can to help support those who need it by providing prasad from Swaminaryan Bhagwan.",
    tags: ["religious", "community seva", "youth event"],
    photos: [
      {
        url: getCloudflareImage("b34f616c-5090-427b-f85b-0a8320def000"),
      },
      {
        url: getCloudflareImage("462c5661-206c-467d-d2de-ca7150f67000"),
      },
      {
        url: getCloudflareImage("8776e1bb-b558-4dd3-5fb5-82a45ef14d00"),
      },
      {
        url: getCloudflareImage("0caf975c-f591-4e70-fcb6-9f5c799e9600"),
      },
      {
        url: getCloudflareImage("962b25a2-4a61-4a40-179e-c2e2213e2000"),
      },
      {
        url: getCloudflareImage("8d66da14-485d-47eb-11b9-808f8911c500"),
      }
    ]
  },
  {
    id: "10",
    date: "2026-02-14",
    title: "Ladies of Shree Swaminarayan Temple New Jersey Knit Scarves for the Homeless",
    description: "The winter has been extremely cold this year. Disciples volunteered to knit scarves and offer them to the less foruntate who are braving out the cold winter through difficult circumstances. Their efforts will be cherished by Lord Swaminarayan and the people that make use of the scarves to stay warm.",
    tags: ["religious", "community seva"],
    photos: [
      {
        url: getCloudflareImage("8cef43c8-23f1-4972-ea93-0a6045b4d600"),
      },
      {
        url: getCloudflareImage("85301d44-32e6-4080-5bd1-fabc9191af00"),
      },
      {
        url: getCloudflareImage("0dac8287-96a9-476f-7fdd-b4de7c318500"),
      },
      {
        url: getCloudflareImage("797c471d-683a-40f7-8f3a-e5343c3ffd00"),
      },
      {
        url: getCloudflareImage("99559e34-d8a7-468b-2a35-cc1ae87c6e00"),
      },
      {
        url: getCloudflareImage("f92ca90b-4902-4a2d-9a97-894d1ef0ce00"),
      },
      {
        url: getCloudflareImage("5dedb24c-9b65-46e9-7acc-19b0d936f100"),
      }
    ]
  },
]
