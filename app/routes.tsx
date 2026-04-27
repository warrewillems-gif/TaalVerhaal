import { createHashRouter } from "react-router";
import { Overview } from "./components/Overview";
import { StoryPage } from "./components/StoryPage";

export const router = createHashRouter([
  {
    path: "/",
    Component: Overview,
  },
  {
    path: "/story/:id",
    Component: StoryPage,
  },
]);
