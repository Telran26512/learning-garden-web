export type DiscoverItem = {
  id: string;
  label: string;
  mark: string;
};

export type ExploreFeedTab = "Trending" | "Latest" | "Following" | "Tags";
export type ExploreRange = "24h" | "7d" | "30d" | "all";

export type ExploreFeedItem = {
  author: string;
  avatar: string;
  body: string;
  cites: number;
  color: string;
  comments: number;
  handle: string;
  meta: string;
  swatches: readonly string[];
  tags: readonly string[];
  title: string;
  votes: number;
};

export type ExploreTrack = readonly [
  rank: string,
  title: string,
  handle: string,
  score: string,
];

export type ExplorePaper = readonly [
  id: string,
  title: string,
  author: string,
  cites: string,
];

export type ExplorePerson = readonly [
  name: string,
  handle: string,
  meta: string,
  color: string,
];
