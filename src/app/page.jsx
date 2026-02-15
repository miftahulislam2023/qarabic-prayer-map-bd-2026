import BangladeshMap from "@/components/BangladeshMap/BangladeshMap";
import Information from "@/components/BangladeshMap/Information";

export default function Home() {
  return (
    <div className="bg-gray-100 min-h-screen md:h-screen md:overflow-hidden">
      <div className="mx-auto max-w-375 md:flex md:h-full">
        <section className="md:flex-1 md:min-w-0">
          <BangladeshMap />
        </section>
        <aside className="border-t md:border-t-0 md:border-l border-teal-100/70 md:w-80 lg:w-95 bg-white/60 backdrop-blur-sm">
          <Information />
        </aside>
      </div>
    </div>
  );
}
