import LunchBallet from "@/components/home/LunchBallet";
import { AbChooser } from "@/components/ab/AbChooser";
import { Facts, FourRoles, Route, Statement } from "@/components/home/Story";

export default function Home() {
  return (
    <main>
      <LunchBallet />
      <AbChooser />
      <Statement />
      <Facts />
      <FourRoles />
      <Route />
    </main>
  );
}
