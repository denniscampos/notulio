import { PricingTable } from 'autumn-js/react';

export default function Home() {
  return (
    <div className="h-screen w-screen flex justify-center items-center p-10">
      <div className="w-full max-w-[800px]">
        <PricingTable />
      </div>
    </div>
  );
}
